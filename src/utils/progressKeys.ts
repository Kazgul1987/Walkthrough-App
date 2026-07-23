/**
 * Stable localStorage keys for checklist progress. Including every level of the
 * guide hierarchy prevents commonly named items (for example, "start") from
 * sharing progress between sections or games.
 */
export const sectionKey = (gameId: string, sectionId: string) =>
  `${gameId}:section:${sectionId}`;

export const stepKey = (gameId: string, sectionId: string, itemId: string) =>
  `${sectionKey(gameId, sectionId)}:step:${itemId}`;

export const lootKey = (gameId: string, sectionId: string, itemId: string) =>
  `${sectionKey(gameId, sectionId)}:loot:${itemId}`;
