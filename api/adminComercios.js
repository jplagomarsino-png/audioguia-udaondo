import { db, cors } from './_lib.js';
import { requireSession, generarPosId } from './_admin.js';

// GET  /api/adminComercios          -> lista con resumen (ventas, facturado, comision, pendiente, pagado)
// POST /api/adminComercios          -> crea punto de venta { nombre, contacto?, cbu? } -> devuelve comercio con id + qrUrl
// PATCH /api/adminComercios         -> edita { id, nombre?, contacto?, cbu?, activo? }

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!(await requireSession(req, res))) return;

  const fs = db();

  try {
    if (req.method === 'GET') {
      const snap = await fs.collection('comercios').orderBy('creado', 'desc').get();
      const comercios = [];
      for (const d of snap.docs) {
        const c = d.data();
        const ventasSnap = await fs.collection('ventas')
          .where('comercioId', '==', d.id)
          .get();
        let ventas = 0, facturado = 0, comision = 0, pendiente = 0, pagado = false, ultimoPago = null;
        ventasSnap.forEach((v) => {
          const venta = v.data();
          ventas += 1;
          facturado += venta.monto || 0;
          comision += venta.comision || 0;
          if (venta.liquidacion && venta.liquidacion.pagado) {
            pagado = true;
            if (!ultimoPago || venta.liquidacion.fecha > ultimoPago) ultimoPago = venta.liquidacion.fecha;
          } else {
            pendiente += venta.comision || 0;
          }
        });
        comercios.push({
          id: d.id,
          nombre: c.nombre || d.id,
          contacto: c.contacto || '',
          cbu: c.cbu || '',
          activo: c.activo !== false,
          creado: c.creado || 0,
          ventas,
          facturado,
          comision,
          pendiente,
          ultimoPago,
        });
      }
      return res.json({ comercios });
    }

    if (req.method === 'POST') {
      const { nombre, contacto, cbu } = req.body || {};
      if (!nombre) return res.status(400).json({ error: 'falta nombre' });
      let id = generarPosId();
      // evitar colisiones
      while ((await fs.collection('comercios').doc(id).get()).exists) {
        id = generarPosId();
      }
      const doc = {
        nombre,
        contacto: contacto || '',
        cbu: cbu || '',
        activo: true,
        creado: Date.now(),
      };
      await fs.collection('comercios').doc(id).set(doc);
      return res.json({
        id,
        ...doc,
        qrUrl: `${process.env.APP_ORIGIN || 'https://audioguia-basilica.vercel.app'}/?comercio=${id}`,
        cartelUrl: `${process.env.APP_ORIGIN || 'https://audioguia-basilica.vercel.app'}/api/cartel?comercio=${id}`,
      });
    }

    if (req.method === 'PATCH') {
      const { id, ...campos } = req.body || {};
      if (!id) return res.status(400).json({ error: 'falta id' });
      const ref = fs.collection('comercios').doc(id);
      if (!(await ref.get()).exists) return res.status(404).json({ error: 'comercio inexistente' });
      const update = {};
      if (campos.nombre !== undefined) update.nombre = campos.nombre;
      if (campos.contacto !== undefined) update.contacto = campos.contacto;
      if (campos.cbu !== undefined) update.cbu = campos.cbu;
      if (campos.activo !== undefined) update.activo = !!campos.activo;
      await ref.update(update);
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'método no soportado' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'error interno' });
  }
}
