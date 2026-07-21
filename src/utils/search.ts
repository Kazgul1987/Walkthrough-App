import type { GuideSection } from '../types/guide';
export const matchesSearch = (section: GuideSection, query: string) => {
  const haystack = [section.title, section.area, section.boss?.name, ...section.loot.map((item) => item.name)].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase().trim());
};
