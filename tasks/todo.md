# Portfolio To-Do

## Sanity → Case Study Connection
- [x] Step 1 — Extend `project` schema: add `subtitle`, `client`, `deliverables` (array of strings), `date`, `aboutText`, `challengeText`, `solutionText`, `template` (defaults to `casestudy.html`)
- [x] Step 2 — Update `casestudy.html`: add `id` attributes to dynamic fields; link `casestudy.js`
- [x] Step 3 — Create `casestudy.js`: reads `?slug=` from URL, fetches that project from Sanity CDN, populates all fields
- [x] Step 4 — Update `sanity.js`: make each card a clickable link to `[template]?slug=[slug]`
- [x] Step 5 — Fill in new fields on Airbnb project in Studio and publish
- [x] Step 6 — Security review + review section in todo.md

### Review — Sanity → Case Study Connection
- Extended `project` schema with 8 new fields: subtitle, client, deliverables, date, aboutText, challengeText, solutionText, template
- `casestudy.html`: added `id` hooks to title, subtitle, client, deliverables list, date, role, and the three body sections; linked `casestudy.js`
- `casestudy.js`: reads `?slug=` from the URL, fetches that project from Sanity CDN via GROQ, populates all fields using `textContent` (no innerHTML, no XSS)
- `sanity.js`: each card now wraps in an `<a>` tag linking to `[template]?slug=[slug]`; falls back to a plain `div` if no slug
- Future case study layouts: create a new HTML file (e.g. `casestudy-v2.html`) and set the `template` field in Sanity — the card link updates automatically
- Security: no credentials in frontend, all dynamic content via textContent, slug URL param encoded before use

## Sanity CMS Integration
- [x] Step 1 — Initialize Sanity Studio in a `studio/` subfolder (use `npm create sanity@latest`, no global install needed — avoids the permissions error)
- [x] Step 2 — Define the `project` schema in Studio: title, slug, company, role, description, coverImage, tags
- [x] Step 3 — Configure CORS in the Sanity project dashboard (allow localhost + future portfolio domain)
- [x] Step 4 — Add `sanity.js` fetch script to the portfolio: calls Sanity's public CDN with a GROQ query and renders cards into `#work .projects-grid`
- [x] Step 5 — Update `index.html`: empty the hardcoded cards, add a loading state, and link `sanity.js`
- [x] Step 6 — Security review: confirm no write tokens in frontend, only public read via CDN, no XSS vectors in rendered HTML
- [x] Step 7 — Add review section to todo.md

### Review — Sanity CMS Integration
- Sanity Studio initialised in `studio/isabel-kelly-portfolio/` using `npm create sanity@latest` (no global install, no sudo)
- Project ID `rk7q4uop`, dataset `production`, plain JS, no TypeScript
- `schemaTypes/project.js` defines: title, slug, company, role, description, coverImage (with hotspot), tags (array), order (for card sort)
- CORS configured at sanity.io/manage for `http://localhost:5500` and `http://localhost:3000`
- `sanity.js` fetches from `rk7q4uop.apicdn.sanity.io` (Sanity's public CDN) — no API key required for public datasets
- All dynamic content written via `textContent` (not `innerHTML`) — no XSS vectors
- No credentials, tokens, or sensitive data in any frontend file
- `index.html` hardcoded cards replaced with an empty `<div class="projects-grid">` populated at runtime

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

## Coming Soon page (coming-soon.html)
- [x] Write plan and get approval
- [x] Create `coming-soon.html` — full-viewport centred layout, no nav/footer
  - [x] Name lockup image (`assets/Name_Lockup_DarkBlue.png`) at top
  - [x] "new portfolio in the works" text with animated ellipsis (one dot at a time, on repeat)
  - [x] Dr. Booger waving GIF (`assets/Dr._BOOGER_waving.gif`) centred below
- [x] Add page-scoped styles inside a `<style>` block (reuse `styles.css` for body bg + fonts, add centering + dot animation)
- [x] Add JS ellipsis animation (cycles `.` → `..` → `...` → `.` every 500 ms)
- [x] Security check — no user input, no innerHTML, no eval, no external requests beyond Google Fonts; all asset paths are local — no vulnerabilities
- [x] Add review section to todo.md

### Review — Coming Soon page
- Created `coming-soon.html` as a self-contained splash page inside Portfolio_Practice
- Links `styles.css` for body bg (`#f9f9f7`) and font base; page-scoped `<style>` block handles centering and responsive sizing
- Three elements stacked vertically via flexbox column: name lockup → text → Dr. Booger waving GIF
- Ellipsis cycles `.` → `..` → `...` via a minimal IIFE `setInterval` (500 ms) with no DOM manipulation beyond `textContent`
- Responsive: lockup and character scale down at ≤480px
- Security: no user input, no `innerHTML`, no `eval`, no external data — nothing exploitable

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
