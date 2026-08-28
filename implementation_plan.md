# UI Redesign: Nova Assessment Center

The goal is to completely overhaul the `GameWorld.jsx` dashboard to match the premium "Nova Assessment Center" layout provided in the reference image, using the custom 5-color palette and removing all glassmorphism effects in favor of solid colors.

## User Review Required

> [!WARNING]
> This is a complete structural redesign. The current simple grid of subjects will be replaced by a complex dashboard with a sidebar, active assessments, and leaderboards.

> [!IMPORTANT]
> The exact color palette provided (`#AB526B`, `#BCA297`, `#C5CEAE`, `#F0E2A4`, `#F4EBC3`) will be integrated. To maintain readability in a dark UI, I will use a solid dark background (e.g., a very dark shade of the rosy brown/navy) and use the 5 palette colors for cards, buttons, borders, and accents.

## Open Questions

1. Do you want the sidebar links (Past Results, Leaderboards, Certifications) to actually route to new pages, or just act as visual UI elements for now while we focus on the main dashboard?
2. The provided layout features "Upcoming Competitions" and a "Global Leaderboard". Since we don't have a backend database for other players right now, I will populate these with realistic placeholder data to match the screenshot. Is that okay?

## Proposed Changes

### GameWorld.jsx

#### [MODIFY] GameWorld.jsx
- **Layout Structure**: Implement a full CSS Grid/Flexbox layout with a fixed Left Sidebar and a top Navbar.
- **Color Scheme**: Strip all `backdrop-blur` and translucent `bg-slate-800/50` classes. Replace with solid background colors utilizing the new palette.
- **Active Assessments Section**: Instead of a generic grid, we will dynamically display the *current unlocked level* for each subject (Data Structures, Algorithms, OOP) as distinct cards with "Resume Test" buttons.
- **Competitions & Leaderboard Sections**: Build out the right-hand column with static UI cards for "Upcoming Competitions" and a "Global Leaderboard" table to perfectly match the reference design.
- **Recent Results Table**: Display a table mapping over the user's `completedLevels` (tracked via Zustand) to show their actual progress in the UI.

## Verification Plan

### Manual Verification
- Verify the layout matches the complex dashboard screenshot exactly.
- Verify the exact hex codes from the palette are heavily utilized in the UI.
- Verify absolutely zero glassmorphism or translucent overlays exist.
- Click "Resume Test" on the Active Assessments to ensure it correctly launches the `QuizRunner` for that specific level.
