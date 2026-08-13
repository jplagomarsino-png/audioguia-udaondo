import { db, cors } from './_lib.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { token, deviceId } = req.body || {};
    if (!token || !deviceId) return res.status(400).json({ error: 'faltan datos' });

    const doc = await db().collection('pases').doc(token).get();
    if (!doc.exists) return res.status(404).json({ valido: false, error: 'pase inexistente' });

    const p = doc.data();
    if (p.expiresAt < Date.now()) return res.status(410).json({ valido: false, error: 'pase vencido' });
    if (p.deviceId !== deviceId) return res.status(403).json({ valido: false, error: 'el pase pertenece a otro dispositivo' });

    return res.json({ valido: true, expiresAt: p.expiresAt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
