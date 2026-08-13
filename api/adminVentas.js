import { db, cors } from './_lib.js';
import { requireSession } from './_admin.js';

// GET /api/adminVentas?comercio=ID  -> historial facturado de un punto de venta
// GET /api/adminVentas               -> resumen global por día (opcional)

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!(await requireSession(req, res))) return;

  const fs = db();
  const comercioId = req.query.comercio;

  try {
    let query = fs.collection('ventas').orderBy('createdAt', 'desc');
    if (comercioId) query = query.where('comercioId', '==', comercioId);

    const snap = await query.limit(500).get();
    const ventas = [];
    snap.forEach((d) => {
      const v = d.data();
      ventas.push({
        paymentId: d.id,
        comercioId: v.comercioId,
        monto: v.monto,
        comision: v.comision,
        createdAt: v.createdAt,
        liquidacion: v.liquidacion || null,
      });
    });

    let total = 0, comisionTotal = 0, pendiente = 0;
    ventas.forEach((v) => {
      total += v.monto || 0;
      comisionTotal += v.comision || 0;
      if (!(v.liquidacion && v.liquidacion.pagado)) pendiente += v.comision || 0;
    });

    return res.json({ ventas, resumen: { total, comisionTotal, pendiente, cantidad: ventas.length } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'error interno' });
  }
}
