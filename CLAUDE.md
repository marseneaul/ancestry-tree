# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Type-check with TypeScript and build for production
npm run preview  # Preview production build locally
npm test         # Run tests in watch mode
npm run test:run # Run tests once
```

## Architecture

This is a family tree visualization app built with vanilla TypeScript and D3.js, bundled with Vite.

### Core Data Flow

1. **Data Layer** (`src/data/configs/`): Ancestral data is stored as nested TypeScript config objects following the `Person` interface. Each person has optional `parents` array creating a recursive tree structure. The root config is `max-arseneault.config.ts`.

2. **Data Processing** (`src/utils/utils.ts`): `buildHierarchy()` converts the Person tree into a D3 hierarchy. The tree is sorted with mother (female) first, father (male) second.

3. **Visualization** (`src/visualization/tree-visualization.ts`): The `TreeVisualization` class renders the D3 tree with:
   - Circles for females, rectangles for males
   - Country flag patterns based on birthPlace
   - Generation headers with DNA percentage statistics
   - Patrilineal (blue) and matrilineal (pink) lineage highlighting

4. **Application Init** (`src/main-initialization.ts`): Central initialization that wires together all components and event handlers.

### Key Interfaces

**Person** (`src/interfaces/person.ts`):
- `name`, `sex`, `birthPlace`, `deathPlace`, `birthDate`, `deathDate`
- `parents?: Person[]` - recursive parent references
- `imageUrl?`, `story?` - optional media/biography

### UI Components (`src/components/`)

- **dashboard.ts**: Main layout with grid-based sidebars
- **filter-panel.ts**: Generation filters, country filters, date range controls
- **stats-dashboard.ts**: Statistical analysis visualizations
- **timeline-panel.ts**: Chronological event timeline
- **modal.ts**: Person detail modal popups
- **view-controls.ts**: Zoom and pan controls

### Utilities (`src/utils/`)

- **utils.ts**: Core helpers - `getCountry()` extracts country from birthPlace string, `countryColors` maps countries to colors
- **gedcom-export.ts**: Export tree data to GEDCOM format
- **migration-patterns.ts** / **migration-visualization.ts**: Geographic migration tracking and map visualization
- **migrate-existing-data.ts**: Data migration utilities

### Country Detection

`getCountry()` in `utils.ts` parses birthPlace strings to detect countries by keywords (e.g., "france", "french" -> "France"). Country SVGs are stored in `./svgs/` and displayed as node fill patterns.
