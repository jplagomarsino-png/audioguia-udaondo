import QRCode from 'qrcode';
import { APP_ORIGIN } from './_admin.js';

// GET /api/qr?comercio=ID  -> PNG del QR listo para WhatsApp
export default async function handler(req, res) {
  const comercioId = req.query.comercio;
  if (!comercioId) return res.status(400).send('falta comercio');

  const url = `${APP_ORIGIN}/?comercio=${comercioId}`;
  try {
    const buffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (e) {
    console.error(e);
    res.status(500).send('error generando QR');
  }
}
