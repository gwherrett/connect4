# Implementation Plan: Connect4 Neighbourhood Finder MVP

**Status:** Proposed — awaiting review
**Date:** 2026-03-11
**Source:** PRD v1.0 (`PRD_NeighbourhoodFinder_MVP.md`)

---

## Overview

Internal demo build. Next.js 14 App Router, TypeScript strict, Tailwind CSS, static JSON data. No backend, no runtime API calls. Deployed to Vercel.

**Build order rationale:** Data + types first so every component has real shapes to work against. Matching logic second — tested in isolation before wired to UI. Components built leaf-to-root. Pages assembled last from finished components.

---

## Phase 1 — Project Bootstrap

- [ ] Scaffold Next.js 14 App Router project with TypeScript strict mode (`"strict": true` in `tsconfig.json`)
- [ ] Configure Tailwind with design tokens from PRD §2.2:
  - Colour palette: `primary`, `neutral`, `success`, `error`
  - Font families: `display` (Palatino Linotype — system serif), `body` (Source Sans 3), `mono` (JetBrains Mono)
  - Border radii: `sm` / `md` / `lg`
  - Shadows: `sm` / `md` / `lg`
- [ ] Set up `next/font/google` for Source Sans 3 only — Palatino Linotype is a system serif, no web font load needed
- [ ] Add CSS custom properties to `globals.css` (colour tokens, radii, shadows)
- [ ] Create full folder structure per PRD §2.4:
  ```
  src/app/        src/components/   src/context/
  src/lib/        src/locales/      src/data/
  src/types/
  ```
- [ ] Set `NEXT_PUBLIC_CARD_VERSION` as a Vercel environment variable (value: `C` for initial deploy)

---

## Phase 2 — Data & Types

### 2a — Type Definitions (`src/types/index.ts`)

- [ ] `NeighbourhoodAttributes` interface (9 fields, all `number` 0–10)
- [ ] `ListingObject` interface — headline, price, bedroomCount, bodyText, photos tuple, postedAt, scamFlags union array
- [ ] `CommunityQuote` interface — text + attribution
- [ ] `Neighbourhood` interface — full record including nested `medianRent` and `listings`
- [ ] All `SessionState` union types: `ReasonForMoving`, `Timeline`, `Household`, `Bedrooms`, `Budget`, `Transport`, `FreeDay`, `NeighbourhoodEnergy`, `OutdoorsAccess`, `CulturalCommunity`, `ComfortPriority`
- [ ] `SessionState` interface — all 28 fields, all nullable except `cardVersion`

### 2b — Neighbourhood Data (`src/data/neighbourhoods.json`)

8 records: Kitsilano, Mount Pleasant, Commercial Drive, Yaletown, Strathcona, West End, Riley Park, East Vancouver.

For each record:

- [ ] Attribute scores per the table in PRD §3.6
- [ ] Median rents (1BR / 2BR / 3BR) per the table in PRD §3.6
- [ ] Listing prices: exactly 10% below median for each bedroom count, rounded **down** to nearest $50
- [ ] All three scam flags on every listing: `["belowMedian", "immediateAvailability", "utilitiesIncluded"]`
- [ ] Listing body text must weave in naturally (no headers): below-market price, renovated property, immediate availability, utilities included, responsive landlord
- [ ] Community quotes: West End, Commercial Drive, Mount Pleasant → non-null; all others → `null`
- [ ] `analogousComparisons`: every record **must** include a `"default"` key (missing = data bug, will throw in dev)
- [ ] Hero images: Unsplash URLs, one per neighbourhood, documented in a comment in the JSON
- [ ] Listing photos: 3 per bedroom type per neighbourhood (24 photos total) — Unsplash URLs
- [ ] `vacancyRate` values per neighbourhood

### 2c — Locale Strings (`src/locales/en.ts`)

