import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, '../data');
const file = path.join(dataDir, 'db.json');
export function initStore(seed) {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(seed, null, 2));
}
export function readStore() { return JSON.parse(fs.readFileSync(file, 'utf8')); }
export function writeStore(data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
