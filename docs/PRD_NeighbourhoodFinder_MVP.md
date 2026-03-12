# Product Requirements Document: Connect4 Neighbourhood Finder MVP
**Connect4 · Vancouver Newcomer Housing**
Version 1.0 — Internal Demo Build
Date: 2026-03-11

---

## 1. Scope and Constraints

### 1.1 Purpose
This PRD specifies the full implementation of the Connect4 Neighbourhood Finder MVP — an internal demo build. It is not a public launch. All data is mocked. No real authentication, email delivery, AI processing, or external APIs are used.

### 1.2 Authoritative sources
- **Quiz questions, copy, and per-screen UX:** `Connect4 — Onboarding Flow Walkthrough.pdf` (Prototype v4, 14 questions, 4 phases). This PDF is the authoritative spec for all question wording, option labels, "Why we ask" copy, and screen-level design rationale. This PRD specifies structure and logic; the PDF specifies copy.
- **Experience flow, screens, and scam shield mechanic:** `Creative_Brief_NeighbourhoodFinder_MVP.md`
- **Product rationale and card version experiment:** `Concept_Brief_Opportunity1.md`

### 1.3 Card version flag
The result screen renders one of three card versions. This is a developer-only control:
- URL param `?version=A|B|C` overrides the environment variable
- Environment variable `NEXT_PUBLIC_CARD_VERSION` sets the build default
- If both are absent or invalid: default to `C`
- This is never surfaced as a UI control

### 1.4 Explicitly out of scope
- Real authentication or persistent user accounts
- Any external API calls at runtime (no Craigslist, Kijiji, CMHC, WalkScore, or similar)
- Actual email delivery or data storage beyond session state
- AI or ML matching (matching is deterministic weighted scoring over static JSON)
- Card version A/B/C as a user-facing control
- Mobile app or PWA
- Languages other than English (i18n-ready strings required from day one)
- Multiple match results / shortlist view (single top match only)
- Community review submission flow
- Landlord or agency views
- Analytics, tracking, or third-party scripts

---

## 2. Tech Stack and Project Setup

### 2.1 Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 14+ App Router, TypeScript strict mode |
| Styling | Tailwind CSS with CSS custom properties for design tokens |
| Fonts | Palatino Linotype (display/headings, system serif) + Source Sans 3 (body/UI) via `next/font/google` |
| Icons | Lucide React |
| State | React Context (session only, no persistence) |
| Data | Static JSON imported at build time |
| Deployment | Vercel — no server runtime required |

### 2.2 Design tokens (Tailwind config extensions)

```ts
// tailwind.config.ts
colors: {
  primary: {
    50:  '#fdf6ee',
    100: '#f5e8d0',
    500: '#c87800',  // rust/terracotta — primary action colour
    700: '#8a5200',
  },
  neutral: {
    50:  '#f5f2ed',  // warm off-white — page background
    100: '#ede8e1',
    200: '#d8d0c5',
    400: '#a09080',
    600: '#6b5f52',
    900: '#1a1a1a',  // near-black — body text
  },
  success: { 500: '#3a7d44' },
  error:   { 500: '#c0392b' },
}
fontFamily: {
  display: ['Palatino Linotype', 'Palatino', 'Book Antiqua', 'Georgia', 'serif'],
  body:    ['Source Sans 3', 'Source Sans Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
}
```

**CSS custom properties (`globals.css`):**
```css
:root {
  --color-bg:           #f5f2ed;
  --color-surface:      #ffffff;
  --color-primary:      #c87800;
  --color-text:         #1a1a1a;
  --color-text-muted:   #6b5f52;
  --radius-sm:          6px;
  --radius-md:          10px;
  --radius-lg:          16px;
  --shadow-sm:          0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:          0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg:          0 8px 24px rgba(0,0,0,0.14);
}
```

### 2.3 App Router routes
```
/                     Landing screen
/quiz/[step]          Quiz steps 1–14
/loading              Processing screen
/result               Result screen
/result/listing       Rental taster
```

### 2.4 File structure
```
src/
  app/
    layout.tsx                  root layout; SessionProvider; font imports
    page.tsx                    Landing screen
    quiz/[step]/page.tsx        Quiz step renderer
    loading/page.tsx            Loading / processing screen
    result/page.tsx             Result screen
    result/listing/page.tsx     Rental taster
  components/
    quiz/
      ProgressBar.tsx
      PhaseLabel.tsx
      QuizQuestion.tsx
      WhyWeAskToggle.tsx
      SingleSelectOptions.tsx
      MultiSelectOptions.tsx
      EscapeHatch.tsx
      ContinueButton.tsx
    result/
      NeighbourhoodMatchCard.tsx
      AnalogousComparisonBlock.tsx
      PersonalityDescriptionBlock.tsx
      CommunityVoiceBlock.tsx
      WorthKnowingBlock.tsx
      MatchScoreBadge.tsx
      DataSourcePill.tsx
    listing/
      RentalListingCard.tsx
      ListingPhotoStrip.tsx
      ScamFlagItem.tsx
    modals/
      ScamShieldModal.tsx
      SaveBottomSheet.tsx
    ui/
      Button.tsx
      TextInput.tsx
      TextArea.tsx
      Icon.tsx
  context/
    SessionContext.tsx
  lib/
    matching.ts                 pure matching function — no side effects
  locales/
    en.ts                       all user-facing strings
  data/
    neighbourhoods.json
  types/
    index.ts
```

### 2.5 Accessibility
WCAG 2.1 AA throughout. All interactive elements keyboard-operable. Minimum contrast ratio 4.5:1 for text. All modals trap focus. Escape key closes modals and bottom sheets. No motion-dependent interactions (animations are progressive enhancement only).

