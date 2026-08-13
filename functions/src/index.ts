import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

// ============================================================
// CONFIGURACIÓN (editar antes de deploy)
// ============================================================
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
const PRECIO_ARS = 3000;                     // precio del pase
const COMISION_PCT = 0.30;                   // 30% comisión comercios
const PASES_MAX_DIA = 3;                     // máx compras por dispositivo por día
const DURACION_HORAS = 24;                   // duración del pase

// Comercios autorizados (deben coincidir con el frontend)
const COMERCIOS: Record<string, string> = {
  santeria_basilica: 'Santería de la Basílica',
  cafe_plaza: 'Café de la Plaza',
  hotel_lujan: 'Hotel Luján Real',
  regalos_virgencita: 'Regalos de la Virgencita',
  guias_locales: 'Guías de Turismo de Luján',
  puesto_central: 'Puesto de Informes Central',
};

// ============================================================
// HELPERS
// ============================================================
const mpApi = async (path: string, method: 'GET' | 'POST' | 'PUT' = 'GET', body?: any) => {
  const res = await fetch(`https://api.mercadopago.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MP API ${res.status}: ${text}`);
  }
  return res.json();
};

const randomToken = () => crypto.randomBytes(24).toString('hex');

// ============================================================
// 1) crearPreferencia — genera link de pago de Checkout Pro
//    onRequest POST { deviceId, comercioId? }
// ============================================================
export const crearPreferencia = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  if (req.method !== 'POST') { res.status(405).send('POST only'); return; }

  try {
    const { deviceId, comercioId } = req.body || {};
    if (!deviceId || typeof deviceId !== 'string' || deviceId.length < 8) {
      res.status(400).json({ error: 'deviceId inválido' });
      return;
    }

    // ---- ANTIFRAUDE: límite diario por dispositivo ----
    const hoy = new Date().toISOString().slice(0, 10);
    const dispRef = db.collection('dispositivos').doc(deviceId);
    const disp = await dispRef.get();
    if (disp.exists) {
      const d = disp.data()!;
      if (d.dia === hoy && (d.compras || 0) >= PASES_MAX_DIA) {
        res.status(429).json({ error: 'Límite de compras diario alcanzado para este dispositivo' });
        return;
      }
      if (d.baneado) {
        res.status(403).json({ error: 'Dispositivo bloqueado' });
        return;
      }
    }

    const comercio = comercioId && COMERCIOS[comercioId] ? comercioId : null;
    const externalRef = `${deviceId}|${comercio || 'general'}|${Date.now()}`;

    const preferencia = await mpApi('/checkout/preferences', 'POST', {
      items: [
        {
          title: 'Pase de Acceso Digital — Audioguía Basílica de Luján',
          quantity: 1,
          unit_price: PRECIO_ARS,
          currency_id: 'ARS',
        },
      ],
      external_reference: externalRef,
      back_urls: {
        success: `${req.query.origin || 'https://audioguia.example.com'}/#/pago-exitoso`,
        pending: `${req.query.origin || 'https://audioguia.example.com'}/#/pago-pendiente`,
        failure: `${req.query.origin || 'https://audioguia.example.com'}/#/pago-fallido`,
      },
      auto_return: 'approved',
      notification_url: 'https://us-central1-audio-basilica.cloudfunctions.net/webhookMP',
      statement_descriptor: 'Audioguia Basilica',
    });

    res.json({ initPoint: preferencia.init_point, preferenceId: preferencia.id });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || 'error interno' });
  }
});

// ============================================================
// 2) webhookMP — Mercado Pago notifica un pago
//    onRequest POST { type: 'payment', data: { id } }
// ============================================================
export const webhookMP = functions.https.onRequest(async (req, res) => {
  try {
    const body = req.body || {};
    if (body.type !== 'payment' || !body.data?.id) {
      res.status(400).send('no payment notification');
      return;
    }
    const paymentId = body.data.id as string;
    await registrarVenta(paymentId);
    res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    res.status(500).send('error');
  }
});

