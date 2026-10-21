// Draws Lexi's line icons, the three mood-band shapes and the butterfly (docs/DESIGN_WARM_PAPER.md §1, §7, §8)
// as white-on-transparent PNGs. The app tints them with the look's colours (Image tintColor), so one file
// serves every look and no SVG library is needed. Run from lexi-native/:  node tools/make-icons.mjs
// No dependencies: a small path flattener, a scanline filler with 4×4 supersampling and a PNG writer.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

/* ---------- the artwork (SVG path data) ---------- */
// Line icons: 24 × 24 viewBox, 2 px stroke, round caps and joins.
const ICONS = {
  help: ['circle 12 12 10', 'circle 12 12 4', 'M4.93 4.93L9.17 9.17', 'M14.83 14.83L19.07 19.07', 'M14.83 9.17L19.07 4.93', 'M9.17 14.83L4.93 19.07'],
  close: ['M18 6L6 18', 'M6 6L18 18'],
  send: ['M12 19V5', 'M5 12L12 5L19 12'],
  stop: ['M8 6H16A2 2 0 0 1 18 8V16A2 2 0 0 1 16 18H8A2 2 0 0 1 6 16V8A2 2 0 0 1 8 6Z'],
  mic: ['M12 2A3 3 0 0 1 15 5V11A3 3 0 0 1 9 11V5A3 3 0 0 1 12 2Z', 'M19 10V11A7 7 0 0 1 5 11V10', 'M12 18V22', 'M8 22H16'],
  emoji: ['circle 12 12 10', 'M8 14C9.5 16 10.6 16.5 12 16.5S14.5 16 16 14', 'M9 9.5L9.01 9.5', 'M15 9.5L15.01 9.5'],
  speaker: ['M11 5L6 9H2V15H6L11 19Z', 'M15.54 8.46A5 5 0 0 1 15.54 15.53', 'M19.07 4.93A10 10 0 0 1 19.07 19.07'],
  back: ['M19 12H5', 'M12 19L5 12L12 5'],
  next: ['M5 12H19', 'M12 5L19 12L12 19'],
  delete: ['M3 6H21', 'M19 6L18 20A2 2 0 0 1 16 22H8A2 2 0 0 1 6 20L5 6', 'M10 11V17', 'M14 11V17', 'M9 6V4A1 1 0 0 1 10 3H14A1 1 0 0 1 15 4V6'],
  add: ['M12 5V19', 'M5 12H19'],
  check: ['M20 6L9 17L4 12'],
  chevron: ['M6 9L12 15L18 9'],
  play: ['M7 4.5L19 12L7 19.5Z'],
  settings: ['M4 21V14', 'M4 10V3', 'M12 21V12', 'M12 8V3', 'M20 21V16', 'M20 12V3', 'M1 14H7', 'M9 8H15', 'M17 16H23'],
  home: ['M3 10.5L12 3L21 10.5V20A1 1 0 0 1 20 21H15V15H9V21H4A1 1 0 0 1 3 20Z'],
  journal: ['M2 4H8A4 4 0 0 1 12 8V21A3 3 0 0 0 9 18H2Z', 'M22 4H16A4 4 0 0 0 12 8V21A3 3 0 0 1 15 18H22Z'],
};
// Mood-band shapes, filled (24 × 24).
const SHAPES = {
  round: ['circle 12 12 9'],
  spiky: ['M12 1.5L14.6 7.6L21.1 6.4L17.6 12L21.1 17.6L14.6 16.4L12 22.5L9.4 16.4L2.9 17.6L6.4 12L2.9 6.4L9.4 7.6Z'],
  low: ['M2.5 19C2.5 12.5 6.8 8.5 12 8.5S21.5 12.5 21.5 19Z'],
};
// The butterfly (64 × 64), one layer per colour: upper wings, lower wings, body and antennae.
const BUTTERFLY = {
  upper: { fill: ['M31 31C25 17 13 8 7 12C2 16 6 28 15 31C20 32.6 26 32.4 31 32Z', 'M33 31C39 17 51 8 57 12C62 16 58 28 49 31C44 32.6 38 32.4 33 32Z'] },
  lower: { fill: ['M31 34C24 34 15 37 14 45C13 53 22 54 27 47C29.5 43.5 30.6 39 31 35Z', 'M33 34C40 34 49 37 50 45C51 53 42 54 37 47C34.5 43.5 33.4 39 33 35Z'] },
  body: {
    fill: ['M30.4 23.6A1.6 1.6 0 0 1 33.6 23.6V45.4A1.6 1.6 0 0 1 30.4 45.4Z'], // the 3.2 × 25 rect, rx 1.6
    stroke: ['M31 23C29.5 17 27 14 24 12.5', 'M33 23C34.5 17 37 14 40 12.5'], width: 1.8,
  },
};

