# Portfolio To-Do

## Completed
- [x] Create index.html with nav, hero, work section (6 cards), and footer
- [x] Separate CSS into styles.css and link from index.html

## casestudy.html
- [x] Write plan and get approval
- [x] Add case study styles to styles.css
- [x] Create casestudy.html with:
  - [x] Nav (same as index.html) + back breadcrumb
  - [x] Hero — title, subtitle, full-width grey image
  - [x] Project Meta strip — Client, Deliverables, Date, Role
  - [x] About/Summary — text + grey image
  - [x] Challenge — text + grey image
  - [x] Solution intro — text
  - [x] Deliverable 1: Board Template System — text + grey image
  - [x] Deliverable 2: Iterative Process — lorem ipsum + grey image + accordion (text only per step)
  - [x] Footer (same as index.html)
- [x] Security check
- [x] Add review section to todo.md

## Character animation
- [x] Write plan and get approval
- [x] Add character styles to styles.css
- [x] Create character.js with slide-in, exit, and click behaviour
- [x] Add character div + script tag to index.html
- [x] Add character div + script tag to casestudy.html
- [x] Security check
- [x] Add to review section

## Loading animation (index.html)
- [x] Add loader styles to styles.css
- [x] Add loader HTML to index.html
- [x] Create loader.js
- [x] Security check — no user input or external data, no vulnerabilities
- [x] Committed locally (not yet pushed)

## Organise assets folder
- [ ] Create assets/ folder and move GIFs with git mv
- [ ] Update character.js src paths
- [ ] Update index.html img src
- [ ] Update casestudy.html img src
- [ ] Commit and push

## Review — Character animation
- Created character.js as a self-contained IIFE; added to both index.html and casestudy.html
- Square starts at left: -60px (off-screen), waits 5s, then slides right at 2.5px/frame (~10s to cross a 1400px screen)
- On reaching the right edge it hides itself and stops — no repeat
- Click stops movement, turns square orange (#ff6b00), resumes grey and movement after 3s; ignored if already paused
- Security: no user input, no external requests, no eval — nothing exploitable

## Mobile Nav — Hamburger + Icon Logo
- [x] **HTML**: Add `logo-mobile` img (`IK_Icon_DarkBlue.png`) alongside existing `logo-desktop` img inside `.nav-logo`
- [x] **HTML**: Add a `<button class="hamburger">` with 3 `<span>` bars, hidden on desktop
- [x] **CSS**: Hide `.logo-mobile` and `.hamburger` by default (desktop)
- [x] **CSS**: At `≤768px` — hide `.logo-desktop`, show `.logo-mobile` and `.hamburger`
- [x] **CSS**: At `≤768px` — hide `.nav-links` by default; when `.open` is present, show as vertical dropdown below nav
- [x] **CSS**: Add hamburger → X animation when nav is open
- [x] **JS**: Wire up hamburger button to toggle `.open` on `.nav-links` and `.nav-open` on `<nav>`; close menu on nav link click
- [x] Security check

### Review
- Added both logo images to `.nav-logo`; CSS shows/hides them at 768px
- Hamburger button uses 3 `<span>` bars; animates to an X via rotate/translate on `nav.nav-open`
- Dropdown is `position: absolute` so it overlays content without pushing layout
- Inline IIFE script toggles `.open`/`.nav-open` classes; clicking any link closes the menu
- `aria-expanded` kept in sync for accessibility
- Security: no user input, no innerHTML, no eval — no vulnerabilities

## Review
- Created casestudy.html using the same styles.css and nav/footer pattern as index.html
- Added all case study-specific styles to the bottom of styles.css under a new /* ── CASE STUDY ── */ section
- Text copied exactly from the PDF — no edits made
- Accordion built with plain JS (no libraries); toggles an .open class to animate max-height
- Security: no user input, no dynamic data, no external requests beyond Google Fonts — no vulnerabilities present
