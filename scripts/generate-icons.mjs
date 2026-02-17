import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

function createIconSvg(size) {
  const fontSize = Math.round(size * 0.22);
  const subFontSize = Math.round(size * 0.09);
  const radius = Math.round(size * 0.18);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#bg)"/>
  <text x="50%" y="42%" text-anchor="middle" dominant-baseline="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${fontSize}px" fill="#FFFFFF" letter-spacing="${Math.round(size * 0.02)}px">FIRE</text>
  <text x="50%" y="62%" text-anchor="middle" dominant-baseline="middle" font-family="Arial,Helvetica,sans-serif" font-weight="400" font-size="${subFontSize}px" fill="#93c5fd" letter-spacing="${Math.round(size * 0.01)}px">SIMULATOR</text>
</svg>`;
}

for (const size of [192, 512]) {
  const svg = createIconSvg(size);
  const out = join(publicDir, `icon-${size}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`Created ${out}`);
}
console.log("Done.");
