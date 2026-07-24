import type { Game, GameManifest, GuideSection } from '../types/guide';

type SectionFile = { sections: GuideSection[] } | GuideSection[];

// Guide content is bundled from local JSON at build time; this loader never
// performs network requests. Eager imports keep the directory immediately
// available without adding loading states to the local-first UI.
const manifests = import.meta.glob('./games/*/manifest.json', { eager: true, import: 'default' }) as Record<string, GameManifest>;
const sectionFiles = import.meta.glob('./games/*/*.json', { eager: true, import: 'default' }) as Record<string, SectionFile>;

const warn = (message: string) => { if (import.meta.env.DEV) console.warn(`[guide loader] ${message}`); };
const gameIdFromPath = (path: string) => path.split('/')[2];
const sectionOrder = (section: GuideSection) => Number.isFinite(section.order) ? section.order : Number.POSITIVE_INFINITY;

export const loadGames = (): Game[] => {
 const gameIds = new Set<string>();
 const games = Object.entries(manifests).map(([path, manifest]) => {
  const folderId = gameIdFromPath(path);
  const gameId = manifest.id || folderId;
  if (!manifest.id) warn(`Manifest at ${path} is missing an id; using folder name "${folderId}".`);
  if (manifest.id && manifest.id !== folderId) warn(`Manifest id "${manifest.id}" does not match folder "${folderId}".`);
  if (gameIds.has(gameId)) warn(`Duplicate game id "${gameId}".`);
  gameIds.add(gameId);
  const sections = Object.entries(sectionFiles)
    .filter(([file]) => gameIdFromPath(file) === folderId && !file.endsWith('/manifest.json'))
    .flatMap(([, file]) => Array.isArray(file) ? file : file.sections ?? []);
  const ids = new Set<string>();
  for (const section of sections) {
    if (!section.id) warn(`Game "${manifest.id}" has a section without an id.`);
    if (ids.has(section.id)) warn(`Game "${manifest.id}" has duplicate section id "${section.id}".`);
    ids.add(section.id);
    if (!Number.isFinite(section.order)) warn(`Section "${section.id}" has an invalid or missing order.`);
    const itemIds = new Set<string>();
    for (const step of section.steps) { if (!step.id || itemIds.has(`step:${step.id}`)) warn(`Section "${section.id}" has a missing or duplicate step id.`); itemIds.add(`step:${step.id}`); }
    for (const loot of section.loot) { if (!loot.id || itemIds.has(`loot:${loot.id}`)) warn(`Section "${section.id}" has a missing or duplicate loot id.`); itemIds.add(`loot:${loot.id}`); }
    const walkthroughIds = new Set<string>();
    const stepIds = new Set(section.steps.map((step) => step.id));
    for (const block of section.walkthroughBlocks ?? []) {
      if (!block.id) warn(`Game "${gameId}", section "${section.id}" has a walkthrough block without an id.`);
      if (block.id && walkthroughIds.has(block.id)) warn(`Game "${gameId}", section "${section.id}" has duplicate walkthrough block id "${block.id}".`);
      walkthroughIds.add(block.id);
      if (!block.text) warn(`Game "${gameId}", section "${section.id}", walkthrough block "${block.id || '(missing id)'}" is missing text.`);
      if (!block.spoilerLevel) warn(`Game "${gameId}", section "${section.id}", walkthrough block "${block.id || '(missing id)'}" is missing a spoiler level.`);
      for (const ref of block.checklistRefs ?? []) if (!stepIds.has(ref)) warn(`Game "${gameId}", section "${section.id}", walkthrough block "${block.id || '(missing id)'}" references missing step "${ref}".`);
    }
  }
  return { ...manifest, id: gameId, sections: sections.sort((a, b) => sectionOrder(a) - sectionOrder(b)) };
 });
 return games.sort((a, b) => a.title.localeCompare(b.title));
};
