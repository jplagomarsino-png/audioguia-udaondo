import { db, cors } from './_lib.js';

// GET /api/imagenesParadas  -> { "bienvenida": "https://...", ... }
// Público: la app del visitante lo usa para mostrar fotos subidas.
export default async function handler(req, res) {
  if (cors(req, res)) return;

  try {
    const snap = await db().collection('imagenesParadas').get();
    const out = {};
    snap.forEach((d) => {
      out[d.id] = d.data().url;
    });
    return res.json(out);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
