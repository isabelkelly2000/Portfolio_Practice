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

## Review — Character animation
- Created character.js as a self-contained IIFE; added to both index.html and casestudy.html
- Square starts at left: -60px (off-screen), waits 5s, then slides right at 2.5px/frame (~10s to cross a 1400px screen)
- On reaching the right edge it hides itself and stops — no repeat
- Click stops movement, turns square orange (#ff6b00), resumes grey and movement after 3s; ignored if already paused
- Security: no user input, no external requests, no eval — nothing exploitable

## Review
- Created casestudy.html using the same styles.css and nav/footer pattern as index.html
- Added all case study-specific styles to the bottom of styles.css under a new /* ── CASE STUDY ── */ section
- Text copied exactly from the PDF — no edits made
- Accordion built with plain JS (no libraries); toggles an .open class to animate max-height
- Security: no user input, no dynamic data, no external requests beyond Google Fonts — no vulnerabilities present
