import { db, bucket, cors } from './_lib.js';
import { requireSession } from './_admin.js';

// POST /api/subirImagen { paradaId, dataUrl }
// Sube la foto de una parada a Firebase Storage y guarda la URL en Firestore.
// Solo admin.

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!(await requireSession(req, res))) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { paradaId, dataUrl } = req.body || {};
    if (!paradaId || !dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'faltan paradaId o imagen' });
    }

    // Parsear dataURL: data:image/jpeg;base64,XXXX
    const m = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
    if (!m) return res.status(400).json({ error: 'formato inválido (usar jpg/png/webp)' });

    const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
    const buffer = Buffer.from(m[2], 'base64');
    if (buffer.length === 0) return res.status(400).json({ error: 'imagen vacía' });
    if (buffer.length > MAX_BYTES) return res.status(413).json({ error: 'imagen demasiado grande (máx 2 MB)' });

    // Nombre de archivo estable por parada
    const filename = `paradas/${paradaId}.${ext}`;
    const file = bucket().file(filename);

    await file.save(buffer, {
      contentType: `image/${m[1] === 'jpeg' ? 'jpeg' : m[1]}`,
      resumable: false,
    });

    // URL con token de acceso (accesible sin hacer público el bucket)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // fecha lejana (no expira en la práctica)
    });

    // Guardar en Firestore
    await db().collection('imagenesParadas').doc(paradaId).set({
      url,
      actualizado: Date.now(),
    });

    return res.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'error interno' });
  }
}
