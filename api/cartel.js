import QRCode from 'qrcode';
import { db } from './_lib.js';
import { APP_ORIGIN } from './_admin.js';

// GET /api/cartel?comercio=ID -> HTML imprimible: QR grande + ID + nombre + instrucción
export default async function handler(req, res) {
  const comercioId = req.query.comercio;
  if (!comercioId) return res.status(400).send('falta comercio');

  const url = `${APP_ORIGIN}/?comercio=${comercioId}`;
  const qrData = await QRCode.toDataURL(url, {
    width: 700,
    margin: 1,
    errorCorrectionLevel: 'M',
  });

  let nombre = comercioId;
  try {
    const doc = await db().collection('comercios').doc(comercioId).get();
    if (doc.exists) nombre = doc.data().nombre || comercioId;
  } catch (e) {
    // si Firestore falla, se muestra el id
  }

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QR ${nombre} — Audioguía Basílica de Luján</title>
<style>
  body { font-family: Arial, sans-serif; background:#fff; margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .card { text-align:center; padding:32px; max-width:520px; width:100%; }
  h1 { font-size:22px; color:#0b3d5c; margin:0 0 4px; }
  .sub { font-size:13px; color:#555; margin:0 0 20px; }
  img { width:300px; height:300px; border:1px solid #ddd; border-radius:8px; }
  .id { margin-top:16px; font-family:monospace; font-size:20px; font-weight:bold; letter-spacing:2px; color:#0b3d5c; }
  .inst { margin-top:12px; font-size:13px; color:#777; line-height:1.5; }
</style>
</head>
<body>
  <div class="card">
    <h1>Audioguía de la Basílica de Luján</h1>
    <p class="sub">Escaneá con tu celular para escuchar el recorrido oficial</p>
    <img src="${qrData}" alt="QR">
    <div class="id">${comercioId}</div>
    <p class="inst">Punto de venta: <strong>${nombre}</strong><br>
    Pago por Mercado Pago — pase de acceso digital 24 hs</p>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}