/* ---------- path flattening ---------- */
const STEPS = 28;
/** Turns one path (or "circle cx cy r") into subpaths of points, each { pts, closed }. */
function flatten(d) {
  if (d.startsWith('circle')) {
    const [cx, cy, r] = d.split(/\s+/).slice(1).map(Number);
    const pts = Array.from({ length: 128 }, (_, i) => [cx + r * Math.cos((i / 128) * 2 * Math.PI), cy + r * Math.sin((i / 128) * 2 * Math.PI)]);
    return [{ pts, closed: true }];
  }
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const subs = [];
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, cur = null, lastC = null;
  const num = () => Number(toks[i++]);
  const start = (px, py) => { cur = { pts: [[px, py]], closed: false }; subs.push(cur); sx = px; sy = py; };
  const line = (px, py) => { cur.pts.push([px, py]); x = px; y = py; };
  const cubic = (x1, y1, x2, y2, px, py) => {
    for (let k = 1; k <= STEPS; k++) {
      const t = k / STEPS, u = 1 - t;
      cur.pts.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * px, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * py]);
    }
    lastC = [x2, y2]; x = px; y = py;
  };
  const arc = (rx, ry, rot, large, sweep, px, py) => {
    // SVG endpoint arc to centre form (rotation is always 0 in this artwork).
    const dx = (x - px) / 2, dy = (y - py) / 2;
    let lam = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
    if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
    const sign = large === sweep ? -1 : 1;
    const num2 = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx;
    const co = sign * Math.sqrt(Math.max(0, num2 / (rx * rx * dy * dy + ry * ry * dx * dx)));
    const cxp = (co * rx * dy) / ry, cyp = (-co * ry * dx) / rx;
    const cx = cxp + (x + px) / 2, cy = cyp + (y + py) / 2;
    const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    const t1 = ang(1, 0, (dx - cxp) / rx, (dy - cyp) / ry);
    let dt = ang((dx - cxp) / rx, (dy - cyp) / ry, (-dx - cxp) / rx, (-dy - cyp) / ry);
    if (!sweep && dt > 0) dt -= 2 * Math.PI;
    if (sweep && dt < 0) dt += 2 * Math.PI;
    const n = Math.max(8, Math.ceil((Math.abs(dt) / Math.PI) * STEPS));
    for (let k = 1; k <= n; k++) { const a = t1 + (dt * k) / n; cur.pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    x = px; y = py; lastC = null;
  };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    if (C === 'M') { start(num() + ox, num() + oy); x = sx; y = sy; cmd = rel ? 'l' : 'L'; lastC = null; }
    else if (C === 'L') { line(num() + ox, num() + oy); lastC = null; }
    else if (C === 'H') { line(num() + ox, y); lastC = null; }
    else if (C === 'V') { line(x, num() + oy); lastC = null; }
    else if (C === 'C') { const a = [num() + ox, num() + oy, num() + ox, num() + oy, num() + ox, num() + oy]; cubic(...a); }
    else if (C === 'S') {
      const r1 = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y];
      const a = [num() + ox, num() + oy, num() + ox, num() + oy]; cubic(r1[0], r1[1], ...a);
    }
    else if (C === 'A') { const a = [num(), num(), num(), num(), num(), num() + ox, num() + oy]; arc(...a); }
    else if (C === 'Z') { cur.closed = true; x = sx; y = sy; lastC = null; }
    else throw new Error('Unsupported path command ' + cmd + ' in ' + d);
  }
  return subs;
}

