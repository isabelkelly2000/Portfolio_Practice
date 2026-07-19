# Portfolio To-Do

## Rebuild deploy zip for dad (2026-07-19)
- [x] Renamed `assets/Me Image.png` → `assets/me_image.png` (per your request) — a space in a filename risks getting mangled by upload tools/URLs; updated the one reference in `about/index.html` to match
- [x] Audited every `assets/`/`fonts/` reference across all live pages/scripts against the actual filenames on disk, case-sensitive — all match (this is the same class of bug that broke the Contact Me image before)
- [x] Rebuilt `~/Desktop/Portfolio_Practice_deploy.zip` from current repo state, excluding `.git/`, `.gitignore`, `.vscode/`, `.DS_Store`, `claude.md`, `studio/`, `tasks/`, the orphaned `casestudy-airbnb/`, `coming-soon-upload/`, and `coming-soon.html` — nothing deleted from disk, just left out of the archive
- [x] Verified: no wrapping top-level folder (files sit at zip root, matching prior working uploads), all exclusions confirmed absent, no stray `.DS_Store` anywhere in the archive
- [x] Security check
- [x] Add review section

### Review — deploy zip rebuild
- The zip now reflects everything done this session: the mobile hero/arrow fix, project card mobile sizing, and the case study TOC overhaul (all 3 case studies), plus the `me_image.png` rename.
- Renaming `Me Image.png` removes a filename with a space, which is safer for FTP/cPanel uploads and URLs than relying on automatic `%20` encoding.
- Security: no credentials, tokens, or non-public files are included — the zip is pure static site files (HTML/CSS/JS/assets), same as previous successful deploys. Sanity's write-access token stays local to this machine's `sanity` CLI config and was never part of the project directory.
- Next step is on your end: send `~/Desktop/Portfolio_Practice_deploy.zip` to your dad to upload, preserving the folder structure.

## Polish: TOC font size, long-item wrapping, edge offset (2026-07-19)
- [x] `styles.css` mobile `.eid-toc-link`/`.ai-toc-link`: font-size 16px → 14px (2px smaller, per request)
- [x] Same rule: added `max-width: 20ch; white-space: normal` (was `nowrap`) so items longer than ~20 characters wrap to two lines instead of extending horizontally, and added `align-items: flex-start` on `.eid-toc` so short single-line items and wrapped two-line items stay top-aligned rather than vertically centering unevenly
- [x] Fixed root cause of items snapping flush to the screen edge: the `scrollActiveTocIntoView()` helper (in all 3 case study JS files) was computing a scroll offset relative to `.eid-toc`'s outer edge, which canceled out its own left padding — so the active item always landed flush at x=0 instead of at the 28px page margin. Subtracted the container's `padding-left` from the offset calculation in all three files so the active item now stops at the same margin as the rest of the page.
- [x] Verified headlessly: font renders at 14px; a 20-char-wide pill computes to ~180px `max-width`; a long item ("Revisiting Functionality: Capsules") wraps to two lines; after scrolling, the active item's left edge sits ~28px from the screen edge (matching `--space-page-mobile`) instead of flush against it. No console errors, no page-level overflow.
- [x] Final on-device check on your phone — confirmed working
- [x] Security check
- [x] Add review section

### Review — TOC font/wrap/offset polish
- All three changes live in the same shared mobile CSS block (`.eid-toc`, `.eid-toc-link`/`.ai-toc-link`) plus the `scrollActiveTocIntoView()` helper duplicated across `eid.js`, `daisy-edit.js`, and `airbnb-icons.js` — consistent with how the rest of this TOC feature is structured (shared CSS class names, per-page duplicated JS).
- The edge-snapping bug was a genuine logic bug in the offset math I wrote for the previous TOC fix, not a style preference — `linkRect.left - tocRect.left` measures from the container's *border* edge, but the container's padding lives inside that edge, so the calculation was implicitly discarding the padding every time it scrolled. Subtracting `paddingLeft` corrects it.
- Desktop (>900px) untouched — all changes are inside the existing `@media (max-width: 900px)` block.
- Security: pure CSS sizing/wrapping + scroll-position math, no data or logic changes.