---

## 3. Data Model

All types are defined in `src/types/index.ts`. All static data lives in `src/data/neighbourhoods.json`.

### 3.1 Attribute scores
All neighbourhood attribute values are integers in the range **0–10** (inclusive). 10 = highest presence of that quality.

```ts
interface NeighbourhoodAttributes {
  walkability:        number  // 0–10
  transitScore:       number  // 0–10
  cyclingScore:       number  // 0–10
  outdoorsAccess:     number  // 0–10 — trails/beach/park proximity
  culturalDiversity:  number  // 0–10 — community/cultural institution density
  safetyPerception:   number  // 0–10 — community safety perception score
  socialEnergy:       number  // 0–10 — restaurants/bars/events density
  fitnessAccess:      number  // 0–10 — gyms/studios/sports facilities density
  quietness:          number  // 0–10 — residential calm, inverse of social energy
}
```

### 3.2 Listing
```ts
interface ListingObject {
  headline:     string
  price:        number                          // monthly rent in CAD, integer
  bedroomCount: 1 | 2 | 3
  bodyText:     string
  photos:       [string, string, string]        // exactly 3 URLs
  postedAt:     string                          // display string, e.g. "2 hours ago"
  scamFlags:    Array<'belowMedian' | 'immediateAvailability' | 'utilitiesIncluded'>
}
```

All demo listings must contain all three scam flags. `price` must be set to exactly 10% below the neighbourhood's `medianRent` for that bedroom count (round down to nearest $50).

### 3.3 Community quote
```ts
interface CommunityQuote {
  text:          string   // the quote, in quotation marks in copy
  attribution:   string   // e.g. "Software engineer · No car · Arrived Aug 2024"
}
```

### 3.4 Neighbourhood
```ts
interface Neighbourhood {
  id:                    string                 // kebab-case, e.g. "mount-pleasant"
  name:                  string                 // e.g. "Mount Pleasant"
  district:              string                 // e.g. "East Side"
  tagline:               string                 // short italic sub-headline
  heroImage:             string                 // URL
  personalityDescription: string                // 2–3 sentences of plain-language character
  analogousComparisons:  Record<string, string> // keys: "City_Neighbourhood" or "default"
  communityQuote:        CommunityQuote | null  // null = block omitted silently
  attributes:            NeighbourhoodAttributes
  medianRent: {
    oneBed:   number
    twoBed:   number
    threeBed: number
  }
  vacancyRate:           number                 // percentage, e.g. 2.1
  listings: {
    oneBed:   ListingObject
    twoBed:   ListingObject
    threeBed: ListingObject
  }
}
```

**Constraint:** Every neighbourhood must have a `"default"` key in `analogousComparisons`. Missing this key is a data bug that will cause a runtime fallback failure.

### 3.5 Session state
```ts
// Phase 1 — Practicalities
type ReasonForMoving    = 'work' | 'school' | 'family' | 'chose-vancouver' | 'figuring-it-out' | 'other'
type Timeline           = 'under-4-weeks' | '1-2-months' | '3-months-plus' | 'flexible' | 'other'
type Household          = 'just-me' | 'me-and-pet' | 'me-and-partner' | 'me-and-children' | 'other'
type Bedrooms           = 1 | 2 | 3
type Budget             = 'under-1800' | '1800-2500' | '2500-3500' | 'over-3500' | 'not-sure' | 'other'
type Transport          = 'transit' | 'walking' | 'cycling' | 'car' | 'other'

// Phase 2 — Lifestyle
type FreeDay            = 'cafe-walking' | 'outdoors-active' | 'farmers-market' | 'sleeping-in' | 'cultural-browse' | 'other'
type NeighbourhoodEnergy= 'alive-buzzy' | 'quiet-grounded' | 'scene-community' | 'space-air' | 'edges-emerging' | 'other'
type OutdoorsAccess     = 'essential' | 'important' | 'nice-to-have' | 'not-a-factor' | 'other'
type CulturalCommunity  = 'yes' | 'somewhat' | 'not-a-priority'
type ComfortPriority    = 'personal-safety' | 'family' | 'community-feel' | 'quiet-decompress' | 'diversity-inclusion' | 'other'

interface SessionState {
  // Phase 1
  reasonForMoving:        ReasonForMoving | null
  reasonForMovingOther:   string | null
  timeline:               Timeline | null
  timelineOther:          string | null
  household:              Household | null
  householdOther:         string | null
  bedrooms:               Bedrooms | null         // required; no escape hatch
  budget:                 Budget | null
  budgetOther:            string | null
  transport:              Transport | null
  transportOther:         string | null
  // Phase 2
  freeDay:                FreeDay | null
  freeDayOther:           string | null
  neighbourhoodEnergy:    NeighbourhoodEnergy | null
  neighbourhoodEnergyOther: string | null
  outdoorsAccess:         OutdoorsAccess | null
  outdoorsAccessOther:    string | null
  culturalCommunity:      CulturalCommunity | null
  culturalCommunityText:  string | null           // inline text when 'yes' or 'somewhat'
  comfortPriority:        ComfortPriority | null
  comfortPriorityOther:   string | null
  // Phase 3
  currentCity:            string | null
  currentNeighbourhood:   string | null
  currentDescription:     string | null
  // Phase 4
  favouriteCity:          string | null           // optional
  favouriteNeighbourhood: string | null           // optional
  favouriteDescription:   string | null           // optional
  // Output
  matchedNeighbourhoodId: string | null
  cardVersion:            'A' | 'B' | 'C'
}
```

