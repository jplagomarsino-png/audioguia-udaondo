import { db, cors } from './_lib.js';
import { requireSession } from './_admin.js';

// POST /api/adminMarcarPagado { comercioId }
// Marca todas las ventas pendientes del comercio como pagadas (con fecha).
// Devuelve cuántas se marcaron y el monto liquidado.

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!(await requireSession(req, res))) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { comercioId } = req.body || {};
  if (!comercioId) return res.status(400).json({ error: 'falta comercioId' });

  const fs = db();
  try {
    const snap = await fs.collection('ventas').where('comercioId', '==', comercioId).get();
    const ahora = Date.now();
    let marcadas = 0;
    let monto = 0;

    const batch = fs.batch();
    snap.forEach((d) => {
      const v = d.data();
      if (!(v.liquidacion && v.liquidacion.pagado)) {
        batch.update(d.ref, {
          liquidacion: { pagado: true, fecha: ahora },
        });
        marcadas += 1;
        monto += v.comision || 0;
      }
    });
    if (marcadas > 0) await batch.commit();

    return res.json({ marcadas, monto, fecha: ahora });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'error interno' });
  }
}