## Fix: case study TOC overflows mobile viewport, no active-item scroll (2026-07-19)
- [x] `styles.css`: split the mobile `.eid-sidebar` rule so `.eid-back` sits on its own row and `.eid-toc` becomes a horizontally-scrollable strip (`overflow-x: auto; flex-wrap: nowrap`) contained within the phone's width, instead of wrapping and pushing the whole page wider than the viewport
- [x] `.eid-toc-link` / `.ai-toc-link`: added `flex-shrink: 0; white-space: nowrap` so items scroll as pills instead of wrapping their own text across lines
- [x] Hid the scrollbar on `.eid-toc` (same pattern already used for `.ai-strip`)
- [x] `casestudy-eid/eid.js`, `casestudy-daisy-edit/daisy-edit.js`, `casestudy-airbnb-icons/airbnb-icons.js`: in each file's IntersectionObserver TOC callback, after toggling `.active`, scroll `.eid-toc`/TOC container so the active link's left edge aligns with the container's left edge (same fix applied identically in all three, since all three duplicate the same TOC code)
- [x] Verified headlessly at 375px width on all three case study pages: zero page-level horizontal overflow, TOC renders as a single scrollable row, and the active link auto-scrolls to the left edge as sections change (confirmed on Daisy Edit: scrolling to "Building the System" moved the TOC so that link sits ~3px from the container's left edge). No console errors on any of the three pages.
- [x] Final on-device check on your phone — confirmed working
- [x] Security check
- [x] Add review section

### Review — case study TOC mobile fix
- Root cause: `.eid-sidebar` (shared by all 3 case study pages) let its TOC links `flex-wrap` across multiple lines on mobile instead of containing them, and since flex items don't shrink below their content width by default, the wrapped row was wider than the viewport — pushing the whole page wider and enabling pinch-zoom/horizontal scroll on the entire site, not just the TOC.
- Fix: `.eid-back` ("← Back to work") now sits on its own row; `.eid-toc` is a separate `overflow-x: auto` strip with `flex-wrap: nowrap`, so it scrolls horizontally within its own bounds instead of expanding the page. Scrollbar hidden to match the existing `.ai-strip` pattern elsewhere on the site. `.eid-toc-link`/`.ai-toc-link` got `flex-shrink: 0; white-space: nowrap` so each item stays a single-line pill instead of wrapping its own text.
- Added a small `scrollActiveTocIntoView()` helper to each of the three case study JS files (duplicated intentionally, matching how the rest of the TOC/observer logic is already duplicated per page rather than shared). It runs inside the existing IntersectionObserver callback whenever a new section becomes active, and scrolls the TOC strip so that link's left edge aligns with the strip's left edge.
- Desktop layout (>900px) is untouched — the sidebar there is still a vertical column, unaffected by any of these mobile-only rules.
- Security: pure CSS/layout + scroll-position JS, no new data sources, no user input handled, nothing touching Sanity fetch/auth logic.

## Fix: company name / role on separate lines on mobile (2026-07-19)
- [x] `styles.css`: inside the `@media (max-width: 900px)` block, set `.project-meta` to `flex-direction: column` (was row) so company name stacks above role tag
- [x] Hide `.meta-dot` separator on mobile — the dot only makes sense as an inline separator, not between stacked lines
- [x] Re-check on phone preview — confirmed working
- [x] Security check
- [x] Add review section

### Review — company/role stacking on mobile
- `.project-meta` (wraps company name + separator dot + role tag) now switches to `flex-direction: column` under 900px, so company name sits above the role tag instead of squeezing onto one row.
- `.meta-dot` is hidden on mobile since it was a visual separator between the two inline items — no longer needed once they're stacked.
- Desktop layout (>900px) unchanged.
- Security: pure CSS layout change, no data/logic touched.

## Fix: project card subtitle + pill text too large on mobile (2026-07-19)
- [x] `styles.css`: inside the existing `@media (max-width: 900px)` responsive block, reduce `.project-company`, `.project-role-tag`, and `.project-pill` font sizes for mobile (were 16px each, sized fine for the wide desktop card but oversized/cramped at 375px width) — set to 12px per your request
- [x] Also trimmed `.project-pill` padding on mobile (11px→9px horizontal, 5px→4px vertical) so pills don't wrap as aggressively
- [x] Re-check on phone preview — confirmed working
- [x] Security check
- [x] Add review section

### Review — project card mobile text sizing
- Added rules inside the existing `@media (max-width: 900px)` block in `styles.css`: `.project-company`, `.project-role-tag`, and `.project-pill` now render at 12px on mobile/tablet instead of the desktop 16px; `.project-pill` padding also tightened slightly so the tag pills sit more compactly.
- Desktop styling (>900px) is untouched — this only affects the mobile/tablet breakpoint.
- Security: pure CSS sizing change, no data/logic touched.

## Fix: mobile scroll arrow hidden behind Safari toolbar (2026-07-19)
- [x] `styles.css` `#home`: change `min-height: 100vh` to `min-height: 100svh` (with `100vh` kept as a fallback line before it), so the hero's height reflects the actually-visible viewport when mobile Safari's address/toolbar is showing
- [x] Re-check `.scroll-signal`'s `bottom: 48px` still sits fully in view on a 375px-wide phone preview after the change — verified no layout regression in headless Chromium; final confirmation pending your on-device check via localhost preview (headless browsers don't simulate Safari's collapsing toolbar)
- [x] Security check (pure CSS unit change, no data/logic touched)
- [x] Add review section

### Review — mobile scroll arrow fix
- `#home` previously used `min-height: 100vh` to size the hero section. On mobile Safari, `100vh` is calculated as if the browser's address/toolbar were hidden, so it overshoots the actually-visible area whenever the toolbar is showing. Since `.scroll-signal` is `position: absolute; bottom: 48px` inside `#home`, it was anchoring to the bottom of that oversized box — landing underneath the toolbar instead of in the visible viewport.
- Added `min-height: 100svh` right after the existing `100vh` line. `svh` ("small viewport height") reflects the guaranteed-visible viewport with toolbars accounted for. Browsers that don't understand `svh` just keep using the `100vh` line above it (graceful fallback, no @supports needed).
- No other elements use `bottom`-anchored absolute positioning inside `#home`, so this was a self-contained fix.
- Security: pure CSS unit change, no data, scripts, or links touched.

## Pre-zip cleanup — dead links + grammar (2026-07-16)
- [x] `footer.js`: wire real LinkedIn URL from Sanity `about` doc (same pattern as `nav.js`), replacing hardcoded dead `linkedin.com/in/`
- [x] `footer.js`: wire real Instagram URL from Sanity `about` doc, replacing dead `href="#"`
- [x] Sanity `about` doc: capitalize "i" → "I" in bio ("As a designer, i thrive...")
- [x] Sanity EID project `solutionText2`: "its fullest potential" → "their fullest potential"
- [x] Sanity EID project `accordionItems` (Print Production): add missing trailing period
- [x] Sanity EID project `solutionText2`: add blank line between the "Deliverable 2" bold heading and its paragraph, matching Deliverable 1's formatting
- [x] Flag Resume link with user — no resume file exists to link to, can't fix without one
- [x] Security check
- [x] Add review section

## Fix: Contact Me button image missing on live site (2026-07-16)
- [x] Root cause: `nav.js` references `assets/contact-me.png` / `assets/contact-me-hover.png` (lowercase), but the actual files were `Contact-me.png` / `Contact-me-hover.png` (capital C). macOS's case-insensitive filesystem masked this locally; the real web server is case-sensitive, so the image 404'd once live.
- [x] Renamed both files to lowercase via `git mv` (two-step, since macOS won't recognize a case-only rename in one step) — confirmed no other asset reference had this mismatch (checked every `assets/*` reference in every HTML/JS file against the actual filenames on disk)
- [x] Rebuilt the deploy zip with the corrected filenames; verified both images now serve with a 200 at the exact lowercase path
- [x] Security check — pure filename rename, no data/content/link changes
- [x] Add review section

### Review — Contact Me image fix
- Renamed `assets/Contact-me.png` → `assets/contact-me.png` and `assets/Contact-me-hover.png` → `assets/contact-me-hover.png` to match the paths already hardcoded in `nav.js`. No code changed — the code was already correct/lowercase, only the files on disk had the wrong case.
- This means your dad's current live upload still has the broken image, since it was zipped before this fix. He'll need to re-upload the new zip from `~/Desktop/Portfolio_Practice_deploy.zip` to pick up the corrected filenames.
- Worth flagging: this class of bug (case mismatch that only shows up on a real server, not on Mac) can hide in any future asset you add. If a new image doesn't show up live but works locally, check filename case first.

## Zip for dad (2026-07-16)
- [x] `footer.js`: remove the dead Resume `<li>` entirely (no resume file ready yet)
- [x] Build deploy zip at `~/Desktop/Portfolio_Practice_deploy.zip`, excluding `studio/`, `tasks/`, `.git/`, `.gitignore`, `.vscode/`, `.DS_Store`, `claude.md`, the two orphaned folders (`casestudy-airbnb/`, `coming-soon-upload/`), and `coming-soon.html` — none deleted from disk, just left out of the archive
- [x] Verified zip contents: all live pages/assets/scripts present, all exclusions confirmed absent

### Review — Pre-zip cleanup
- `footer.js`: added a small fetch to the Sanity `about` document (same public CDN query pattern already used in `nav.js`), and set `#footer-linkedin` / `#footer-instagram` hrefs from `linkedinUrl` / `instagramUrl`. Resume link left as `href="#"` — no resume file exists anywhere in the project, so there's nothing to point it at yet (see note to user).
- Sanity content patched directly via the Actions/mutate API using the already-authenticated `sanity` CLI token (never written to any file): About bio capitalization, EID "their" pronoun fix, EID missing period, EID Deliverable 2 heading/paragraph line break. All four verified by re-querying the dataset after the patch.
- Confirmed `casestudy-daisy-edit`'s "Client: The Daisy Edit" is correct as-is (company name, not a mistaken project-name entry) — no change needed.
- Security: `footer.js` only reads from Sanity's public, anonymous-read CDN endpoint (same project ID/dataset already exposed in every other script on the site — this is the intended public API, not a secret). No token, credential, or write access of any kind is present in frontend code. The Sanity auth token used to edit content lives only in the local `sanity` CLI config on this machine and was never added to the repo or any file that will be zipped.
- Verified: `node --check footer.js` passes, and the live CDN query returns both URLs correctly, confirming the fetch will populate real links when the page loads. Not verified via an actual browser render — recommend a quick visual check of the footer on localhost:5500 before zipping.

## Daisy Edit — section images as an arrow carousel with dot indicator
- [x] `daisy-edit.js`: replace the static `.da-media-grid` (all images shown at once) with a carousel when a section has more than one image — one image visible at a time, left/right arrow buttons (reusing the same chevron SVGs as the Results strip arrows), and a row of dots below indicating position. Clicking a dot jumps to that image; arrows wrap around at the ends. A section with exactly one image still renders as a plain single image (no controls).
- [x] CSS: add `.da-carousel`, `.da-carousel-viewport`, `.da-carousel-arrow` (reuse `.ai-strip-arrow` styling), `.da-carousel-dots`, `.da-carousel-dot` (`.active` state)
- [x] Security check
- [x] Add review section

### Review — Section image carousel
- `daisy-edit.js`: `buildSections()` now branches on image count — 0 images renders nothing, 1 renders a plain `.da-media-single` image, 2+ renders `buildCarousel()`
- `buildCarousel()`: tracks current index in closure state; left/right arrows and dot clicks all funnel through one `goTo(index)` that wraps around (`(index + urls.length) % urls.length`), swaps the viewport image's `src`, and toggles `.active` on the matching dot
- Arrow buttons reuse the exact chevron SVG paths from the Results strip arrows for visual consistency
- CSS: `.da-carousel-arrow` reuses the circular `.ai-strip-arrow` look; `.da-carousel-dots` is a centered row of 7px dots, active dot scaled up and filled with `--color-heading`
- Verified against live data: The Reskin section (3 real uploaded images) — carousel renders with 3 dots, right-arrow click advances image + active dot, direct dot click jumps to that image, no console errors
- Security: no user input beyond click events, no innerHTML from CMS data (only the two static SVG arrow strings, which are hardcoded), image `src` values still come only from Sanity CDN asset URLs

### Follow-up — slide animation
- Reworked the carousel from a single `<img>` with swapped `src` to a `.da-carousel-track` holding all images side by side in a flex row; `goTo()` now sets `track.style.transform = translateX(-current * 100%)` instead of swapping `src`
- CSS: `.da-carousel-track { transition: transform 0.5s ease-in-out }` — arrows and dots now produce a real sliding motion between images instead of an instant swap
- Verified mid-transition via headless browser: transform sampled partway through differed from both the start and end values, confirming the animation runs rather than jumping
- Security: no change to data flow, same CDN-only image sources

## Daisy Edit — new case study template with repeatable sections + before/after images
- [x] Schema (`project.js`): add `narrativeSections` array field — each item has `title` (string), `body` (text, paragraphs via blank line), and `media` (array of `{before image, after image (optional), caption (optional)}` pairs). An item with no `after` renders as a single image; with both, renders as a before/after pair.
- [x] Create `casestudy-daisy-edit/index.html`: reuses `.eid-layout`/`.eid-hero`/`.eid-meta-strip`/`.eid-body` styling from EID/Icons. Sidebar TOC starts with a static "Overview" link; remaining links are built dynamically in JS from `narrativeSections` (since section count/titles vary per project).
- [x] Create `casestudy-daisy-edit/daisy-edit.js`: same Sanity fetch + IntersectionObserver/scroll-to TOC pattern as `airbnb-icons.js`/`eid.js`. Renders Overview (hero, title, subtitle, meta strip, intro via existing `aboutText` field, no heading), then one `<section>` per `narrativeSections` item with heading + body + before/after media grid.
- [x] CSS: add a before/after grid component (`.da-media-grid`, `.da-baf-card` with before/after images side by side + optional labels/caption) using existing design tokens and `--radius-image-block`, responsive down to mobile.
- [ ] In Sanity Studio: set Daisy Edit project's `template` field to `casestudy-daisy-edit/` (currently `casestudy-airbnb-icons/`) — **user action, needs Studio UI**
- [x] Security check
- [x] Add review section

### Review — Daisy Edit template
- `project.js`: added `narrativeSections` (array of `{title, body, media[]}`), where `media` is a plain array of images (same pattern as the existing `resultsImages` field) — mirrors established patterns, so the schema stays minimal
- Simplified from an earlier before/after-pair design: user will denote before/after state within the image itself, so `media` is just an ordered image gallery, not paired objects
- `casestudy-daisy-edit/index.html`: same `.eid-layout` shell as EID/Icons (sidebar TOC, hero, meta strip). Only "Overview" is hardcoded in the TOC — remaining links are appended by JS to match however many `narrativeSections` a project has
- `casestudy-daisy-edit/daisy-edit.js`: fetches by `?slug=`, renders overview fields + `aboutText` as the unheaded intro, then builds one `<section>` per narrative section (heading, paragraph-split body with `**bold**` support, and an image grid). TOC links + IntersectionObserver scroll-spy are wired up after sections are built, since section count is dynamic
- `styles.css`: added `.da-tagline` (subtitle line under the title) and `.da-media-grid`/`.da-media-img` (responsive image grid, single column under 700px)
- Verified: schema change loaded cleanly in Sanity Studio (no errors), the GROQ query returns correctly against live data (gracefully handles `narrativeSections` still being empty), JS passes `node --check`
- Still needed: client/deliverables/date/subtitle/intro fields in Studio, upload section images, remove leftover `*[Before/after ...]*` placeholder lines from section bodies
- Security: all dynamic content set via `textContent` or the same vetted `**bold**` regex already used elsewhere (no raw HTML from CMS); images set via `img.src` from Sanity CDN asset URLs only; no write tokens or credentials in any frontend file; no user input, no `eval`

### Bug fix — narrative section body text not rendering
- `buildSections()` created each section's body `<div>`, appended it to the (still-detached) `sectionEl`, then called `setBodyText(bodyEl.id, ...)`, which looked the element up via `document.getElementById()`. Since the section wasn't attached to `document` yet at that point, the lookup silently failed and the id-based `setBodyText` bailed out with no error — headings rendered, bodies stayed empty
- Fix: split the paragraph-building logic into `appendBodyText(el, text)`, which operates directly on an element reference instead of looking one up by id. `buildSections()` now calls `appendBodyText(bodyEl, section.body)` before appending to the DOM; `setBodyText(id, text)` (used for the static `da-intro` element, which is already in the document) delegates to it
- Verified via headless browser: all 7 sections now render their body paragraphs correctly
- Security: pure logic fix, no new attack surface

## About bio — preserve blank lines between paragraphs
- [x] Add `white-space: pre-line;` to `.about-body` in `styles.css` so blank lines in the Sanity `bio` text render as paragraph gaps
- [x] Security check
- [x] Add review section

### Review — About bio blank lines
- `styles.css`: added `white-space: pre-line;` to `.about-body` — preserves newlines (including blank lines between paragraphs) from the Sanity `bio` text field while still wrapping normally
- No JS or HTML changes needed — the fix is purely CSS
- Security: pure CSS change, no user input, no new attack surface

## About Page — Sanity Integration
- [x] Step 1 — Create `schemaTypes/about.js`: singleton document with `bio` (text), `spotifyUrl`, `linkedinUrl`, `instagramUrl` (url) fields
- [x] Step 2 — Register `about` in `schemaTypes/index.js`
- [x] Step 3 — Add `id` hooks to `about/index.html` (`about-bio`, `about-spotify`, `about-linkedin`, `about-instagram`); link `about/about.js`
- [x] Step 4 — Create `about/about.js`: fetches `*[_type == "about"][0]` from Sanity CDN, populates bio via `textContent` and social hrefs via `el.href`
- [x] Step 5 — Restart Sanity Studio to pick up new schema
- [x] Step 6 — Security check
- [x] Step 7 — Add review

### Review — About Page Sanity Integration
- New `about` document type in Sanity: one document, no slug needed — queried with `[0]`
- Fields: `bio` (text, multi-line), `spotifyUrl`, `linkedinUrl`, `instagramUrl` (url type)
- `about/about.js`: single GROQ fetch, no parameters — bio via `textContent` (no XSS), social links set on `href` only
- `about/index.html`: Lorem ipsum replaced with empty `<p id="about-bio">`, hardcoded social hrefs replaced with `#` + id hooks
- Security: no credentials, no innerHTML, no eval, no user input — nothing exploitable

## Airbnb Icons — New Case Study Page
- [x] Step 1 — Add `resultsImages` (array of images) to the Sanity project schema
- [x] Step 2 — Create `casestudy-airbnb-icons/index.html`: sidebar TOC (Overview, About, Challenge, Solution, Results), hero, meta strip, 4 content sections, Results section with horizontal scroll image strip. No accordion.
- [x] Step 3 — Create `casestudy-airbnb-icons/airbnb-icons.js`: same Sanity fetch as `eid.js` but with `ai-` prefixed IDs, no accordion builder, adds `resultsImages` to the query and builds the horizontal image strip
- [x] Step 4 — Add CSS for horizontal image strip (filmstrip scroll, images side by side) + progress bar that tracks scroll position
- [ ] Step 5 — In Sanity Studio: create "Airbnb Icons" project document, set template to `casestudy-airbnb-icons/`
- [x] Step 6 — Security check
- [x] Step 7 — Add review section to todo.md

### Review — Airbnb Icons Case Study
- New `casestudy-airbnb-icons/` folder mirrors the EID pattern: `index.html` + `airbnb-icons.js`
- TOC has 5 entries: Overview, About, Challenge, Solution, Results — same sticky sidebar, same scroll offset fix
- No accordion — Solution section ends after `solutionText2`
- Results section: `<div class="ai-strip">` holds horizontally scrollable images; `<div class="ai-strip-bar">` updates its width on the strip's `scroll` event as a progress bar
- Sanity schema: added `resultsImages` (array of images) to `project.js` — Studio picks it up on next restart
- `airbnb-icons.js` GROQ query fetches `resultsImages[].asset->url`, builds `<img>` elements via `img.src` (not innerHTML)
- Security: no write tokens, slug URL-encoded before API call, all text via textContent or controlled regex, no XSS vectors

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
