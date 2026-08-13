import { db, cors, randomToken } from './_lib.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { password } = req.body || {};
  const correcta = process.env.ADMIN_PASSWORD;
  if (!correcta) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD no está configurada en Vercel. Cargala en Settings → Environment Variables.' });
  }
  if (!password || password !== correcta) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }

  const session = randomToken();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  await db().collection('sessions').doc(session).set({
    createdAt: Date.now(),
    expires,
  });

  return res.json({ session, expires });
}
