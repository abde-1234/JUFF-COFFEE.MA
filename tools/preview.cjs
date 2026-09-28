const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'dist');
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build before npm run preview.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) return response.writeHead(405, { Allow: 'GET, HEAD' }).end();
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { return response.writeHead(400).end('Bad request'); }
  const file = path.resolve(root, pathname === '/' ? 'index.html' : '.' + pathname);
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end('Forbidden');
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return response.writeHead(404).end('Not found');
    let start = 0;
    let end = stat.size - 1;
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' };
    if (request.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!range || (!range[1] && !range[2])) return response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
      if (!range[1]) start = Math.max(0, stat.size - Number(range[2]));
      else {
        start = Number(range[1]);
        if (range[2]) end = Math.min(end, Number(range[2]));
      }
      if (start > end || start >= stat.size) return response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    response.writeHead(request.headers.range ? 206 : 200, headers);
    if (request.method === 'HEAD') return response.end();
    const stream = fs.createReadStream(file, { start, end });
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  });
}).listen(4173, '127.0.0.1', () => console.log('Production preview (dist only): http://127.0.0.1:4173'));
