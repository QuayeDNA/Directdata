import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pngToIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'src', 'assets');
const publicDir = join(root, 'public');

mkdirSync(publicDir, { recursive: true });

async function resize(input, output, width, height) {
  await sharp(input).resize(width, height, { fit: 'cover', position: 'center' }).png().toFile(output);
  console.log(`  ✓ ${output}`);
}

async function resizeOg(input, output, width, height) {
  await sharp(input)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .png()
    .toFile(output);
  console.log(`  ✓ ${output}`);
}

function svgWithPngDataUri(pngPath, viewBox) {
  const data = readFileSync(pngPath);
  const base64 = data.toString('base64');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${viewBox}">
  <image width="${viewBox}" height="${viewBox}" href="data:image/png;base64,${base64}"/>
</svg>`;
}

async function generate() {
  console.log('\nGenerating brand assets...\n');

  const logo = join(srcDir, 'asset.png');
  const ogSrc = join(srcDir, 'asset-og.png');

  // --- Favicon PNGs ---
  console.log('Favicons:');
  const fav16 = join(publicDir, 'favicon-16x16.png');
  const fav32 = join(publicDir, 'favicon-32x32.png');
  await resize(logo, fav16, 16, 16);
  await resize(logo, fav32, 32, 32);

  // --- ICO (needs 256x256 PNG input) ---
  console.log('ICO:');
  const icoInput = join(publicDir, '__favicon-256.png');
  await resize(logo, icoInput, 256, 256);
  const icoBuffer = await pngToIco(icoInput);
  writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
  rmSync(icoInput);
  console.log('  ✓ favicon.ico');

  // --- Apple touch icon ---
  console.log('Apple touch:');
  await resize(logo, join(publicDir, 'apple-touch-icon.png'), 180, 180);

  // --- Android / logos ---
  console.log('Android / Logos:');
  await resize(logo, join(publicDir, 'android-chrome-192x192.png'), 192, 192);
  await resize(logo, join(publicDir, 'android-chrome-512x512.png'), 512, 512);
  await resize(logo, join(publicDir, 'logo-192.png'), 192, 192);
  await resize(logo, join(publicDir, 'logo-512.png'), 512, 512);

  // --- MS tile ---
  console.log('MS Tile:');
  await resize(logo, join(publicDir, 'mstile-150x150.png'), 150, 150);

  // --- OG & Twitter images ---
  console.log('Social images:');
  await resizeOg(ogSrc, join(publicDir, 'og-image.png'), 1200, 630);
  await resizeOg(ogSrc, join(publicDir, 'twitter-image.png'), 1200, 600);

  // --- SVG wrappers (embed PNG as base64 data URI) ---
  console.log('SVGs:');

  const logo192Png = join(publicDir, 'logo-192.png');
  const logo512Png = join(publicDir, 'logo-512.png');
  const favicon32Png = join(publicDir, 'favicon-32x32.png');

  writeFileSync(join(publicDir, 'favicon.svg'), svgWithPngDataUri(favicon32Png, 32));
  console.log('  ✓ favicon.svg');

  writeFileSync(join(publicDir, 'icon.svg'), svgWithPngDataUri(logo192Png, 192));
  console.log('  ✓ icon.svg');

  writeFileSync(join(publicDir, 'logo-192.svg'), svgWithPngDataUri(logo192Png, 192));
  console.log('  ✓ logo-192.svg');

  writeFileSync(join(publicDir, 'logo-512.svg'), svgWithPngDataUri(logo512Png, 512));
  console.log('  ✓ logo-512.svg');

  writeFileSync(join(publicDir, 'vite.svg'), svgWithPngDataUri(favicon32Png, 32));
  console.log('  ✓ vite.svg');

  console.log('\n✅ All brand assets generated!\n');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
