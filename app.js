require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const btoa = require('btoa');
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const ntfyUrl = process.env.NTFY_URL;
const username = process.env.NTFY_USERNAME;
const password = process.env.NTFY_PASSWORD;
const sentrySecret = process.env.SENTRY_CLIENT_SECRET;

function verifySignature(request, secret = "") {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(request.body), "utf8");
  const digest = hmac.digest("hex");
  return digest === request.headers["sentry-hook-signature"];
}

app.post('/webhook', async (req, res) => {
  if (req.headers['sentry-hook-resource'] !== 'event_alert') {
    return res.status(403).send('Forbidden: Invalid resource type.');
  }

  if (!verifySignature(req, sentrySecret)) {
    return res.status(401).send('Invalid signature.');
  }

  try {
    const title = req.body.data.event.title;
    const bodyMessage = req.body.data.event.culprit;
    const issueUrl = req.body.data.event.web_url;

    const headers = {
      'Title': title,
      'Tags': 'beetle',
      'Click': issueUrl
    };

    if (username && password) {
      const auth = 'Basic ' + btoa(username + ':' + password);
      headers['Authorization'] = auth;
    }

    await axios.post(ntfyUrl, bodyMessage, { headers });

    res.status(200).send('Alert sent to Ntfy successfully.');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
