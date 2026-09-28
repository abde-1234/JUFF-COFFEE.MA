const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = new Set();

// Follow only files referenced by the site; source artwork, audit screenshots,
// tooling, credentials and repository metadata do not belong in the deployment.
function include(relative) {
  relative = relative.split(/[?#]/)[0].replace(/\\/g, '/');
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(root + path.sep)) throw new Error(`Asset outside project: ${relative}`);
  if (files.has(relative)) return;
  if (!fs.statSync(absolute).isFile()) throw new Error(`Missing asset: ${relative}`);
  files.add(relative);
  if (!/\.(html|css|js|webmanifest)$/.test(relative)) return;
  const text = fs.readFileSync(absolute, 'utf8');
  if (/(?:\b[A-Za-z]:[\\/]|file:\/\/|https?:\/\/(?:localhost|127\.0\.0\.1))/i.test(text)) {
    throw new Error(`Local machine URL in production file: ${relative}`);
  }
  const references = [...text.matchAll(/["'`]((?:assets|images|video)\/[^"'`\s<>]+)["'`]/g)].map(match => match[1]);
  if (relative.endsWith('.html')) {
    for (const match of text.matchAll(/(?:src|href|poster|data-video-src)="([^"]+)"/g)) {
      if (!/^(?:#|\.\/$|[a-z]+:|\/\/)/i.test(match[1])) references.push(match[1]);
    }
  }
  for (const match of text.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) {
    if (!/^(?:data:|https?:|#)/.test(match[1])) references.push(path.posix.join(path.posix.dirname(relative), match[1]));
  }
  references.forEach(include);
}

['index.html', 'style.css', 'script.js', 'robots.txt', 'site.webmanifest'].forEach(include);
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').trim() + '\n';
let sitemap;
const siteUrl = process.env.SITE_URL || require('../package.json').homepage;
if (siteUrl) {
  const domain = new URL(siteUrl);
  if (domain.protocol !== 'https:' || domain.username || domain.password || domain.search || domain.hash || /^(localhost|127\.|\[::1\])/.test(domain.hostname)) {
    throw new Error('SITE_URL must be a public HTTPS site URL without credentials, query or fragment.');
  }
  if (!domain.pathname.endsWith('/')) domain.pathname += '/';
  const site = domain.href;
  const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  html = html.replace('href="./"', `href="${escape(site)}"`)
    .replace('property="og:url" content="./"', `property="og:url" content="${escape(site)}"`)
    .replace(/((?:property="og:image"|name="twitter:image") content=")([^"]+)"/g, (_, prefix, image) => `${prefix}${escape(new URL(image, site).href)}"`)
    .replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => {
      const data = JSON.parse(json);
      data['@id'] = `${site}#juff-coffee`;
      data.url = site;
      data.logo = new URL(data.logo, site).href;
      data.image = new URL(data.image, site).href;
      data.hasMenu['@id'] = `${site}#menu`;
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')}\n  </script>`;
    });
  sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(site)}</loc></url></urlset>\n`;
  robots += `Sitemap: ${site}sitemap.xml\n`;
} else {
  console.warn('Production domain still needs to be inserted. Set SITE_URL before the final build; canonical/social URLs remain relative and sitemap.xml is not generated.');
}

// Only the generated, resolved dist directory may be replaced.
if (fs.existsSync(output)) {
  if (fs.lstatSync(output).isSymbolicLink() || fs.realpathSync(output) !== output) throw new Error('Refusing to replace an unexpected dist path.');
  fs.rmSync(output, { recursive: true });
}
fs.mkdirSync(output);
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
fs.writeFileSync(path.join(output, 'index.html'), html);
fs.writeFileSync(path.join(output, 'robots.txt'), robots);
if (sitemap) fs.writeFileSync(path.join(output, 'sitemap.xml'), sitemap);
const count = files.size + (sitemap ? 1 : 0);
const bytes = [...files].reduce((sum, file) => sum + fs.statSync(path.join(output, file)).size, 0) + (sitemap ? Buffer.byteLength(sitemap) : 0);
console.log(`Built dist/: ${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB. No runtime dependencies.`);
