# Revision checklist

- [x] Rework the 2026 desktop into interactive calendar, clock, weather, progress, and news widgets.
- [x] Make the 1995 desktop denser and more interactive with visible windows, menu actions, mini-apps, music, games, and contact/resume shortcuts.
- [x] Add a five-minute inactivity timer with a nostalgic Windows/Mac screensaver overlay.
- [x] Verify desktop and mobile layouts, mode switching, widget interactions, and screensaver dismissal.
- [x] Save a new checkpoint after the revision is complete.

## Functional data and era transitions

- [x] Connect the modern weather widget to live Jakarta weather data with a visible fallback state.
- [x] Make the calendar, clock, progress, and news/status widgets reflect real current or CV-grounded information and open useful portfolio content.
- [x] Add rotating marketing and digital-marketing trivia notifications in the top-left corner.
- [x] Add loading screens and era-specific transition animations for both switch directions.
- [x] Verify live/fallback states, timed trivia, switch transitions, responsive layouts, and save a new checkpoint.

## Dashboard reference refinement

- [x] Inspect the supplied widget reference and map its visual hierarchy to the 2026 dashboard.
- [x] Add freeform drag and resize behavior for every 2026 widget.
- [x] Add freeform drag and resize behavior for 2026 application icons, with a compact default grid.
- [x] Generate and integrate a vaporwave cyberpunk wallpaper for Gema 2026 without changing the GemaOS ’95 wallpaper treatment.
- [x] Verify retro and modern compositions at desktop and mobile breakpoints.
- [x] Run TypeScript/build checks and save a new checkpoint.

## Reference-inspired expansion

- [x] Inspect https://robbyyeager.com/ in browser and document its retro layout, navigation, motion, typography, and interaction patterns.
- [x] Inspect https://www.parinazkassemi.com/ in browser and document its modern layout, navigation, motion, typography, and interaction patterns.
- [x] Map transferable patterns to GemaOS ’95 and Gema 2026 without copying personal content or assets.
- [x] Implement the agreed retro and modern upgrades across the existing one-page portfolio.
- [x] Verify the expanded site, localhost access, mobile behavior, and mode switching.
- [x] Run checks, save a checkpoint, and provide the localhost/preview instructions.

## DOM nesting bug fix

- [x] Locate every nested `<button>` structure reported by React.
- [x] Refactor the affected widget/icon shells to valid semantic elements while preserving click, drag, and resize behavior.
- [x] Run TypeScript/build checks and verify `/` plus `/?from_webdev=1` in the browser.
- [x] Save a bug-fix checkpoint and report the result.

## Source code delivery

- [x] Create a clean ZIP archive of the full portfolio source code and supporting project files.
- [x] Verify the archive excludes generated dependencies and build output while retaining setup files.
- [x] Deliver the source-code archive to the user.

## Final Polish — 2026 macOS & Content (Aug 23)
- [x] Replace CV Runner with Skill window (stack & tools from CV)
- [x] Change Now(2026) panel to Sertifikasi (BNSP/Google/Meta 15+)
- [x] Create Winamp-like widget with spectrum for now-playing (song.mp3 13% autoplay)
- [x] Deduplicate icon/widget (no double content)
- [x] Set background to GIF placeholder (client/public/manus-storage/background.gif) — replace with attached GIF when provided
- [x] Add Credits popup (anshry.dev, Pinterest pin) + Sources/Referensi popup (6 refs)
- [x] Download all images as JPEG (11 books, 8 films, 13 music) and convert SVG→JPEG via sharp
- [x] Enlarge all fonts for 35+ and fix dark/light contrast (light file windows #eef4f0 / dark #0f2e2e)
- [x] Fix retro icons to 2 columns, no slider, remove tabrakan (widgets top 44%, signature 16%)
- [x] Update CAREER to 6 chapters from full CV + PDF download /files/Gema-Pradana-CV.pdf
- [x] Rebuild, verify localhost:5175 200 all assets, re-zip hostinger 14M + source 9.5M
