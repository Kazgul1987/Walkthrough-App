export type SpoilerLevel = 'low' | 'normal' | 'full';
export type SectionType = 'Main Story' | 'Side Quest' | 'Boss' | 'Area' | 'Collectibles' | 'Endgame';
export interface Step { id: string; text: string; optional: boolean; spoilerLevel: SpoilerLevel; reward?: string }
export interface Loot { id: string; name: string; location: string; missable: boolean; notes?: string }
export interface BossGuide { name: string; weaknesses: string[]; resistances: string[]; phases: string[]; recommendedStrategy: string }
export interface GuideSection { id: string; title: string; type: SectionType; area: string; recommendedLevel: string; spoilerLevel: SpoilerLevel; missable: boolean; objective: string; preparation: string; steps: Step[]; boss?: BossGuide; loot: Loot[]; secrets: string[]; missableContent: string[]; commonMistakes: string[]; nextSectionId?: string }
export interface Game { id: string; title: string; platformNotes: string; versionNotes: string; description: string; sections: GuideSection[] }
export interface Progress { steps: Record<string, boolean>; sections: Record<string, boolean>; loot: Record<string, boolean> }
