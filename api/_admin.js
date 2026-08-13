import { db } from './_lib.js';

// Valida la sesión admin desde el header X-Session.
// Devuelve true si es válida, false si no.
export async function requireSession(req, res) {
  const session = req.headers['x-session'] || '';
  if (!session) {
    res.status(401).json({ error: 'sesión requerida' });
    return false;
  }
  const doc = await db().collection('sessions').doc(session).get();
  if (!doc.exists) {
    res.status(401).json({ error: 'sesión inválida' });
    return false;
  }
  const s = doc.data();
  if (s.expires < Date.now()) {
    res.status(401).json({ error: 'sesión vencida' });
    return false;
  }
  return true;
}

// Genera un id corto de punto de venta: pos_XXXXXX
export function generarPosId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return 'pos_' + id;
}

export const APP_ORIGIN = 'https://audioguia-basilica.vercel.app';