**Derived values** (computed, not stored — returned by `useSession()` hook):
- `isQuizComplete: boolean` — true when all Phase 1 + Phase 2 fields (except `*Other` variants) are non-null
- `matchedNeighbourhood: Neighbourhood | null` — resolved from `matchedNeighbourhoodId` against the data
- `selectedListing: ListingObject | null` — resolved from `matchedNeighbourhood.listings[bedroomKey]`

### 3.6 Neighbourhood data (8 records)

Seed `data/neighbourhoods.json` with the following. Attribute scores are authoritative for the matching algorithm.

| ID | Name | 1BR median | 2BR median | 3BR median | Key attributes |
|---|---|---|---|---|---|
| `kitsilano` | Kitsilano | $2,350 | $3,200 | $4,100 | walk:9 transit:7 cycling:8 outdoors:9 cultural:5 safety:8 social:7 fitness:8 quiet:4 |
| `mount-pleasant` | Mount Pleasant | $2,200 | $3,000 | $3,900 | walk:8 transit:8 cycling:9 outdoors:5 cultural:7 safety:7 social:8 fitness:7 quiet:3 |
| `commercial-drive` | Commercial Drive | $2,100 | $2,900 | $3,700 | walk:8 transit:8 cycling:7 outdoors:4 cultural:9 safety:7 social:8 fitness:5 quiet:3 |
| `yaletown` | Yaletown | $2,700 | $3,700 | $4,800 | walk:10 transit:9 cycling:6 outdoors:6 cultural:4 safety:9 social:8 fitness:9 quiet:4 |
| `strathcona` | Strathcona | $1,950 | $2,700 | $3,400 | walk:7 transit:7 cycling:8 outdoors:3 cultural:8 safety:5 social:6 fitness:4 quiet:5 |
| `west-end` | West End | $2,450 | $3,300 | $4,300 | walk:10 transit:8 cycling:7 outdoors:8 cultural:7 safety:8 social:7 fitness:7 quiet:5 |
| `riley-park` | Riley Park | $2,150 | $2,950 | $3,750 | walk:6 transit:6 cycling:5 outdoors:7 cultural:5 safety:8 social:4 fitness:4 quiet:8 |
| `east-vancouver` | East Vancouver | $1,900 | $2,650 | $3,350 | walk:6 transit:7 cycling:6 outdoors:4 cultural:9 safety:6 social:6 fitness:4 quiet:6 |

---

## 4. Matching Algorithm

Implemented as a pure function in `src/lib/matching.ts`. No side effects. Independently unit-testable.

### 4.1 Signature
```ts
function computeMatch(session: SessionState, neighbourhoods: Neighbourhood[]): string
// Returns the `id` of the highest-scoring neighbourhood
```

### 4.2 Attribute weight table

For each quiz answer value, the weight for specific neighbourhood attributes is adjusted. The base weight for every attribute starts at **1**. Answer values add to or subtract from these weights. The final score for a neighbourhood is:

```
score = Σ (attributeValue * attributeWeight) for all 9 attributes
```

**Q3 — Household:**
| Value | Attribute adjustments |
|---|---|
| `just-me` | quietness +1 |
| `me-and-pet` | outdoorsAccess +1, quietness +1 |
| `me-and-partner` | socialEnergy +1 |
| `me-and-children` | quietness +3, safetyPerception +2, outdoorsAccess +1, socialEnergy -1 |
| `other` | no adjustment |

**Q4 — Budget:** Compute the neighbourhood's median rent for the user's bedroom count. If median rent exceeds the top of the user's budget band, apply a penalty of -50 to that neighbourhood's raw score (applied after the weighted sum, as a flat penalty, not a weight adjustment).

| Budget band | Top of band (CAD) |
|---|---|
| `under-1800` | 1,800 |
| `1800-2500` | 2,500 |
| `2500-3500` | 3,500 |
| `over-3500` | no upper limit (no penalty) |
| `not-sure` | no penalty |
| `other` | no penalty |

**Q5 — Transport:**
| Value | Attribute adjustments |
|---|---|
| `transit` | transitScore +3 |
| `walking` | walkability +3 |
| `cycling` | cyclingScore +3, walkability +1 |
| `car` | no adjustment (car users are not constrained by transit) |
| `other` | no adjustment |

**Q6 — Free day:**
| Value | Attribute adjustments |
|---|---|
| `cafe-walking` | walkability +2, socialEnergy +1 |
| `outdoors-active` | outdoorsAccess +3, fitnessAccess +1 |
| `farmers-market` | walkability +1, culturalDiversity +1, socialEnergy +1 |
| `sleeping-in` | quietness +2 |
| `cultural-browse` | walkability +2, culturalDiversity +2, socialEnergy +1 |
| `other` | no adjustment |

**Q7 — Neighbourhood energy:**
| Value | Attribute adjustments |
|---|---|
| `alive-buzzy` | socialEnergy +3, quietness -2 |
| `quiet-grounded` | quietness +3, socialEnergy -1 |
| `scene-community` | socialEnergy +2, culturalDiversity +1 |
| `space-air` | outdoorsAccess +2, quietness +2, socialEnergy -1 |
| `edges-emerging` | culturalDiversity +2, socialEnergy +1 — and apply a bonus of +10 to Strathcona and East Vancouver raw scores |
| `other` | no adjustment |

**Q8 — Outdoors access:**
| Value | Attribute adjustments |
|---|---|
| `essential` | outdoorsAccess +4 |
| `important` | outdoorsAccess +2 |
| `nice-to-have` | outdoorsAccess +1 |
| `not-a-factor` | outdoorsAccess -1 |
| `other` | no adjustment |

**Q9 — Cultural community:**
| Value | Attribute adjustments |
|---|---|
| `yes` | culturalDiversity +3 |
| `somewhat` | culturalDiversity +1 |
| `not-a-priority` | no adjustment |

