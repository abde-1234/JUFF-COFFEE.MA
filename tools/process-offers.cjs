const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/dell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/sharp@0.34.5/node_modules/sharp');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'assets', 'offers', 'generated');
const names = [
  'formule-express',
  'formule-fraicheur',
  'formule-vitalite',
  'formule-cocooning',
  'formule-gourmand',
  'formule-energy-booster',
  'apple-toast-cordyceps-coffee',
  'pineapple-toast-lingzhi-coffee'
];

async function run() {
  for (const name of names) {
    await sharp(path.join(sourceDir, `${name}.png`))
      .resize(600, 450, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(sourceDir, `${name}.webp`));
  }

  const tiles = await Promise.all(names.map(async (name, index) => ({
    input: await sharp(path.join(sourceDir, `${name}.webp`))
      .resize(300, 225)
      .composite([{
        input: Buffer.from(`<svg width="300" height="34"><rect width="300" height="34" fill="#2d190f" fill-opacity=".82"/><text x="12" y="23" fill="#fff8ee" font-size="14" font-family="Arial">${index + 1}. ${name}</text></svg>`),
        top: 191,
        left: 0
      }])
      .png()
      .toBuffer(),
    left: (index % 2) * 300,
    top: Math.floor(index / 2) * 225
  })));

  await sharp({ create: { width: 600, height: 900, channels: 3, background: '#f8ead6' } })
    .composite(tiles)
    .png()
    .toFile(path.join(root, 'assets', 'step9-offers-contact-sheet.png'));

  const results = await Promise.all(names.map(async name => {
    const file = path.join(sourceDir, `${name}.webp`);
    const meta = await sharp(file).metadata();
    return { name, width: meta.width, height: meta.height, bytes: fs.statSync(file).size };
  }));
  console.log(JSON.stringify(results, null, 2));
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
