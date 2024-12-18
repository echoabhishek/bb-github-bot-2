const crypto = require('crypto');

function validateWebhook(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
  const calculatedSignature = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
}

module.exports = {
  validateWebhook,
};