**Q10 — Comfort & safety:**
| Value | Attribute adjustments |
|---|---|
| `personal-safety` | safetyPerception +3 |
| `family` | safetyPerception +2, quietness +1, outdoorsAccess +1 |
| `community-feel` | culturalDiversity +2, socialEnergy +1 |
| `quiet-decompress` | quietness +3 |
| `diversity-inclusion` | culturalDiversity +2, safetyPerception +1 — and apply a bonus of +10 to West End and Commercial Drive raw scores |
| `other` | no adjustment |

**Fields not used in scoring:** Q1 (reasonForMoving), Q2 (timeline), Q3b (bedrooms — gates listing only), and all Phase 3 + Phase 4 fields.

### 4.3 Tie-breaking
If two or more neighbourhoods share the highest score, return the one that appears first in the `neighbourhoods` array. The array order in `data/neighbourhoods.json` is the authoritative order.

### 4.4 Analogous comparison lookup
After match is determined:
1. Build a lookup key: `${session.currentCity}_${session.currentNeighbourhood}` (trim whitespace, preserve case as authored in the data)
2. Look up `matchedNeighbourhood.analogousComparisons[key]`
3. If no match: fall back to `matchedNeighbourhood.analogousComparisons['default']`
4. If `default` key is missing: this is a data bug — throw an error in development; render a fallback string "Somewhere that shares more with your current neighbourhood than you might expect." in production

### 4.5 Match score display
Normalise all neighbourhood scores to a 0–100 scale. The winning neighbourhood displays `100`. All others display proportionally. Formula:
```
displayScore = Math.round((rawScore / maxRawScore) * 100)
```
Display format: integer followed by a percent sign, e.g. `87%`. Use `font-mono` class.

---

## 5. Screen Specifications

### 5.1 Landing (`/`)

**Entry:** Always accessible.
**Exit:** "Start →" button → `/quiz/1`. If session state has a `matchedNeighbourhoodId`, reset all session state before proceeding.

**Layout:** Full-height viewport, vertically centred content, max-width 420px, horizontally centred.

**Content (render order):**
1. Product label — `NEIGHBOURHOOD FIT TOOL · VANCOUVER` — `text-xs font-body tracking-widest text-neutral-400 uppercase`
2. Headline — `Find the neighbourhood` / `that fits who you are.` — `font-display text-4xl font-bold` — second line in italic
3. Body — `Tell us who you are. We'll help you find somewhere that feels like it was waiting for you.`
4. Sub-body — `Under 10 minutes. No account needed to start.` — muted, smaller
5. Supporting copy block (styled card, neutral-100 bg) — `Finding a neighbourhood isn't just about price per square foot. It's about whether the place fits how you actually live. That's what we're trying to figure out together.`
6. CTA button — `Start →` — full-width, primary variant
7. Privacy note — `Your answers are used only to find your match. Nothing is saved unless you save it.` — `text-xs text-center text-neutral-400` — below button

**No navigation bar. No secondary actions. No login prompt.**

---

### 5.2 Quiz (`/quiz/[step]`)

**Entry:** Any step 1–14. If step param is 0 or absent, redirect to `/quiz/1`. If step > 14, redirect to `/loading`.
**Exit per step:** "Continue →" (or "See my match →" on step 14) advances to next step. On step 14, runs `runMatching()` then navigates to `/loading`.
**Back navigation:** All steps have back navigation to the previous step. Step 1 back → `/` (does not clear answers).

**Persistent QuizLayout structure (all steps):**
- Top bar: `ProgressBar` (14 pips, 4 phase clusters)
- Below pip bar: `PhaseLabel` chip for the current phase
- Main content area: `QuizQuestion` wrapper
- Bottom: `ContinueButton`

**ProgressBar spec:**
- 14 pips total, grouped: Phase 1 = pips 1–5 (plus Q3b makes 6 screens but Q3+Q3b share one screen), Phase 2 = pips 6–10, Phase 3 = pips 11–12, Phase 4 = pips 13–14
- Pip = 8×8px rounded square; gap within phase = 4px; gap between phases = 12px
- Active pip: `bg-primary-500`; inactive: `bg-neutral-200`
- Phase label chip: `bg-primary-500 text-white text-xs font-body uppercase tracking-widest px-2 py-0.5 rounded-sm`

**WhyWeAskToggle spec:**
- Renders as `+ Why we ask` collapsed; `− Why we ask` expanded
- Text colour: `text-primary-500 text-sm`
- Body expands inline with 200ms height transition
- Copy is sourced from `locales/en.ts` key `quiz.q{n}.whyWeAsk`

**SingleSelectOptions spec:**
- Each option: full-width pill card, `py-3 px-4 rounded-md border`
- Unselected: `bg-white border-neutral-200 text-neutral-900`
- Selected: `bg-neutral-900 border-neutral-900 text-white`
- Hover (unselected): `bg-neutral-50`
- Selection replaces any previously selected value

**EscapeHatch spec:**
- Renders as a dashed-border pill below the main options: `border-dashed border-neutral-300 text-neutral-400`
- On click: hides itself, clears any MC selection, shows a `TextArea` labeled "Tell us more"
- On MC option click after escape hatch opened: hides textarea, clears textarea value, stores MC value

**ContinueButton spec:**
- Disabled state: `bg-neutral-100 text-neutral-300 cursor-not-allowed`
- Enabled state: primary button — `bg-primary-500 text-white hover:bg-primary-700`
- Label: `Continue →` for steps 1–13; `See my match →` for step 14

#### Step-by-step question specs

