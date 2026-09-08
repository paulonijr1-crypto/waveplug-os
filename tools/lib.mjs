// Shared helpers for the WavePlug OS tools. No dependencies, Node 18+.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function load(relPath, fallback) {
  const p = resolve(ROOT, relPath);
  if (!existsSync(p)) return fallback;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (err) {
    throw new Error(`${relPath} is not valid JSON: ${err.message}`);
  }
}

export function save(relPath, data) {
  const p = resolve(ROOT, relPath);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return p;
}

// Windows terminals handle these fine; NO_COLOR turns them off.
const useColor = !process.env.NO_COLOR;
const wrap = (code) => (s) => (useColor ? `[${code}m${s}[0m` : String(s));
export const c = {
  bold: wrap('1'),
  dim: wrap('2'),
  red: wrap('31'),
  green: wrap('32'),
  yellow: wrap('33'),
  blue: wrap('36'),
  grey: wrap('90'),
};

export const gbp = (n) =>
  '£' + Number(n).toLocaleString('en-GB', { maximumFractionDigits: 0 });
export const pct = (n, dp = 1) => `${(Number(n) * 100).toFixed(dp)}%`;
export const num = (n) => Number(n).toLocaleString('en-GB');

export function rule(char = '─', width = 66) {
  return c.grey(char.repeat(width));
}

export function heading(title) {
  return `\n${c.bold(title)}\n${rule()}`;
}

// Traffic light for a metric against a healthy floor.
export function light(value, ok, warn) {
  if (value >= ok) return c.green('●');
  if (value >= warn) return c.yellow('●');
  return c.red('●');
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export const today = () => new Date().toISOString().slice(0, 10);

// Minimal CSV parser that handles quoted fields containing commas.
export function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1)
    .filter((r) => r.length > 1 || (r[0] ?? '').trim() !== '')
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}