- [ ] `landing.*` — all landing screen strings
- [ ] `quiz.q1` through `quiz.q14` — question label + `whyWeAsk` text per question
- [ ] `quiz.shared.*` — "Continue →", "See my match →", "None of these feel right", "Why we ask", phase labels
- [ ] `loading.*` — headline, sub-copy, 4 chip labels
- [ ] `result.*` — label, worthKnowing, saveButton, startAgain, rentalEntry, comingNext
- [ ] `listing.*` — back link, postedAt display
- [ ] `scamShield.*` — all modal copy, 3 flag labels, pitch copy, confirmation text
- [ ] `save.*` — bottom sheet copy, confirmation text
- [ ] Implement `t(key, params?)` helper for parameterised strings (e.g. `{neighbourhood}` in rental CTA)

---

## Phase 3 — Core Logic

### 3a — Matching Algorithm (`src/lib/matching.ts`)

Pure function — no side effects, independently unit-testable.

- [ ] Signature: `function computeMatch(session: SessionState, neighbourhoods: Neighbourhood[]): string`
- [ ] Base weight: 1 for all 9 attributes
- [ ] Weight adjustments per quiz answer (PRD §4.2):
  - [ ] Q3 Household — 5 value branches
  - [ ] Q5 Transport — 5 value branches
  - [ ] Q6 Free day — 6 value branches
  - [ ] Q7 Neighbourhood energy — 6 value branches (including `edges-emerging` raw score bonus on Strathcona + East Vancouver)
  - [ ] Q8 Outdoors access — 5 value branches
  - [ ] Q9 Cultural community — 3 value branches
  - [ ] Q10 Comfort & safety — 6 value branches (including `diversity-inclusion` raw score bonus on West End + Commercial Drive)
- [ ] Q4 Budget penalty: flat -50 to raw score if median rent for the user's bedroom count exceeds the top of the user's budget band; `over-3500`, `not-sure`, `other` → no penalty
- [ ] Score formula: `Σ (attributeValue × attributeWeight)` then apply flat penalties/bonuses
- [ ] Score normalisation: `Math.round((rawScore / maxRawScore) * 100)` — winner displays `100`
- [ ] Tie-breaking: first in `neighbourhoods` array wins (JSON order is authoritative)
- [ ] Analogous comparison lookup (§4.4):
  - Build key: `${currentCity}_${currentNeighbourhood}` (trimmed)
  - Fallback to `"default"` key
  - If `"default"` missing: throw in dev; render fallback string in production
- [ ] Unit tests — minimum one case per scoring branch; at least one tie-break test; at least one budget penalty test

### 3b — Session Context (`src/context/SessionContext.tsx`)

- [ ] `SessionContextValue` interface with `state`, `setAnswer`, `runMatching`, `resetSession`, and three derived values
- [ ] Initial state: all fields `null`; `cardVersion` initialised from URL param → env var → `'C'`
- [ ] `setAnswer(field, value)` — generic field setter
- [ ] `runMatching()` — calls `computeMatch`, stores `matchedNeighbourhoodId` to state
- [ ] `resetSession()` — returns all state to initial values
- [ ] Derived values (computed, not stored):
  - `isQuizComplete` — true when all Phase 1 + Phase 2 non-Other fields are non-null
  - `matchedNeighbourhood` — resolved from `matchedNeighbourhoodId`
  - `selectedListing` — resolved from `matchedNeighbourhood.listings[bedroomKey]`
- [ ] `useMemo` on context value object to prevent unnecessary re-renders
- [ ] `useSession()` hook — throws if used outside provider

---

## Phase 4 — Primitive UI Components (`src/components/ui/`)

- [ ] **`Button`** — variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; `disabled`, `fullWidth`, `type` props
  - Primary: `bg-primary-500 text-white hover:bg-primary-700 disabled:bg-neutral-100 disabled:text-neutral-300`
- [ ] **`TextInput`** — label, placeholder, optional tag, `onChange`
- [ ] **`TextArea`** — label, placeholder, `onChange`, value
- [ ] **`Icon`** — thin Lucide React wrapper; named icon imports only (no barrel import)