**Screen 2 / Step 1 — Q1: What's bringing you to Vancouver?**
- Phase: PHASE 1 — PRACTICALITIES
- Type: SingleSelect
- Options: For work · For school · To be closer to family or a partner · I chose Vancouver — not the other way around · Still figuring it out · [EscapeHatch]
- Maps to: `reasonForMoving`
- Scoring: not used in algorithm
- Continue enabled when: selection made

**Screen 3 / Steps 2–3 — Q2 + Q3: Timeline + Household**
- Two questions stacked on one screen
- Q2: When do you need to be settled?
  - Type: SingleSelect
  - Options: Under 4 weeks — this is urgent · 1–2 months — tight but manageable · 3 months or more — I have time · Flexible — researching now, moving later · [EscapeHatch]
  - Maps to: `timeline`
- Q3: Who are you moving with? (Select all that apply)
  - Type: MultiSelect
  - Options: Just me · Me and a pet · Me and a partner · Me and children · [EscapeHatch]
  - Maps to: `household`
- Continue enabled when: Q2 has a value AND Q3 has at least one value

**Screen 3b (same screen as Q3) — Q3b: Bedrooms**
Appended to the Q2+Q3 screen, below the household question.
> **How many bedrooms do you need?**
- Type: SingleSelect (3 options inline / horizontal)
- Options: 1 bedroom · 2 bedrooms · 3 or more bedrooms
- Maps to: `bedrooms` (stores as `1 | 2 | 3`)
- **No EscapeHatch on this question**
- Required: Continue is not enabled until Q2, Q3, and Q3b all have values

**Screen 4 / Steps 4–5 — Q4 + Q5: Budget + Transport**
- Two questions stacked on one screen
- Q4: What's your monthly rent budget?
  - Type: SingleSelect
  - Options: Under $1,800 — I need to be strategic · $1,800–$2,500 — realistic for a one-bedroom · $2,500–$3,500 — I have some flexibility · Over $3,500 — cost is secondary to fit · Not sure yet · [EscapeHatch]
  - Maps to: `budget`
- Q5: How will you get around Vancouver? (Select all that apply)
  - Type: MultiSelect — transport is multi-select; users may walk AND take transit
  - Options: Public transit — SkyTrain or bus · Walking — I want to walk everywhere · Cycling · I'll have a car · [no EscapeHatch — "Not sure" is a natural add if needed]
  - Maps to: `transport` — store as the dominant mode (first selected) for scoring; store full array if multi-select
- Continue enabled when: Q4 and Q5 both have values

**Screen 5 / Step 6 — Q6: Picture a free day**
- Phase: PHASE 2 — YOUR LIFESTYLE
- Phase label transition: pip bar shifts to Phase 2 cluster; phase chip updates
- Type: SingleSelect
- Sub-copy: `This tells us more about neighbourhood fit than your commute time.`
- Options: Coffee in a neighbourhood café, walking distance · Out early — trail run, bike ride, or kayak · Farmers market, then cooking something good · Sleeping in — whatever happens, happens · Gallery, record shop, bookstore — the kind of day that takes a detour · [EscapeHatch]
- Maps to: `freeDay`
- UX: Continue button renders disabled until selection made (explicit spec from PDF)

**Screen 6 / Step 7 — Q7: Neighbourhood energy**
- Type: SingleSelect
- Options: Alive and buzzy — I want to step outside and feel it · Quiet and grounded — I need to come home to somewhere calm · A scene I can become part of — regular spots, faces I'll recognise · Space and air — I've been in a city too long · Somewhere with edges — still becoming something · [EscapeHatch]
- Maps to: `neighbourhoodEnergy`

**Screen 7 / Steps 8–9 — Q8 + Q9: Outdoors + Cultural community**
- Two questions stacked
- Q8: How important is access to nature and the outdoors?
  - Type: SingleSelect
  - Options: Essential — trails, mountains, or water need to be close · Important, but not the defining factor · Nice to have · Not a factor for me · [EscapeHatch]
  - Maps to: `outdoorsAccess`
- Q9: Does cultural community, food, language, or religious institutions matter?
  - Type: SingleSelect
  - Options: Yes — this is important to me · Somewhat — nice to have · Not a priority
  - **No EscapeHatch** (three options cover the full range)
  - Maps to: `culturalCommunity`
  - Conditional follow-up: selecting `yes` or `somewhat` reveals an inline TextArea: "Which communities or institutions matter most?" — maps to `culturalCommunityText`
  - Conditional reveal/hide is animated (200ms height transition)
- Continue enabled when: Q8 and Q9 have values (culturalCommunityText is optional)

**Screen 8 / Step 10 — Q10: Comfort & safety**
- Type: SingleSelect
- Options: Personal safety — feel at ease walking at any hour · Family considerations — schools, parks, safe for children · Community feel — neighbours who look out for each other · Quiet and low-key — I need to decompress at home · Diversity and inclusion — I want to feel welcome as I am · [EscapeHatch]
- Maps to: `comfortPriority`
- UX note from PDF: all 10 Phase 1+2 pips are now active; this is the visible Phase 2 completion milestone

**Screen 9 / Step 11 — Q11: Where are you living right now?**
- Phase: PHASE 3 — WHERE YOU'RE FROM
- Type: Two TextInputs
- Content: Instruction text — `We'll ask you to describe it in your own words next. This is just the location.`
- Field 1: City — required — placeholder `e.g. Dublin, Toronto, Mumbai...` — maps to `currentCity`
- Field 2: Neighbourhood — optional — label `(if you know it)` — placeholder `e.g. The Liberties, Kensington, Bandra West...` — maps to `currentNeighbourhood`
- Design constraint: **No Vancouver neighbourhood names appear on this screen or any prior screen**
- Continue enabled when: City has a value