/* ---------- rasterising ---------- */
const SS = 4; // 4 × 4 samples per pixel
/** Coverage (0..1) per pixel for filled paths (non-zero rule) and stroked paths (round caps and joins). */
function render(size, view, { fill = [], stroke = [], width = 2 }) {
  const k = size / view, n = size * SS;
  const hits = new Uint8Array(n * n);
  // Fill: one scanline per sample row, crossing edges with their winding direction.
  const edges = [];
  for (const d of fill) for (const sp of flatten(d)) {
    const p = sp.pts;
    for (let a = 0; a < p.length; a++) {
      const [x1, y1] = p[a], [x2, y2] = p[(a + 1) % p.length];
      if (y1 !== y2) edges.push([x1 * k * SS, y1 * k * SS, x2 * k * SS, y2 * k * SS]);
    }
  }
  for (let row = 0; row < n; row++) {
    const yy = row + 0.5, xs = [];
    for (const [x1, y1, x2, y2] of edges) {
      if ((yy >= y1 && yy < y2) || (yy >= y2 && yy < y1)) xs.push([x1 + ((yy - y1) / (y2 - y1)) * (x2 - x1), y2 > y1 ? 1 : -1]);
    }
    xs.sort((a, b) => a[0] - b[0]);
    let wind = 0;
    for (let q = 0; q < xs.length - 1; q++) {
      wind += xs[q][1];
      if (!wind) continue;
      const from = Math.max(0, Math.ceil(xs[q][0] - 0.5)), to = Math.min(n - 1, Math.floor(xs[q + 1][0] - 0.5));
      for (let c = from; c <= to; c++) hits[row * n + c] = 1;
    }
  }
  // Stroke: every sample within half the width of a segment.
  const hw = (width / 2) * k * SS;
  for (const d of stroke) for (const sp of flatten(d)) {
    const p = sp.pts.map(([px, py]) => [px * k * SS, py * k * SS]);
    if (sp.closed) p.push(p[0]);
    if (p.length === 1) p.push(p[0]);
    for (let a = 0; a < p.length - 1; a++) {
      const [x1, y1] = p[a], [x2, y2] = p[a + 1];
      const minX = Math.max(0, Math.floor(Math.min(x1, x2) - hw)), maxX = Math.min(n - 1, Math.ceil(Math.max(x1, x2) + hw));
      const minY = Math.max(0, Math.floor(Math.min(y1, y2) - hw)), maxY = Math.min(n - 1, Math.ceil(Math.max(y1, y2) + hw));
      const vx = x2 - x1, vy = y2 - y1, len2 = vx * vx + vy * vy;
      for (let row = minY; row <= maxY; row++) for (let c = minX; c <= maxX; c++) {
        const px = c + 0.5, py = row + 0.5;
        const t = len2 ? Math.max(0, Math.min(1, ((px - x1) * vx + (py - y1) * vy) / len2)) : 0;
        const ex = px - (x1 + t * vx), ey = py - (y1 + t * vy);
        if (ex * ex + ey * ey <= hw * hw) hits[row * n + c] = 1;
      }
    }
  }
  const out = new Float32Array(size * size);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (hits[r * n + c]) out[((r / SS) | 0) * size + ((c / SS) | 0)] += 1 / (SS * SS);
  return out;
}

/* ---------- PNG (white, alpha = coverage) ---------- */
const CRC = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = buf => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, cover) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = raw[o + 1] = raw[o + 2] = 255;
      raw[o + 3] = Math.round(Math.min(1, cover[y * size + x]) * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function write(dir, name, size, view, art) {
  const out = path.join(root, 'assets', dir);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, name + '.png'), png(size, render(size, view, art)));
}
// Icons show at 24 px and shapes at up to 26 px: 96 px covers 3× screens with room for the phone's text size.
for (const [name, d] of Object.entries(ICONS)) write('icons', name, 96, 24, { stroke: d, width: 2 });
for (const [name, d] of Object.entries(SHAPES)) write('shapes', name, 96, 24, { fill: d });
// The butterfly shows at up to 104 px.
for (const [name, art] of Object.entries(BUTTERFLY)) write('butterfly', name, 384, 64, art);
console.log('wrote', Object.keys(ICONS).length, 'icons,', Object.keys(SHAPES).length, 'shapes and', Object.keys(BUTTERFLY).length, 'butterfly layers');
