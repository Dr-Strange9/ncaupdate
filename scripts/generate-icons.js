import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer with 1 filter byte per scanline
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (rowBytes + 1));

  for (let y = 0; y < height; y++) {
    const rowStart = y * (rowBytes + 1);
    rawData[rowStart] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelIdx = rowStart + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelIdx] = r;
      rawData[pixelIdx + 1] = g;
      rawData[pixelIdx + 2] = b;
      rawData[pixelIdx + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: deflate
  ihdr[11] = 0; // Filter: standard
  ihdr[12] = 0; // Interlace: none
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBody = Buffer.concat([typeBuf, data]);
  const crc = calculateCRC32(crcBody);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// CRC32 implementation
let crcTable = null;
function getCRCTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

function calculateCRC32(buf) {
  const table = getCRCTable();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Draw ER medical cross icon with teal accent on dark background
function drawMedicalIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background: dark #0a0a0a
  let r = 10, g = 10, b = 10, a = 255;

  // Outer border ring for normal icons (radius ~ 44%)
  const maxR = (w / 2) * (isMaskable ? 0.95 : 0.88);
  const ringR = (w / 2) * (isMaskable ? 0.85 : 0.78);

  // Rounded squircle / circular badge
  if (!isMaskable && dist > maxR) {
    return [0, 0, 0, 0]; // Transparent outside for standard icons
  }

  // Ring highlight
  if (Math.abs(dist - ringR) < w * 0.015) {
    return [20, 184, 166, 255]; // er-teal #14b8a6
  }

  // Inner cross dimensions
  const barLen = w * (isMaskable ? 0.44 : 0.48);
  const barThick = w * (isMaskable ? 0.14 : 0.16);

  const inVertBar = Math.abs(dx) <= barThick / 2 && Math.abs(dy) <= barLen / 2;
  const inHorizBar = Math.abs(dy) <= barThick / 2 && Math.abs(dx) <= barLen / 2;

  if (inVertBar || inHorizBar) {
    // Medical Cross in vibrant teal #14b8a6 with soft inner glow
    return [20, 184, 166, 255];
  }

  // Red alert dot / pulse in upper right
  const dotX = cx + w * 0.22;
  const dotY = cy - h * 0.22;
  const dotDist = Math.hypot(x - dotX, y - dotY);
  if (dotDist <= w * 0.045) {
    return [239, 68, 68, 255]; // alert red #ef4444
  }

  return [r, g, b, a];
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate standard icons
const pwa192 = createPNG(192, 192, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), pwa192);

const pwa512 = createPNG(512, 512, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), pwa512);

const maskable512 = createPNG(512, 512, (x, y, w, h) => drawMedicalIcon(x, y, w, h, true));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), maskable512);

const appleIcon = createPNG(180, 180, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleIcon);

// Also generate public/icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0a0a0a"/>
  <circle cx="256" cy="256" r="200" stroke="#14b8a6" stroke-width="8" fill="none" opacity="0.4"/>
  <rect x="216" y="136" width="80" height="240" rx="20" fill="#14b8a6"/>
  <rect x="136" y="216" width="240" height="80" rx="20" fill="#14b8a6"/>
  <circle cx="360" cy="152" r="24" fill="#ef4444"/>
</svg>`;
fs.writeFileSync(path.join(outDir, 'icon.svg'), svg, 'utf8');

console.log('Successfully generated all PWA icons in public/');