**Screen 10 / Step 12 — Q12: Describe your neighbourhood to a friend**
- Type: TextArea
- Headline: `How would you describe [currentNeighbourhood || currentCity] to a friend who's never been?`
- If both city and neighbourhood are present, use neighbourhood in the headline; otherwise use city
- Sub-copy: `Don't hold back — the detail is what helps us.`
- Placeholder: `e.g. It's loud and a bit chaotic but in a good way. Old buildings, cheap food, artists moving in. Feels like it's mid-transformation...`
- Maps to: `currentDescription`
- Continue enabled when: textarea has content (any length)

**Screen 11 / Step 13 — Q13: Favourite place (optional)**
- Phase: PHASE 4 — YOUR FAVOURITE PLACE
- Phase transition card: a warm-toned inline card at top of screen: `One more set of questions. This one's about a place you love — anywhere in the world. It doesn't have to be where you live now.`
- Type: Two TextInputs, both optional
- Headline: `Is there a neighbourhood anywhere in the world that just felt right — like it was made for you?`
- Field 1: City (optional) — placeholder `e.g. Barcelona, New York, Cape Town...` — maps to `favouriteCity`
- Field 2: Neighbourhood (optional) — placeholder `e.g. Eixample, West Village, De Waterkant...` — maps to `favouriteNeighbourhood`
- Skip note: `If you skip this, no problem — it helps but isn't required.`
- Continue enabled: always (both fields optional)

**Screen 12 / Step 14 — Q14: What makes it your favourite?**
- Type: TextArea
- Headline: `What makes it your favourite? What does it have that other places don't?`
- Placeholder: `e.g. The energy. Everyone's out on the street. Takes itself seriously without being precious. Good food everywhere.`
- Maps to: `favouriteDescription`
- Optional: Continue enabled even if empty
- CTA label: **`See my match →`** (not "Continue →")
- On click: runs `runMatching()`, stores `matchedNeighbourhoodId` to context, navigates to `/loading`

---

### 5.3 Loading (`/loading`)

**Entry condition:** `matchedNeighbourhoodId` must be set. If not: redirect to `/`.
**Back navigation:** Disabled. No back button rendered. If user uses browser back from `/result`, detect `matchedNeighbourhoodId` is already set and navigate immediately to `/result` without replaying the delay.

**Layout:** Full viewport, vertically centred, max-width 320px.

**Content:**
- Connect4 logo/wordmark (small, top of card)
- Headline: `Finding your match...` — `font-display text-2xl`
- Sub-copy: `This usually takes about 20 seconds.` — muted
- Four processing chips, staggered fade-in:

| Delay | Label |
|---|---|
| 0ms | Reading your neighbourhood descriptions |
| 500ms | Matching against personality profiles |
| 1000ms | Checking budget against real rental data |
| 1500ms | Building your results |

Each chip: small bullet/diamond icon + label text. Chip appears with `opacity-0` → `opacity-100`, `translateY(4px)` → `translateY(0)`, transition 300ms ease-out.

**Timing:** Fixed delay of **3,500ms** from page mount. After delay, navigate to `/result`. Do not randomise.

---

### 5.4 Result (`/result`)

**Entry condition:** `matchedNeighbourhoodId` set. If not: redirect to `/`.

**Layout:** Single-column, max-width 480px, horizontally centred. Scrollable.

**Render order:**

1. Label — `YOUR MATCH` — `text-xs font-body tracking-widest text-neutral-400 uppercase`
2. Neighbourhood name — `font-display text-4xl font-bold`
3. Tagline — `font-display italic text-primary-500 text-lg`
4. MatchScoreBadge — displays normalised score as `XX%` — `font-mono text-3xl`
5. *(Version B + C only)* AnalogousComparisonBlock — rust left-border card; text from `analogousComparisons` lookup
6. *(Version B + C only)* PersonalityDescriptionBlock — plain body text; `personalityDescription` field
7. *(Version B + C only)* DataSourcePills — row of 3 pills: `Walkscore`, `CMHC vacancy`, `Community data` — `font-mono text-xs border-neutral-200`
8. *(Version C only, omitted silently if null)* CommunityVoiceBlock — quote in Palatino italic; attribution in Source Sans 3 small
9. WorthKnowingBlock — always rendered for Version B and C; not rendered for Version A
10. Action buttons:
    - `Save my results` — primary button — opens `SaveBottomSheet`
    - `Start again` — ghost link — resets all session state → `/`
11. Rental taster entry (below the fold, separated by a divider):
    - Label: `COMING NEXT` — caption style
    - CTA: `See what's available in [neighbourhood.name] right now →` — secondary button or prominent text link
    - Navigates to `/result/listing`

**Worth Knowing block copy (fixed):**
> This is a match, not a certainty. No algorithm replaces walking the streets on a Tuesday morning. Shortlist two or three and visit each before you commit.

**CommunityVoiceBlock spec:**
- `bg-neutral-50 border-l-4 border-primary-500 px-4 py-3`
- Quote text in `font-display italic`
- Attribution: `text-xs text-neutral-400 font-body mt-2`

---

### 5.5 Rental Taster (`/result/listing`)

**Entry condition:** `matchedNeighbourhoodId` AND `bedrooms` set. If not: redirect to `/result`.

**Key design constraint:** The listing content area must not carry Connect4 branding. It renders as a plain, functional post — Craigslist aesthetic. Do not use Palatino or primary-500 colour inside the listing card itself.

**Listing resolution:**
```ts
const bedroomKey = { 1: 'oneBed', 2: 'twoBed', 3: 'threeBed' }[session.bedrooms]
const listing = matchedNeighbourhood.listings[bedroomKey]
```

