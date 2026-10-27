# ChainPulse AI - Frontend Guidelines & Conventions

## Component Naming & Structure
- All page-level components are stored inside `src/`.
- File naming convention: `PascalCase.tsx` (e.g., `MockDashboard.tsx`, `CoinDashboard.tsx`).
- Type interfaces must be explicitly declared at the top of the component file.

## UI & Layout Conventions
- Standard spacing unit: 8px grid system (`8px`, `16px`, `20px`, `24px`).
- Color palette:
  - Background: `#f5f7fa`
  - Cards & Containers: `#ffffff`
  - Text Primary: `#1a202c`
  - Price Positive: `green` (`#008000`)
  - Price Negative: `red` (`#ff0000`)
  - Accent / Bitcoin: Orange (`#ff9900`)

## State Management
- Handle loading, error, and empty status states explicitly in all data-fetching components.