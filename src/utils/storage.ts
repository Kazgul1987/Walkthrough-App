import type { Progress, SpoilerLevel } from '../types/guide';
const keys = { progress: 'walkthrough-companion:progress', spoiler: 'walkthrough-companion:spoiler-mode', notes: 'walkthrough-companion:notes' };
const read = <T,>(key: string, fallback: T): T => { try { const item = localStorage.getItem(key); return item ? JSON.parse(item) as T : fallback; } catch { return fallback; } };
const write = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing or quota errors should not interrupt reading. */ } };
const progressRecord = (value: unknown): Record<string, boolean> => {
 if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
 return Object.fromEntries(Object.entries(value).filter(([, checked]) => typeof checked === 'boolean'));
};
export const loadProgress = (): Progress => {
 const saved = read<unknown>(keys.progress, {});
 if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return { steps: {}, sections: {}, loot: {} };
 const candidate = saved as Partial<Progress>;
 // Older raw IDs remain harmless: current UI only reads fully namespaced keys.
 return { steps: progressRecord(candidate.steps), sections: progressRecord(candidate.sections), loot: progressRecord(candidate.loot) };
};
export const saveProgress = (value: Progress) => write(keys.progress, value);
export const loadNotes = () => read<Record<string, string>>(keys.notes, {});
export const saveNotes = (value: Record<string, string>) => write(keys.notes, value);
export const loadSpoiler = () => read<SpoilerLevel>(keys.spoiler, 'low');
export const saveSpoiler = (value: SpoilerLevel) => write(keys.spoiler, value);