---

## Phase 5 — Quiz Components (`src/components/quiz/`)

- [ ] **`ProgressBar`** — 14 pips, 4 phase clusters; pip = 8×8px rounded square; gap within phase = 4px, gap between phases = 12px; active: `bg-primary-500`, inactive: `bg-neutral-200`; derives phase grouping internally from static config
- [ ] **`PhaseLabel`** — phase chip: `bg-primary-500 text-white text-xs font-body uppercase tracking-widest px-2 py-0.5 rounded-sm`
- [ ] **`QuizQuestion`** — accepts `questionKey` (for locale lookup) + `children` (answer controls); optional `showWhyWeAsk` (default true)
- [ ] **`WhyWeAskToggle`** — collapsed: `+ Why we ask`; expanded: `− Why we ask`; inline height transition 200ms; copy from `locales/en.ts`
- [ ] **`SingleSelectOptions`** — full-width pill cards; unselected: `bg-white border-neutral-200`; selected: `bg-neutral-900 text-white`; hover: `bg-neutral-50`; replaces previous selection on click
- [ ] **`MultiSelectOptions`** — same visual spec but `value: string[]`; toggles individual values
- [ ] **`EscapeHatch`** — dashed-border pill (`border-dashed border-neutral-300 text-neutral-400`) → on click: hide pill, clear MC selection, show TextArea; on MC re-selection: hide textarea, clear textarea value, store MC value
- [ ] **`ContinueButton`** — disabled state per prop; label `Continue →` for steps 1–13, `See my match →` for step 14

---

## Phase 6 — Result Components (`src/components/result/`)

- [ ] **`MatchScoreBadge`** — `font-mono text-3xl`; format: `XX%`
- [ ] **`AnalogousComparisonBlock`** — rust left-border card; Version B + C only
- [ ] **`PersonalityDescriptionBlock`** — plain body text; Version B + C only
- [ ] **`DataSourcePills`** — row of 3 pills: `Walkscore`, `CMHC vacancy`, `Community data`; `font-mono text-xs border-neutral-200`; Version B + C only
- [ ] **`CommunityVoiceBlock`** — `bg-neutral-50 border-l-4 border-primary-500 px-4 py-3`; quote in `font-display italic`; attribution `text-xs text-neutral-400`; **null-safe: omit silently if `communityQuote` is null**; Version C only
- [ ] **`WorthKnowingBlock`** — fixed copy (PRD §5.4); Version B + C only; not rendered for Version A
- [ ] **`NeighbourhoodMatchCard`** — orchestrates all blocks; accepts `neighbourhood`, `score`, `version`, `analogousText`; version-gates each block per PRD §5.4 render order

---

## Phase 7 — Listing Components (`src/components/listing/`)

- [ ] **`RentalListingCard`** — system font body only; no Palatino, no `primary-500` inside the card (intentional Craigslist aesthetic)
- [ ] **`ListingPhotoStrip`** — 3 photos; horizontally scrollable; fixed height 200px; `object-cover`
- [ ] **`ScamFlagItem`** — `alert-triangle` icon in `text-error-500` + flag label text

---

## Phase 8 — Modal / Sheet Components (`src/components/modals/`)

### `ScamShieldModal` (PRD §5.6)

- [ ] React portal via `createPortal(children, document.body)`
- [ ] Overlay: `fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center`
- [ ] Inner panel: `bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full mx-auto p-6 max-h-[90vh] overflow-y-auto`
- [ ] Focus trap — Tab cycles within modal only; first focus on close button or first interactive element
- [ ] Escape key closes modal; "No thanks, go back" link closes modal
- [ ] Render order: warning icon → header → 3 body paragraphs → 3 named red flags → divider → Scam Shield pitch → email input + CTA
- [ ] Submit: no API call; hide form, show `"You're on the list."` in `text-success-500`; disable submit button
- [ ] Re-open resets to initial (form visible, confirmation hidden)

