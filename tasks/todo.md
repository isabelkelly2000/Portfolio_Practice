# Portfolio To-Do

## Design Token System
- [x] Define all tokens as CSS custom properties in `:root` (colors, fonts, spacing, radius, shadow)
- [x] Replace all hardcoded hex colors with `var(--color-*)` tokens
- [x] Replace all hardcoded font families with `var(--font-*)` tokens
- [x] Replace all hardcoded page spacing (60px/28px pattern) with `var(--space-page)` / `var(--space-page-mobile)`
- [x] Replace hardcoded radius and shadow values with tokens
- [x] Security check — pure CSS refactor, no new attack surface
 
### Review — Design Token System
- Added a `/* ── DESIGN TOKENS ── */` `:root` block at the top of `styles.css` with 17 tokens across 5 categories
- **Colors**: `--color-bg`, `--color-surface`, `--color-border`, `--color-placeholder`, `--color-placeholder-line`, `--color-heading`, `--color-accent`, and 7 text-hierarchy tokens from `--color-text` → `--color-text-hairline`
- **Typography**: `--font-body` (Work Sans), `--font-display` (UglyDave)
- **Spacing**: `--space-page` (60px), `--space-page-mobile` (28px) — used across nav, hero, work, footer, and case study sections
- **Radius**: `--radius-card` (16px), `--radius-image-block` (12px), `--radius-pill` (100px), `--radius-sm` (4px)
- **Shadow**: `--shadow-hover`
- No hardcoded hex colors remain outside the `:root` block
- To retheme the site: edit values in `:root` only — no other changes needed
- Security: pure refactor, no dynamic values, no user input, no new vectors

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

## Dr. Booger — repeat visits
- [x] Replace one-time `booger-walked` localStorage flag with a visit counter (`booger-visits`)
- [x] Show Dr. Booger every 3rd visit (visits 1, 4, 7, 10…)
- [x] Increment the counter each page load; hide him on non-qualifying visits
- [x] Security check — counter is a parsed integer, no user-controlled strings evaluated, no XSS vector

### Review — Dr. Booger repeat visits
- `character.js`: replaced `booger-walked` one-time flag with a `booger-visits` integer counter in localStorage
- Counter increments on every page load; Dr. Booger walks on visits where `count % 3 === 1` (visits 1, 4, 7…)
- Removed the `localStorage.setItem('booger-walked')` call that used to permanently suppress him
- `parseInt(..., 10)` with a fallback of `'0'` guards against any corrupted value in storage

## Project card layout — meta under title, pills on right
- [x] `sanity.js`: wrap title + metaDiv in a new `.project-left` div; move pillsDiv out to be a sibling in `.project-info`
- [x] `styles.css`: replace `.project-details` with `.project-left` (flex column); pills keep right-align
- [x] Security check — pure DOM restructure, no user input, no innerHTML, no new vectors

### Review — Project card layout
- `sanity.js`: replaced `detailsDiv.project-details` wrapper with `leftDiv.project-left` containing title + meta; pillsDiv is now a direct sibling inside `project-info`
- `styles.css`: removed `.project-details` (flex column, align-items flex-end); added `.project-left` (flex column, gap 10px)
- `project-info` (flex row, space-between) now puts the left column vs pills on opposite ends naturally

## Case study — folder structure + separate Airbnb template
- [x] Create `casestudy/index.html` — generic template (Executive Design + others), `<base href="../">` handles all paths
- [x] Create `casestudy-airbnb/index.html` — Airbnb template with accordion intact, same base href approach
- [x] Update `sanity.js` fallback from `casestudy.html` → `casestudy/`
- [x] Delete old flat `casestudy.html` and `casestudy-airbnb.html`
- [x] In Sanity Studio: updated Airbnb, Daisy Edit, Chez Henri template fields to `casestudy/` or `casestudy-airbnb/`
- [x] Security check — no user input, no innerHTML outside of existing safe patterns, no new vectors

### Review — Case study folder structure
- Moved case study pages into subdirectories (`casestudy/index.html`, `casestudy-airbnb/index.html`)
- `<base href="../">` in each `<head>` resolves all relative paths (CSS, assets, scripts) without touching individual URLs
- Folder URLs (`/casestudy/`) avoid the `.html` stripping issue that was breaking Executive Design navigation
- `sanity.js` fallback updated to `casestudy/`; Airbnb project points to `casestudy-airbnb/`
- Executive Information Design uses null template — picks up the `casestudy/` default automatically

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
