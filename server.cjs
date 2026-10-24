// Server statis tanpa dependensi. Jalankan: node server.cjs  (atau: pm2 start server.cjs --name nekostream)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;                         // <-- ganti port di sini
const ROOT = path.join(__dirname, 'dist'); // folder hasil `npm run build`

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.map': 'application/json',
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  let file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  if (p.endsWith('/') ) file = path.join(file, 'index.html');
  fs.stat(file, (e, st) => {
    if (e || !st.isFile()) file = path.join(ROOT, 'index.html'); // fallback ke index.html
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(500); return res.end('Error: jalankan "npm run build" dulu'); }
      const ext = path.extname(file).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': file.includes(path.sep + 'assets' + path.sep) ? 'public, max-age=31536000, immutable' : 'no-cache',
      });
      res.end(data);
    });
  });
}).listen(PORT, '0.0.0.0', () => console.log(`NekoStream jalan di http://0.0.0.0:${PORT}`));
