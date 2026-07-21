# Walkthrough Companion

A lightweight, local-first gaming walkthrough companion. The included fictional **Ashen Gates** guide demonstrates spoiler controls, checklists, loot tracking, notes, search, filters, and responsive guide pages.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` to type-check and create a production bundle, then `npm run preview` to inspect it.

## Guide data

Game files live in `src/data/games/` as JSON. Each game has metadata plus a `sections` array. Sections identify their type, area, objective, optional/missable content, ordered steps, loot, secrets, common mistakes, and optional boss details. Step and section content uses `low`, `normal`, or `full` spoiler levels.

To add a game, create another JSON file following `src/types/guide.ts`, import it in `src/App.tsx`, and add it to the game list. Keep IDs stable: they are used by local progress storage.

## MVP scope

Included: local JSON guide content; game/section browsing; title, area, boss, and loot search; type/missable filters; global spoiler modes; persisted step, section, and loot progress; and per-section notes.

Intentionally excluded: authentication, backend or cloud sync, payments, scraping, analytics, external APIs, and copyrighted assets.
