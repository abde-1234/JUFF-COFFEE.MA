const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const base = 'http://127.0.0.1:4173';
const site = require('../package.json').homepage;
const list = (directory, relative = '') => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  if (['.git', 'node_modules', '.npm-cache', 'audit-results'].includes(entry.name)) return [];
  const name = path.posix.join(relative, entry.name);
  return entry.isDirectory() ? list(path.join(directory, entry.name), name) : [name];
});
const digest = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

async function main() {
  const files = list(dist);
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(jsonLd['@id'], site + '#juff-coffee');
  assert.equal(jsonLd.hasMenu['@id'], site + '#menu');
  assert.equal(jsonLd.logo, site + 'assets/logo.svg');
  for (const key of ['aggregateRating', 'review', 'openingHours', 'address', 'telephone']) assert.ok(!(key in jsonLd));
  assert.ok(html.includes(`rel="canonical" href="${site}"`));
  assert.ok(html.includes(`property="og:url" content="${site}"`));
  assert.ok(html.includes(`property="og:image" content="${site}assets/social/juff-coffee-og.webp"`));
  assert.ok(html.includes(`name="twitter:image" content="${site}assets/social/juff-coffee-og.webp"`));
  assert.ok(fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8').includes(`<loc>${site}</loc>`));
  assert.ok(fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes(`Sitemap: ${site}sitemap.xml`));

  const productionPaths = [];
  const secrets = [];
  const phoneNumbers = new Set();
  for (const file of list(root)) {
    if (!/\.(?:html|css|js|cjs|mjs|json|webmanifest|md|txt|template)$/.test(file) && !path.basename(file).startsWith('.env')) continue;
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const [type, pattern] of [
      ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
      ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
      ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
      ['OpenAI key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/],
      ['credential assignment', /(?:password|client_secret|api_key|access_token)\s*[:=]\s*["'][^"']{8,}["']/i],
    ]) if (pattern.test(text) && file !== 'tools/audit-static.cjs') secrets.push({ file, type });
    if (file.startsWith('dist/') && /(?:\b[A-Za-z]:[\\/]|file:\/\/|\blocalhost\b|127\.0\.0\.1|REPLACE_WITH_PRODUCTION_DOMAIN)/i.test(text)) productionPaths.push(file);
    if (!file.startsWith('tools/')) for (const match of text.matchAll(/\b(?:212\d{9}|0[567]\d{8})\b/g)) phoneNumbers.add(match[0]);
  }
  assert.deepEqual(productionPaths, []);
  assert.deepEqual(secrets, []);
  assert.deepEqual([...phoneNumbers], ['212631139014']);
  const unchanged = ['index.html', 'script.js'].map(file => {
    const prior = execFileSync('git', ['show', `HEAD:${file}`], { cwd: root });
    // Ignore checkout line-ending conversion while comparing all source content.
    assert.equal(prior.toString('utf8').replace(/\r\n/g, '\n'), fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n'));
    return file;
  });
  const requests = [];
  for (const file of files) {
    const response = await fetch(`${base}/${file}`);
    assert.equal(response.status, 200, `Missing production asset: ${file}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(digest(bytes), digest(fs.readFileSync(path.join(dist, file))), `Wrong preview contents: ${file}`);
    if (!['index.html', 'robots.txt', 'sitemap.xml'].includes(file)) assert.equal(digest(bytes), digest(fs.readFileSync(path.join(root, file))), `Source asset changed: ${file}`);
    requests.push({ file, status: response.status, bytes: bytes.length });
  }
  for (const hidden of ['.env', '.git/config', 'package.json', 'tools/build.cjs', 'assets/README.md', 'sitemap.xml.template']) assert.equal((await fetch(`${base}/${hidden}`)).status, 404);
  const range = await fetch(`${base}/video/juff-coffee.mp4`, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(range.status, 206);
  assert.equal((await range.arrayBuffer()).byteLength, 1024);
  assert.ok(range.headers.get('content-range').startsWith('bytes 0-1023/'));
  const invalidRange = await fetch(`${base}/video/juff-coffee.mp4`, { headers: { Range: 'bytes=99999999-' } });
  assert.equal(invalidRange.status, 416);
  const productBytes = requests.filter(item => /products\/.*\.webp$/.test(item.file)).map(item => item.bytes);
  const result = { result: 'PASS', productionFiles: files.length, totalBytes: requests.reduce((sum, item) => sum + item.bytes, 0), sourceUnchanged: unchanged, localProductionPaths: productionPaths, secrets, phoneNumbers: [...phoneNumbers], productWebPCount: productBytes.length, maxProductBytes: Math.max(...productBytes), averageProductBytes: Math.round(productBytes.reduce((a, b) => a + b, 0) / productBytes.length), seo: { domain: site, jsonLd: 'valid', sitemap: 'valid', robots: 'valid' }, videoRangeRequests: 'PASS', resources: requests };
  fs.mkdirSync(path.join(root, 'audit-results'), { recursive: true });
  fs.writeFileSync(path.join(root, 'audit-results', 'static.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, resources: `${requests.length} successful responses; full evidence in audit-results/static.json` }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
