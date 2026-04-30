# Professionalization and Performance Plan

This app has a compelling product core: a visual, searchable ancestry experience with stories, media, exports, filters, timelines, and geographic context. To make it feel sale-ready, the work should focus on speed, trust, maintainability, and product polish.

## Current Improvements Landed

- Fixed runtime zoom wiring so search, fit, reset, zoom buttons, and mobile zoom use the D3 zoom behavior instead of a transform snapshot.
- Made panel visibility derive from current DOM state so outside-click close does not desynchronize toolbar toggles.
- Refactored tree filtering so nodes and links use the same visibility predicate.
- Made the direct-line filter meaningful by using the union of patrilineal and matrilineal paths.
- Added lightweight performance measurement helpers. Enable browser timing logs with `localStorage.setItem("ancestry:perf", "1")`.
- Cached derived hierarchy and generation data for repeat calls against the same root tree.
- Avoided rerendering heavy side panels each time they are reopened.
- Quieted debug logging in hot UI paths and import-time migration.
- Updated GitHub Pages CI to use Node 20.19 and run the shared `npm run verify` gate before deploy.
- Fixed an invalid grid CSS unit and standardized country flag slug generation.
- Added adaptive SVG rendering: large trees keep deep nodes interactive but skip expensive deep labels/photos and disable transitions above the largest threshold.
- Added `npm run perf:budget` to fail CI when built JS/CSS/dist assets exceed the current budget.
- Replaced inline/global UI handlers in the active dashboard, filter, stats, search, modal, and timeline paths with component-owned event listeners.
- Removed unused Vite starter and duplicate search modules that still carried old global-handler patterns.
- Centralized toolbar/panel visibility in a shared UI state object instead of copied flags.
- Switched generated person metadata IDs from timestamp/random values to deterministic slugs.
- Hardened person modal rendering by escaping interpolated person data and moving image fallback handling into listeners.
- Made the migration fallback map deterministic and removed leftover chart/debug console noise.
- Enabled full TypeScript `strict` mode plus unused-symbol checks to catch dead code, implicit `any`, and unsafe null assumptions during build.
- Added regression coverage for deterministic person metadata IDs.
- Removed the global `body` scale hack and related 0.75 coordinate compensation so clicks, dropdowns, and tooltips use normal viewport coordinates.
- Fixed mobile panel stacking so the header controls remain clickable while Stats, Timeline, or Filters are open.
- Added accessible toolbar labels/pressed states and upgraded the person detail modal to a labelled dialog with focus trapping and focus restoration.
- Added focused regression tests for shared UI state and GEDCOM export structure.
- Added `npm run verify` as the local release gate for tests, production build, and performance budget.
- Added a reusable data quality analyzer for duplicate IDs, missing IDs, cycles, impossible date ordering, parent-child date conflicts, and parent-count violations.
- Added a real-tree data quality regression so shipped genealogy data is exercised by the release gate.
- Added GEDCOM living-person privacy controls and made the toolbar export redact living-person details by default.
- Fixed GEDCOM date formatting for year-only, ISO, written, and approximate dates without JavaScript timezone drift.
- Made existing person/tree validators cycle-safe and added regression coverage.
- Replaced the one-click GEDCOM export with an accessible export options menu for privacy mode, stories, and image paths.
- Added a live GEDCOM export summary showing exported person count, living-record handling, and included story/image-path counts.

## Performance Roadmap

1. Render less by default.
   - Start at a bounded generation depth.
   - Add expand/collapse per branch.
   - Keep a clear "show all" control for power users.

2. Move heavy work out of the interaction path.
   - Run migration, statistics, search indexing, and migration-pattern extraction in Web Workers.
   - Cache worker results by tree version or root ID.

3. Make rendering proportional to what is visible.
   - Cull offscreen nodes during pan/zoom.
   - Reduce per-node SVG complexity for distant zoom levels.
   - Disable transitions automatically above a node-count threshold.

4. Optimize assets and bundle weight.
   - Lazy-load person photos.
   - Keep migration map and statistics chunks lazy.
   - Add a bundle report step before major releases.

5. Benchmark before every release.
   - Track startup time, first tree render, search-to-center latency, stats render, and migration map render.
   - Maintain a large synthetic tree fixture for repeatable stress testing.

## Architecture Roadmap

1. Introduce a small app-state module for active panel, filters, selected person, theme, and viewport state.
2. Give every person a stable deterministic ID and use it for D3 keys, search, lineage, GEDCOM export, and validation.
3. Move data migration to a build-time or explicit data-load step instead of import-time work.
4. Tighten TypeScript incrementally: start with `noUnusedLocals`, then `strictNullChecks`, then full `strict`.
5. Add ESLint and Prettier so style stays consistent as the app grows.

## Product Polish Roadmap

1. Replace emoji-heavy controls and status labels with a consistent icon set.
2. Remove layout hacks, especially global body scaling, and rebuild responsiveness with real layout constraints.
3. Create a small design system for buttons, panels, tabs, forms, empty states, loading states, and errors.
4. Make mobile a first-class experience with touch-friendly controls and readable panel flows.
5. Add accessibility checks for focus order, keyboard navigation, contrast, modal trapping, and screen-reader labels.
6. Add user-facing loading and error states for heavy lazy-loaded panels.

## Trust and Sale-Readiness Roadmap

1. Surface the data quality report in a maintainer-facing view or CI artifact so bad genealogy data is visible before release.
2. Harden GEDCOM export against real genealogy tools, then add GEDCOM import.
3. Add persisted export preferences and a clear reset-to-safe-defaults action.
4. Add error tracking and privacy-conscious performance telemetry.
5. Document data ownership, image rights, export behavior, and backup strategy.

## Release Checklist

- `npm run test:run`
- `npm run build`
- `npm run perf:budget`
- Or run all three with `npm run verify`.
- Manual smoke test for tree render, search, zoom controls, filters, stats, timeline, modal, GEDCOM export, and dark mode.
- Review performance measures with `localStorage.setItem("ancestry:perf", "1")`.
- Merge to `master` to trigger GitHub Pages deployment.
