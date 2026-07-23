# Walkthrough Companion

A lightweight, local-first gaming walkthrough companion. It ships with the fictional **Ashen Gates** demo plus a deliberately small **The Elder Scrolls IV: Oblivion Remastered** structural example. The example is not a walkthrough and contains no copied game-guide text.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run lint` for TypeScript checks. `npm run build` type-checks and creates a production bundle; use `npm run preview` to inspect that bundle.

## Modular guide data

Guides live entirely in local JSON files beneath `src/data/games/`. The Vite-compatible loader (`src/data/guideLoader.ts`) discovers every `manifest.json` and its sibling section JSON files through `import.meta.glob`; it never fetches network data.

```txt
src/data/games/
  my-large-guide/
    manifest.json
    main-quest.json
    factions.json
    collectibles.json
    dlc-example.json
```

### Manifest format

Each guide directory needs a `manifest.json` whose `id` matches its directory name:

```json
{
  "id": "my-large-guide",
  "title": "My Original Guide",
  "platformNotes": "Local guide notes",
  "versionNotes": "Version 1.0",
  "description": "A short directory description."
}
```

### Section-file format

Each non-manifest JSON file contains a `sections` array. Files can group a related questline or contain just one section. Every section needs a unique `id` within its game and an `order`; the loader merges all files and sorts by `order`. Development builds warn in the console about missing or duplicate section, step, and loot IDs.

```json
{
  "sections": [{
    "id": "opening-example",
    "title": "Opening Example",
    "type": "Main Story",
    "order": 10,
    "area": "Example Area",
    "dlc": "Base Game",
    "recommendedLevel": "1–3",
    "spoilerLevel": "low",
    "missable": false,
    "objective": "Write original guidance here.",
    "preparation": "Add player-authored preparation notes.",
    "steps": [], "loot": [], "secrets": [], "missableContent": [], "commonMistakes": []
  }]
}
```

Use the extended metadata in `src/types/guide.ts` for region, city, faction, DLC, prerequisites, achievement relevance, and unique-item relevance. The directory generates its type, DLC, faction, and region/city filters from these values.

## Stable IDs, progress, and spoilers

Keep section, step, and loot IDs stable after publishing a guide. Progress is saved in browser `localStorage`, and the app namespaces all tracking keys as `${gameId}:${id}` so different games cannot collide. Personal notes use the same namespaced section key.

Spoiler levels are `low`, `normal`, and `full`. Individual steps and spoiler blocks stay hidden until the selected mode permits them, or the player explicitly reveals them.

## Adding a large guide

1. Create a lowercase, hyphenated directory under `src/data/games/`.
2. Add a manifest with a matching stable ID.
3. Split content by meaningful boundaries (main story, each faction, city quests, collectibles, and each DLC are good candidates).
4. Give every section an `order` and stable IDs for its sections, steps, and loot.
5. Start with original structural notes, then add only original or appropriately licensed walkthrough content.
6. Run `npm run lint` and `npm run build`.

## Content rules and scope

This project is local-first: it has no backend, authentication, cloud sync, scraping, analytics, external APIs, or copyrighted game assets. Do not add copied guide text, official logos, maps, images, or other unlicensed content. Use original text and appropriately licensed material only.