// ============================================================
// 3) confirmarPago — el frontend lo llama al volver de MP
//    Idempotente: si el pago está aprobado, crea pase + venta
//    onRequest POST { paymentId, deviceId }
// ============================================================
export const confirmarPago = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  if (req.method !== 'POST') { res.status(405).send('POST only'); return; }

  try {
    const { paymentId, deviceId } = req.body || {};
    if (!paymentId || !deviceId) {
      res.status(400).json({ error: 'faltan datos' });
      return;
    }
    const pase = await registrarVenta(paymentId, deviceId);
    res.json(pase);
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.message || 'pago no aprobado' });
  }
});

// ============================================================
// 4) validarPase — el frontend valida el pase al abrir la app
//    onRequest POST { token, deviceId }
// ============================================================
export const validarPase = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  if (req.method !== 'POST') { res.status(405).send('POST only'); return; }

  try {
    const { token, deviceId } = req.body || {};
    if (!token || !deviceId) {
      res.status(400).json({ error: 'faltan datos' });
      return;
    }
    const doc = await db.collection('pases').doc(token).get();
    if (!doc.exists) {
      res.status(404).json({ valido: false, error: 'pase inexistente' });
      return;
    }
    const p = doc.data()!;
    if (p.expiresAt < Date.now()) {
      res.status(410).json({ valido: false, error: 'pase vencido' });
      return;
    }
    if (p.deviceId !== deviceId) {
      res.status(403).json({ valido: false, error: 'el pase pertenece a otro dispositivo' });
      return;
    }
    res.json({ valido: true, expiresAt: p.expiresAt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// LÓGICA CENTRAL: registrar venta (idempotente)
// ============================================================
async function registrarVenta(paymentId: string, deviceIdOverride?: string) {
  // ¿Ya registramos esta venta?
  const ventaRef = db.collection('ventas').doc(paymentId);
  const ventaExistente = await ventaRef.get();
  if (ventaExistente.exists) {
    const v = ventaExistente.data()!;
    // El pase ya fue creado antes
    const paseDoc = await db.collection('pases').doc(v.paseToken).get();
    if (paseDoc.exists) {
      return { token: v.paseToken, expiresAt: paseDoc.data()!.expiresAt };
    }
  }

  // Consultar MP: ¿pago aprobado?
  const payment = await mpApi(`/v1/payments/${paymentId}`);
  if (payment.status !== 'approved') {
    throw new Error(`pago no aprobado (${payment.status})`);
  }

  // external_reference: deviceId|comercio|timestamp
  const ref = payment.external_reference || '';
  const parts = ref.split('|');
  const deviceId = deviceIdOverride || parts[0];
  const comercioId = parts[1] && parts[1] !== 'general' ? parts[1] : null;

  if (!deviceId) throw new Error('external_reference inválida');

  // Re-check límite diario ANTES de emitir
  const hoy = new Date().toISOString().slice(0, 10);
  const dispRef = db.collection('dispositivos').doc(deviceId);
  const disp = await dispRef.get();
  let comprasHoy = 0;
  if (disp.exists) {
    const d = disp.data()!;
    if (d.dia === hoy) comprasHoy = d.compras || 0;
    if (comprasHoy >= PASES_MAX_DIA) {
      throw new Error('límite de compras diario alcanzado');
    }
  }

  const now = Date.now();
  const expiresAt = now + DURACION_HORAS * 60 * 60 * 1000;
  const paseToken = randomToken();

  // Transacción: venta + pase + contador dispositivo
  await db.runTransaction(async (t) => {
    t.set(ventaRef, {
      paymentId,
      deviceId,
      comercioId: comercioId || null,
      monto: PRECIO_ARS,
      comision: comercioId ? Math.round(PRECIO_ARS * COMISION_PCT) : 0,
      paseToken,
      status: 'approved',
      createdAt: now,
    });
    t.set(db.collection('pases').doc(paseToken), {
      deviceId,
      paymentId,
      expiresAt,
      createdAt: now,
    });
    const dispActual = await t.get(dispRef);
    if (dispActual.exists) {
      const d = dispActual.data()!;
      t.update(dispRef, {
        dia: hoy,
        compras: d.dia === hoy ? (d.compras || 0) + 1 : 1,
        ultimoPago: now,
      });
    } else {
      t.set(dispRef, { dia: hoy, compras: 1, ultimoPago: now, baneado: false });
    }
  });

  console.log(`VENTA OK: ${paymentId} | device=${deviceId} | comercio=${comercioId || 'general'}`);
  return { token: paseToken, expiresAt };
}