### `SaveBottomSheet` (PRD §5.7)

- [ ] Slides up from bottom: `fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg z-40 p-6`; max height 60vh
- [ ] Overlay: `fixed inset-0 bg-black/40 z-30`; clicking overlay closes sheet
- [ ] Escape key closes sheet
- [ ] Handle bar (decorative)
- [ ] Email input + `Save my results` button → no API call → show `"Done — your results are saved. We'll be in touch."`
- [ ] `×` icon button top-right to close
- [ ] Re-open resets form

---

## Phase 9 — Pages & Routes

### Landing (`/`)

- [ ] Full-height viewport, vertically centred, max-width 420px
- [ ] Render order per PRD §5.1: product label → headline (second line italic) → body → sub-body → supporting copy card → `Start →` CTA → privacy note
- [ ] No nav bar, no secondary actions, no login prompt
- [ ] "Start →" resets all session state if `matchedNeighbourhoodId` is already set, then navigates to `/quiz/1`

### Quiz (`/quiz/[step]`)

The most complex route. Each step maps to a question config.

- [ ] Route guard: step < 1 → redirect `/quiz/1`; step > 14 → redirect `/loading`; non-integer → redirect `/quiz/1`
- [ ] Back navigation: all steps; step 1 back → `/` (does not clear answers)
- [ ] Persistent layout: ProgressBar → PhaseLabel → QuizQuestion → ContinueButton
- [ ] Screen-to-step mapping:

| Screen | Steps / Questions | Notes |
|---|---|---|
| 1 | Q1 — Reason for moving | SingleSelect + EscapeHatch |
| 2 | Q2 + Q3 + Q3b | Q2 SingleSelect, Q3 MultiSelect, Q3b horizontal SingleSelect (no EscapeHatch); Continue requires all three |
| 3 | Q4 + Q5 | Q4 SingleSelect + EscapeHatch, Q5 MultiSelect; store dominant transport mode (first selected) for scoring |
| 4 | Q6 — Free day | Phase 2 transition; SingleSelect + EscapeHatch |
| 5 | Q7 — Neighbourhood energy | SingleSelect + EscapeHatch |
| 6 | Q8 + Q9 | Q8 SingleSelect + EscapeHatch, Q9 SingleSelect no EscapeHatch; Q9 `yes`/`somewhat` → inline TextArea (animated 200ms) |
| 7 | Q10 — Comfort & safety | SingleSelect + EscapeHatch; all 10 Phase 1+2 pips now active |
| 8 | Q11 — Current city + neighbourhood | Phase 3 transition; two TextInputs; city required, neighbourhood optional; no Vancouver names on screen |
| 9 | Q12 — Describe neighbourhood | TextArea; headline uses neighbourhood if present, else city |
| 10 | Q13 — Favourite place | Phase 4 transition; two TextInputs, both optional; Continue always enabled |
| 11 | Q14 — What makes it your favourite | TextArea, optional; CTA: `See my match →`; on click: `runMatching()` → navigate to `/loading` |

- [ ] Phase label chip updates at steps 6 (Phase 2), 11 (Phase 3), 13 (Phase 4)

### Loading (`/loading`)

- [ ] Route guard: `matchedNeighbourhoodId` must be set → else redirect `/`
- [ ] No back button rendered
- [ ] Browser back from `/result` → `/loading`: detect `matchedNeighbourhoodId` already set → skip delay → redirect to `/result` immediately
- [ ] Full viewport, vertically centred, max-width 320px
- [ ] 4 processing chips with staggered fade-in + translateY animation (delays: 0 / 500 / 1000 / 1500ms; 300ms transition each)
- [ ] Fixed delay of **3,500ms** from page mount → navigate to `/result` (do not randomise)

### Result (`/result`)

