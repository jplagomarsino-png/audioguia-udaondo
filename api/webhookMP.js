import { registrarVenta } from './_lib.js';

export default async function handler(req, res) {
  try {
    const body = req.body || {};
    if (body.type !== 'payment' || !body.data?.id) {
      return res.status(400).send('no payment notification');
    }
    await registrarVenta(body.data.id);
    return res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    return res.status(500).send('error');
  }
}
