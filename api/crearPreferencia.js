import { mpApi, cors, COMERCIOS, PASES_MAX_DIA, PRECIO_ARS } from './_lib.js';
import { db } from './_lib.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { deviceId, comercioId } = req.body || {};
    if (!deviceId || typeof deviceId !== 'string' || deviceId.length < 8) {
      return res.status(400).json({ error: 'deviceId inválido' });
    }

    // ANTIFRAUDE: límite diario
    const hoy = new Date().toISOString().slice(0, 10);
    const fs = db();
    const dispRef = fs.collection('dispositivos').doc(deviceId);
    const disp = await dispRef.get();
    if (disp.exists) {
      const d = disp.data();
      if (d.dia === hoy && (d.compras || 0) >= PASES_MAX_DIA) {
        return res.status(429).json({ error: 'Límite de compras diario alcanzado para este dispositivo' });
      }
      if (d.baneado) return res.status(403).json({ error: 'Dispositivo bloqueado' });
    }

    const comercio = comercioId && COMERCIOS[comercioId] ? comercioId : null;
    const externalRef = `${deviceId}|${comercio || 'general'}|${Date.now()}`;
    const origin = req.query.origin || 'https://audioguia-basilica.vercel.app';

    const preferencia = await mpApi('/checkout/preferences', 'POST', {
      items: [{
        title: 'Pase de Acceso Digital — Audioguía Basílica de Luján',
        quantity: 1,
        unit_price: PRECIO_ARS,
        currency_id: 'ARS',
      }],
      external_reference: externalRef,
      back_urls: {
        success: `${origin}/#/pago-exitoso`,
        pending: `${origin}/#/pago-pendiente`,
        failure: `${origin}/#/pago-fallido`,
      },
      auto_return: 'approved',
      notification_url: 'https://audioguia-basilica.vercel.app/api/webhookMP',
      statement_descriptor: 'Audioguia Basilica',
    });

    return res.json({ initPoint: preferencia.init_point, preferenceId: preferencia.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'error interno' });
  }
}
