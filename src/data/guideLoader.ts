import type { Game, GameManifest, GuideSection } from '../types/guide';

type SectionFile = { sections: GuideSection[] } | GuideSection[];
const manifests = import.meta.glob('./games/*/manifest.json', { eager: true, import: 'default' }) as Record<string, GameManifest>;
const sectionFiles = import.meta.glob('./games/*/*.json', { eager: true, import: 'default' }) as Record<string, SectionFile>;

const warn = (message: string) => { if (import.meta.env.DEV) console.warn(`[guide loader] ${message}`); };
const gameIdFromPath = (path: string) => path.split('/')[2];

export const loadGames = (): Game[] => Object.entries(manifests).map(([path, manifest]) => {
  const gameId = gameIdFromPath(path);
  if (!manifest.id) warn(`Manifest at ${path} is missing an id.`);
  if (manifest.id !== gameId) warn(`Manifest id "${manifest.id}" does not match folder "${gameId}".`);
  const sections = Object.entries(sectionFiles)
    .filter(([file]) => gameIdFromPath(file) === gameId && !file.endsWith('/manifest.json'))
    .flatMap(([, file]) => Array.isArray(file) ? file : file.sections ?? []);
  const ids = new Set<string>();
  for (const section of sections) {
    if (!section.id) warn(`Game "${manifest.id}" has a section without an id.`);
    if (ids.has(section.id)) warn(`Game "${manifest.id}" has duplicate section id "${section.id}".`);
    ids.add(section.id);
    const itemIds = new Set<string>();
    for (const step of section.steps) { if (!step.id || itemIds.has(`step:${step.id}`)) warn(`Section "${section.id}" has a missing or duplicate step id.`); itemIds.add(`step:${step.id}`); }
    for (const loot of section.loot) { if (!loot.id || itemIds.has(`loot:${loot.id}`)) warn(`Section "${section.id}" has a missing or duplicate loot id.`); itemIds.add(`loot:${loot.id}`); }
  }
  return { ...manifest, sections: sections.sort((a, b) => a.order - b.order) };
}).sort((a, b) => a.title.localeCompare(b.title));