If listing is null (data gap): render an error state — `Listing not available` — with a `← Back to your match` link. Do not crash.

**Layout:**
- Top bar: `← Back to your match` text link — navigates to `/result`; and neighbourhood name label
- Main card (white, subtle shadow, system font body):
  - Title bar: `[Neighbourhood Name] · [X] bed · $X,XXX/month` — left-aligned, plain
  - Headline: `listing.headline` — `text-base font-semibold`
  - Metadata line: `Posted [listing.postedAt]` — `text-xs text-neutral-500`
  - `ListingPhotoStrip` — 3 photos; horizontally scrollable on mobile; fixed height 200px; `object-cover`
  - Body text: `listing.bodyText` — plain `text-sm` — system font — no brand fonts
  - Spacer
  - `Reply to this post / Express interest` button — primary style (this button must match Connect4 primary, not Craigslist grey — it is the user's action point)

**Price formatting:** `$${listing.price.toLocaleString('en-CA')}/month`

**Interaction:** "Reply to this post" button → renders `ScamShieldModal` (modal overlay; listing page remains mounted behind it)

---

### 5.6 Scam Shield Modal

**Implementation:** React portal, rendered into `document.body`. Full-screen overlay: `fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center`. Inner panel: `bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full mx-auto p-6 max-h-[90vh] overflow-y-auto`.

**Focus trap:** When modal opens, focus moves to the close button or first interactive element. Tab cycles through modal elements only. Escape key closes the modal.

**Close:** Escape key OR "No thanks, go back" link → modal closes, listing page is back in full view. No state change on close.

**Render order:**

1. Warning icon (`alert-triangle`, `text-error-500`, large)
2. Header: `Wait — this listing has 3 red flags.` — `font-display text-xl font-bold`
3. Body paragraph 1:
   > Listings priced below market, described as renovated, and available immediately are the most common pattern used in phantom rental scams targeting newcomers in Vancouver.
4. Body paragraph 2:
   > The typical next step: the "landlord" asks for a deposit by e-transfer before you've seen the property. Once sent, it's gone.
5. Body paragraph 3:
   > We flagged this listing deliberately. On Craigslist and Kijiji, real listings and fake ones look identical. Without a way to check, the difference is impossible to spot.
6. Named red flags list (3 items, each with `alert-triangle` icon in `text-error-500`):
   - Price 10% below the neighbourhood median
   - "Available immediately — or sooner for the right person"
   - Utilities included (uncommon at this price point in this area)
7. Divider
8. Scam Shield pitch paragraph 1:
   > Scam Shield is our listing verification tool. Paste a URL — we'll flag phantom listings, suspicious landlord patterns, and illegal deposit requests before you commit.
9. Scam Shield pitch paragraph 2:
   > We're building it now. Leave your email for early access.
10. Email input (type=email) + `Get early access` primary button
11. Confirmation state (replaces form on submit): `You're on the list.` — `text-success-500 font-body`
12. Dismiss link: `No thanks, go back` — `text-sm text-neutral-400 text-center mt-4 block`

**Email submit behaviour:** Basic `type="email"` validation only. On submit (no API call): hide form, show confirmation text "You're on the list." Disable submit button. Modal re-open resets to initial state.

---

### 5.7 Save Bottom Sheet

**Trigger:** "Save my results" button on the result screen.
**Implementation:** Bottom sheet — slides up from bottom edge. `fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg z-40 p-6`. Max height 60vh. Overlay behind it: `fixed inset-0 bg-black/40 z-30`. Escape key closes.

**Content:**
1. Handle bar (decorative)
2. Headline: `Save your results`
3. Body: `Your quiz answers, neighbourhood match, and any selections will be saved. We'll send you a link to return.`
4. Email input + `Save my results` button
5. Confirmation state (replaces form on submit): `Done — your results are saved. We'll be in touch.`
6. Privacy note: `We won't share your email.` — `text-xs text-neutral-400`
7. Dismiss: `×` icon button top-right OR clicking the overlay closes the sheet

**Submit behaviour:** No API call. Show confirmation. Re-opening resets form.

---

## 6. Component Inventory

### 6.1 `Button`
```ts
interface ButtonProps {
  variant:  'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'           // default 'md'
  disabled?: boolean
  onClick?:  () => void
  children:  React.ReactNode
  type?:     'button' | 'submit'         // default 'button'
  fullWidth?: boolean
}
```
Primary: `bg-primary-500 text-white hover:bg-primary-700 disabled:bg-neutral-100 disabled:text-neutral-300`

### 6.2 `ProgressBar`
```ts
interface ProgressBarProps {
  currentStep: number   // 1–14
}
```
Derives phase grouping internally from a static config array. No phase config prop needed.

### 6.3 `QuizQuestion`
```ts
interface QuizQuestionProps {
  questionKey:   string           // e.g. 'q1' — used to look up locale strings
  children:      React.ReactNode  // answer controls
  showWhyWeAsk?: boolean          // default true
}
```

### 6.4 `SingleSelectOptions`
```ts
interface Option {
  value: string
  label: string
}
interface SingleSelectOptionsProps {
  options:    Option[]
  value:      string | null
  onChange:   (value: string) => void
  showEscape?: boolean   // default true
  escapeFreeText?: string | null
  onEscapeChange?: (text: string) => void
}
```

### 6.5 `MultiSelectOptions`
Same as `SingleSelectOptions` but `value: string[]`, `onChange: (values: string[]) => void`.

### 6.6 `NeighbourhoodMatchCard`
```ts
interface NeighbourhoodMatchCardProps {
  neighbourhood: Neighbourhood
  score:         number          // normalised 0–100
  version:       'A' | 'B' | 'C'
  analogousText: string          // resolved comparison string
}
```

### 6.7 `ScamShieldModal`
```ts
interface ScamShieldModalProps {
  isOpen:   boolean
  onClose:  () => void
  listing:  ListingObject
}
```
Rendered via `createPortal(children, document.body)`.

### 6.8 `SaveBottomSheet`
```ts
interface SaveBottomSheetProps {
  isOpen:  boolean
  onClose: () => void
}
```

---

## 7. State Management

### 7.1 SessionContext
Single context wrapping the entire app in `app/layout.tsx`.

```ts
interface SessionContextValue {
  state:         SessionState
  setAnswer:     (field: keyof SessionState, value: unknown) => void
  runMatching:   () => void
  resetSession:  () => void
  // Derived
  isQuizComplete:       boolean
  matchedNeighbourhood: Neighbourhood | null
  selectedListing:      ListingObject | null
}
```

`useSession()` hook wraps `useContext(SessionContext)` and throws if used outside the provider.

Memoize the context value object with `useMemo` to prevent unnecessary re-renders of all consumers on unrelated state updates.

### 7.2 Initial state
All fields `null` except `cardVersion` which initialises from the URL param / env variable / default 'C'.

### 7.3 No persistence
State is lost on page refresh. This is intentional. Do not add `localStorage` or cookie persistence.

---

## 8. Routing and Navigation

### 8.1 Route guards
Implement as server components with `redirect()` or client components checking context on mount.

| Route | Required condition | Redirect if not met |
|---|---|---|
| `/loading` | `matchedNeighbourhoodId !== null` | `/` |
| `/result` | `matchedNeighbourhoodId !== null` | `/` |
| `/result/listing` | `matchedNeighbourhoodId !== null` AND `bedrooms !== null` | `/result` |
| `/quiz/[step]` | step is 1–14 (integer) | step < 1 → `/quiz/1`; step > 14 → `/loading` |

### 8.2 Browser back from `/loading` → `/result`
If user navigates back to `/loading` and `matchedNeighbourhoodId` is already set, skip the delay and redirect to `/result` immediately.

### 8.3 Card version initialisation
On `/result` mount: read `?version` URL param → fall back to `process.env.NEXT_PUBLIC_CARD_VERSION` → fall back to `'C'`. Store in `sessionState.cardVersion`. Version is read once; subsequent URL changes do not update it.

---

## 9. Localisation

All user-facing strings are defined in `src/locales/en.ts`. Namespace convention: `{screen}.{element}`.

**Parameterised strings** use `{placeholder}` syntax. Implement a simple `t(key, params?)` helper:
```ts
// Usage:
t('result.rentalEntry', { neighbourhood: 'Kitsilano' })
// → "See what's available in Kitsilano right now →"
```

Neighbourhood names, taglines, personality descriptions, analogous comparisons, community quotes, and listing content are **data** (authored in `neighbourhoods.json`), not locale strings.

Key namespaces to define:
- `landing.*` — all landing screen strings
- `quiz.q{1-14}.*` — question label, whyWeAsk text
- `quiz.shared.*` — "Continue →", "See my match →", "None of these feel right", "Why we ask", phase labels
- `loading.*` — headline, sub-copy, chip labels
- `result.*` — label, worthKnowing, saveButton, startAgain, rentalEntry, comingNext
- `listing.*` — back link, postedAt display
- `scamShield.*` — all modal copy, flag labels, pitch copy, confirmation
- `save.*` — bottom sheet copy, confirmation

---

## 10. Non-Functional Requirements

- **Runtime API calls:** zero. All data is static JSON. No fetch calls at runtime.
- **Images:** use `next/image` with `unoptimized={false}`. Hero images and listing photos may use fixed Unsplash URLs for the demo (document the 8 hero image URLs and 24 listing photo URLs in the data file as absolute HTTPS URLs). No local image files required.
- **TypeScript:** strict mode (`"strict": true` in `tsconfig.json`). No `any`. No type assertions (`as X`) except where unavoidable with third-party types.
- **ESLint:** Next.js default config. All warnings treated as errors in CI.
- **Console output:** no `console.log` in production. Use `console.error` only for caught errors.
- **Fonts:** Palatino Linotype is a system serif — no web font load required for display text. Source Sans 3 loaded via `next/font/google`. No FOUT. System font stack used in rental listing card body intentionally.
- **Bundle size:** no unnecessary dependencies. Lucide React supports tree-shaking — import named icons only.
- **Vercel config:** no `vercel.json` required. Default Next.js build output. `NEXT_PUBLIC_CARD_VERSION` set as environment variable in Vercel dashboard.

---

## 11. Mocked Data Authoring Notes

When authoring `data/neighbourhoods.json`:

1. Every neighbourhood must have a `"default"` key in `analogousComparisons`
2. Listing prices must be exactly 10% below `medianRent` for that bedroom count, rounded down to nearest $50
3. All listings must include all three scam flags: `["belowMedian", "immediateAvailability", "utilitiesIncluded"]`
4. Listing body text must contain the following narrative signals (not headers, woven into natural copy): price is competitive, property is renovated or updated, available immediately or sooner for the right person, utilities included, landlord described as responsive
5. `communityQuote` is nullable — West End, Commercial Drive, and Mount Pleasant should have quotes for the demo; the other five may be null
6. `heroImage` — use a real, royalty-free photo URL (Unsplash) — document the URL per neighbourhood in a comment in the JSON file

---

*Sources: OST v2.2 · Creative Brief v1.0 · Concept Brief Opportunity 1 v1.0 · Onboarding Flow Walkthrough PDF (Prototype v4) · Interview grounding: Reza, Chris*
