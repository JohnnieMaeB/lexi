import fs from 'fs';
const EMOJI_RE = /\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*(?:‍\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*)*/gu;
const stripEmoji = t => String(t).replace(EMOJI_RE, '').replace(/[\u{1F3FB}-\u{1F3FF}‍️]/gu, '').replace(/\s{2,}/g, ' ').trim();
const speechText = t => stripEmoji(String(t).replace(/Stress\(ors\)/g, 'Stressors').replace(/\n+/g, '. '));
const lines = JSON.parse(fs.readFileSync('lines.json', 'utf8'));
const seen = new Set(); const jobs = [];
lines.forEach(l => { const k = speechText(l); if (!k || seen.has(k)) return; seen.add(k); jobs.push({ key: k, text: k, file: 'v' + String(jobs.length + 1).padStart(2, '0') + '.mp3' }); });
fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 1));
console.log(jobs.length, 'clips');