- [ ] Route guard: `matchedNeighbourhoodId` set → else redirect `/`
- [ ] Card version resolution on mount: `?version` URL param → `NEXT_PUBLIC_CARD_VERSION` env → `'C'`; version read once, subsequent URL changes do not update it
- [ ] Single-column, max-width 480px, scrollable
- [ ] Render order per PRD §5.4: YOUR MATCH label → neighbourhood name → tagline → MatchScoreBadge → (B+C) AnalogousComparisonBlock → (B+C) PersonalityDescriptionBlock → (B+C) DataSourcePills → (C, null-safe) CommunityVoiceBlock → (B+C) WorthKnowingBlock → action buttons → rental taster entry
- [ ] `Save my results` → opens `SaveBottomSheet`
- [ ] `Start again` → resets all session state → `/`
- [ ] Rental taster CTA: `See what's available in [neighbourhood.name] right now →` → `/result/listing`

### Rental Taster (`/result/listing`)

- [ ] Route guard: `matchedNeighbourhoodId` AND `bedrooms` set → else redirect `/result`
- [ ] Listing resolution: `matchedNeighbourhood.listings[bedroomKey]`; null listing → error state with `← Back to your match` link (no crash)
- [ ] Top bar: `← Back to your match` link + neighbourhood name label
- [ ] Listing card: system font body; no Palatino, no `primary-500` inside card
- [ ] Price format: `$${listing.price.toLocaleString('en-CA')}/month`
- [ ] `ListingPhotoStrip` (3 photos, horizontal scroll)
- [ ] `Reply to this post / Express interest` button — Connect4 primary style — opens `ScamShieldModal`

---

## Phase 10 — Localisation

- [ ] All hardcoded strings extracted to `src/locales/en.ts`
- [ ] `t(key, params?)` helper implemented and used throughout
- [ ] No neighbourhood names appear in UI strings (they come from data, not locale)
- [ ] Verify no English strings are hardcoded outside `locales/en.ts` or `data/neighbourhoods.json`

---

## Phase 11 — Accessibility & Quality

- [ ] WCAG 2.1 AA contrast ratios verified for all colour combinations (primary-500 on white, neutral-900 on white, etc.)
- [ ] All quiz options keyboard-operable (Enter/Space to select)
- [ ] Focus traps working on both modals — Tab cycles within, Escape closes
- [ ] All `next/image` instances have meaningful `alt` text
- [ ] No `console.log` in production; `console.error` only for caught errors
- [ ] TypeScript strict — no `any`, no unsafe `as` assertions
- [ ] ESLint: all warnings treated as errors
- [ ] No unnecessary dependencies — Lucide React named imports only
- [ ] Manual test: card version switching via `?version=A`, `?version=B`, `?version=C` URL params
- [ ] Manual test: all three scam flags display correctly in ScamShieldModal
- [ ] Manual test: browser back from `/result` → `/loading` skips delay

---

## Known Risks & Notes

| Risk | Detail |
|---|---|
| Q5 transport multi-select storage | Transport is multi-select but scoring uses only the dominant mode (first selected). Storage contract must be nailed early — `transport` field stores the dominant mode; full array not currently in the type spec. Decide before building quiz. |
| Analogous comparison key matching | Lookup key is `${currentCity}_${currentNeighbourhood}` from free-text input — exact string match against authored JSON keys. Consider whether to normalise (trim + lowercase) or simply document authoring conventions strictly. |
| Screen 3 / Q2 + Q3 + Q3b stacking | Most complex quiz screen — three questions, two interaction types, Continue requires all three to have values. Build and test this screen before templating simpler ones. |
| `edges-emerging` + `diversity-inclusion` bonuses | These apply flat raw score bonuses to specific neighbourhoods — easy to miss during weight table implementation. Unit test these branches explicitly. |
| `communityQuote` null handling | CommunityVoiceBlock must omit silently (no empty card) when `communityQuote` is null. Easy to miss if not explicitly tested with a null-quote neighbourhood. |

---

*Based on: PRD v1.0 · OST v2.2 · Creative Brief v1.0 · Concept Brief Opportunity 1 v1.0*
