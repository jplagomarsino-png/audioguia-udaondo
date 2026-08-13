import { registrarVenta, cors } from './_lib.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { paymentId, deviceId } = req.body || {};
    if (!paymentId || !deviceId) return res.status(400).json({ error: 'faltan datos' });
    const pase = await registrarVenta(paymentId, deviceId);
    return res.json(pase);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || 'pago no aprobado' });
  }
}
