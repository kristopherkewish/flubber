// Usage: node validate-state.mjs [stateDir]
// Checks that next-project state files exist and have the expected shape.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const stateDir = process.argv[2] ?? 'D:\\flubber\\state';
const taxonomyPath = join(import.meta.dirname, '..', 'taxonomy.json');

const levels = ['untouched', 'shallow', 'solid'];
const statuses = ['suggested', 'in-progress', 'finished', 'abandoned'];
const reactions = [null, 'liked', 'disliked', 'skipped', 'picked'];
const errors = [];

const readJson = (name) => {
  const p = join(stateDir, name);
  if (!existsSync(p)) { errors.push(`${name}: missing`); return null; }
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { errors.push(`${name}: invalid JSON (${e.message})`); return null; }
};

for (const f of ['profile.md', 'preferences.md', 'research-notes.md']) {
  if (!existsSync(join(stateDir, f))) errors.push(`${f}: missing`);
}

const taxonomy = JSON.parse(readFileSync(taxonomyPath, 'utf8'));
const areaIds = new Set(taxonomy.areas.map((a) => a.id));

const map = readJson('map.json');
if (map) {
  for (const id of areaIds) {
    if (!map.areas?.[id]) errors.push(`map.json: missing area "${id}"`);
  }
  for (const [id, a] of Object.entries(map.areas ?? {})) {
    if (!areaIds.has(id)) errors.push(`map.json: unknown area "${id}"`);
    if (!levels.includes(a.level)) errors.push(`map.json: ${id} has bad level "${a.level}"`);
    if (!Array.isArray(a.projects)) errors.push(`map.json: ${id}.projects must be an array`);
  }
}

const history = readJson('history.json');
if (history) {
  if (!Array.isArray(history.entries)) errors.push('history.json: entries must be an array');
  const ids = new Set();
  for (const e of history.entries ?? []) {
    if (!e.id || ids.has(e.id)) errors.push(`history.json: missing or duplicate id "${e.id}"`);
    ids.add(e.id);
    if (!e.title) errors.push(`history.json: ${e.id} missing title`);
    if (!statuses.includes(e.status)) errors.push(`history.json: ${e.id} bad status "${e.status}"`);
    if (!reactions.includes(e.reaction ?? null)) errors.push(`history.json: ${e.id} bad reaction "${e.reaction}"`);
    for (const a of e.areas ?? []) {
      if (!areaIds.has(a)) errors.push(`history.json: ${e.id} unknown area "${a}"`);
    }
    if (e.status === 'in-progress' && !e.repo) errors.push(`history.json: ${e.id} in-progress without repo`);
  }
}

if (errors.length) {
  console.error(`FAIL (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('OK');
