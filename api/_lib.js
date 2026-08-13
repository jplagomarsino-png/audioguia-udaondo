// ============================================================
// LÓGICA COMPARTIDA DEL PAGO (Vercel Functions)
// Firestore via firebase-admin + Mercado Pago Checkout Pro
// ============================================================
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Init Firestore (service account desde env var)
function initFirestore() {
  if (getApps().length === 0) {
    const saKey = process.env.FIREBASE_SA_KEY;
    if (!saKey) throw new Error('FIREBASE_SA_KEY no configurada');
    const sa = JSON.parse(saKey);
    initializeApp({ credential: cert(sa) });
  }
  return getFirestore();
}

export const db = () => initFirestore();

export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
export const PRECIO_ARS = 3000;
export const COMISION_PCT = 0.30;
export const PASES_MAX_DIA = 3;
export const DURACION_HORAS = 24;

export const COMERCIOS = {
  santeria_basilica: 'Santería de la Basílica',
  cafe_plaza: 'Café de la Plaza',
  hotel_lujan: 'Hotel Luján Real',
  regalos_virgencita: 'Regalos de la Virgencita',
  guias_locales: 'Guías de Turismo de Luján',
  puesto_central: 'Puesto de Informes Central',
};

export async function mpApi(path, method = 'GET', body) {
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
}

export const randomToken = () =>
  [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') +
  [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// Registra la venta de forma idempotente. Devuelve { token, expiresAt }
export async function registrarVenta(paymentId, deviceIdOverride) {
  const fs = db();
  const ventaRef = fs.collection('ventas').doc(paymentId);
  const ventaExistente = await ventaRef.get();
  if (ventaExistente.exists) {
    const v = ventaExistente.data();
    const paseDoc = await fs.collection('pases').doc(v.paseToken).get();
    if (paseDoc.exists) {
      return { token: v.paseToken, expiresAt: paseDoc.data().expiresAt };
    }
  }

  const payment = await mpApi(`/v1/payments/${paymentId}`);
  if (payment.status !== 'approved') {
    throw new Error(`pago no aprobado (${payment.status})`);
  }

  const ref = payment.external_reference || '';
  const parts = ref.split('|');
  const deviceId = deviceIdOverride || parts[0];
  const comercioId = parts[1] && parts[1] !== 'general' ? parts[1] : null;

  if (!deviceId) throw new Error('external_reference inválida');

  // Límite diario por dispositivo
  const hoy = new Date().toISOString().slice(0, 10);
  const dispRef = fs.collection('dispositivos').doc(deviceId);
  const disp = await dispRef.get();
  let comprasHoy = 0;
  if (disp.exists) {
    const d = disp.data();
    if (d.dia === hoy) comprasHoy = d.compras || 0;
    if (comprasHoy >= PASES_MAX_DIA) throw new Error('límite de compras diario alcanzado');
  }

  const now = Date.now();
  const expiresAt = now + DURACION_HORAS * 60 * 60 * 1000;
  const paseToken = randomToken();

  await fs.runTransaction(async (t) => {
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
    t.set(fs.collection('pases').doc(paseToken), {
      deviceId,
      paymentId,
      expiresAt,
      createdAt: now,
    });
    const dispActual = await t.get(dispRef);
    if (dispActual.exists) {
      const d = dispActual.data();
      t.update(dispRef, {
        dia: hoy,
        compras: d.dia === hoy ? (d.compras || 0) + 1 : 1,
        ultimoPago: now,
      });
    } else {
      t.set(dispRef, { dia: hoy, compras: 1, ultimoPago: now, baneado: false });
    }
  });

  return { token: paseToken, expiresAt };
}

// Helpers CORS
export function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
