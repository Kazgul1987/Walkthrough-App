export type SpoilerLevel = 'low' | 'normal' | 'full';

export type SectionType =
  | 'Main Story' | 'Side Quest' | 'Faction' | 'Boss' | 'Area' | 'Collectibles'
  | 'DLC' | 'Achievement' | 'Endgame' | 'Cleanup';

export type DlcName =
  | 'Base Game' | 'Knights of the Nine' | 'Shivering Isles' | 'Mehrune’s Razor'
  | 'Orrery' | 'Wizard’s Tower' | 'Thieves Den' | 'Vile Lair'
  | 'Fighter’s Stronghold' | 'Spell Tomes' | 'Horse Armor Pack'
  | 'Deluxe Content' | 'Unknown';

export interface Step { id: string; text: string; optional: boolean; spoilerLevel: SpoilerLevel; reward?: string }
export interface Loot { id: string; name: string; location: string; missable: boolean; notes?: string }
export interface BossGuide { name: string; weaknesses: string[]; resistances: string[]; phases: string[]; recommendedStrategy: string }
export interface GuideSection {
  id: string; title: string; type: SectionType; order: number; act?: string; chapter?: string;
  area: string; region?: string; city?: string; faction?: string; dlc?: DlcName;
  recommendedLevel: string; spoilerLevel: SpoilerLevel; missable: boolean;
  achievementRelevant?: boolean; uniqueItemRelevant?: boolean;
  objective: string; preparation: string; prerequisites?: string[]; recommendedBefore?: string[];
  locksAfter?: string[]; startLocation?: string; questGiver?: string;
  steps: Step[]; boss?: BossGuide; loot: Loot[]; secrets: string[];
  missableContent: string[]; commonMistakes: string[]; completionCriteria?: string[];
  nextSectionId?: string;
}
export interface GameManifest { id: string; title: string; platformNotes: string; versionNotes: string; description: string }
export interface Game extends GameManifest { sections: GuideSection[] }
export interface Progress { steps: Record<string, boolean>; sections: Record<string, boolean>; loot: Record<string, boolean> }
