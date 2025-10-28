const express = require('express');
const https = require('https');
const http = require('http');
const url = require('url');

const router = express.Router();

// Whitelist hosts we allow proxying to (avoid open proxy)
const ALLOWED_HOSTS = new Set([
  'cf.bstatic.com',
]);

router.get('/', (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing url param');

  let parsed;
  try {
    parsed = new URL(target);
  } catch (err) {
    return res.status(400).send('Invalid url');
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return res.status(403).send('Host not allowed');
  }

  const client = parsed.protocol === 'https:' ? https : http;

  const options = {
    headers: {
      // send a user-agent so some servers don't block us
      'User-Agent': 'Hotello-Image-Proxy/1.0',
      Accept: '*/*',
    }
  };

  client.get(target, options, (upstreamRes) => {
    const contentType = upstreamRes.headers['content-type'] || 'application/octet-stream';
    // Set CORS so frontend can use this resource
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    // Pipe upstream response to client
    upstreamRes.pipe(res);
  }).on('error', (err) => {
    console.error('Image proxy error:', err.message);
    res.status(502).send('Failed to fetch image');
  });
});

module.exports = router;
