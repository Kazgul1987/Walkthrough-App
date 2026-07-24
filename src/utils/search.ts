import type { GuideSection } from '../types/guide';
export const matchesSearch = (section: GuideSection, query: string) => {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return true;
  const haystack = [
    section.title, section.area, section.region, section.city, section.faction, section.dlc,
    section.objective, section.boss?.name, ...section.steps.map((step) => step.text),
    ...(section.walkthroughBlocks?.flatMap((block) => [block.title, block.text, block.warning, ...(block.relatedNpc ?? []), ...(block.relatedLocations ?? []), ...(block.relatedQuestIds ?? [])]) ?? []),
    ...section.loot.map((item) => item.name), ...section.secrets, ...section.missableContent,
    ...section.commonMistakes,
  ].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(normalized);
};
