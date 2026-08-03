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
  "coverImage": "cover.webp",
  "coverImageAlt": "Short description of the cover image",
  "platformNotes": "Local guide notes",
  "versionNotes": "Version 1.0",
  "description": "A short directory description."
}
```

`coverImage` and `coverImageAlt` are optional. To show a cover above the game title in the overview, place an appropriately licensed `avif`, `jpg`, `jpeg`, `png`, `svg`, or `webp` file next to the manifest and reference its filename. If no image is configured (or the file cannot be found), the card keeps its text-only layout. Use an empty `coverImageAlt` for purely decorative artwork; otherwise describe the image concisely.

### Section-file format

Each non-manifest JSON file contains a `sections` array. Files can group a related questline or contain just one section. Every section needs a unique `id` within its game and an `order`; the loader merges all files and sorts by `order`. Development builds warn in the console about missing or duplicate section, step, loot, and walkthrough-block IDs, as well as invalid walkthrough checklist references.

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


### Detailed walkthrough prose

Sections can optionally add `walkthroughBlocks` for route-level instructions that complement, rather than replace, checkable steps. Each block has a stable `id`, required `spoilerLevel` and `text`, and may add a title, warning, optional marker, related NPCs, locations, quest IDs, and `checklistRefs`.

```json
"walkthroughBlocks": [{
  "id": "weynon-next-actions",
  "title": "Turn in the Amulet and prepare the next route",
  "spoilerLevel": "low",
  "text": "Speak with Jauffre and hand over the Amulet of Kings.\n\nAccept the next objective, create a manual save, and visit Chorrol before continuing toward Kvatch.",
  "relatedNpc": ["Jauffre"],
  "relatedLocations": ["Weynon Priory", "Chorrol"],
  "checklistRefs": ["deliver-amulet", "create-manual-save"]
}]
```

Use prose blocks to explain the route, sequencing, and context that a checkbox cannot convey. Use checklist steps to confirm discrete completed actions. Insert paragraph breaks in `WalkthroughBlock.text` with `\n\n`; the UI preserves those line breaks while rendering the plain text. Prose blocks follow the same `low`, `normal`, and `full` spoiler behavior as steps: blocks above the current mode remain behind the existing reveal control.

`checklistRefs` connect a prose block to step IDs in the same section, and every referenced ID must exist in that section. The UI displays the matching checklist step text rather than the raw ID, omits invalid or duplicate references, and lets players click a related step to smoothly scroll to and focus its checklist row. Development validation warns when a reference does not exist.

For large guides, write direct, concise, player-authored paragraphs: prose explains the route, the checklist confirms completion, warning fields flag missables or risky decisions, and metadata connects NPCs, locations, and related quests. All walkthrough text must be original or properly licensed.

## Stable IDs, progress, and spoilers

Keep section, step, and loot IDs stable after publishing a guide. Progress is saved in browser `localStorage` using hierarchical keys: sections use `${gameId}:section:${sectionId}`, steps append `:step:${stepId}`, and loot append `:loot:${lootId}`. This keeps generic IDs from colliding across either games or sections. Personal notes use the namespaced section key. Older raw progress keys are safely ignored rather than migrated.

Spoiler levels are `low`, `normal`, and `full`. Individual steps and spoiler blocks stay hidden until the selected mode permits them, or the player explicitly reveals them.

## Complete-guide PDF export

Open a game and choose **Export complete guide (PDF)** above the section directory. The app creates a print-optimized document containing every section, every spoiler level, current checklist marks, and personal notes. In the browser print dialog, select **Save as PDF** (wording varies by browser). The export stays local and does not send guide or progress data to a service. If the print view does not open, allow pop-ups for the app and try again.

## Adding a large guide

1. Create a lowercase, hyphenated directory under `src/data/games/`.
2. Add a manifest with a matching stable ID.
3. Split content by meaningful boundaries (main story, each faction, city quests, collectibles, and each DLC are good candidates).
4. Give every section an `order` and stable IDs for its sections, steps, and loot.
5. Start with original structural notes, then add only original or appropriately licensed walkthrough content.
6. Run `npm run lint` and `npm run build`.

## Content rules and scope

This project is local-first: it has no backend, authentication, cloud sync, scraping, analytics, external APIs, or copyrighted game assets. Do not add copied guide text, official logos, maps, images, or other unlicensed content. Use original text and appropriately licensed material only.
