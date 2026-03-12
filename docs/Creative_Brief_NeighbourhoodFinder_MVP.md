# Creative Brief: Neighbourhood Finder MVP
**Connect4 · Vancouver Newcomer Housing**
Version 1.0 — Internal Demo Build
Date: 2026-03-11

---

## Purpose of This Document

This brief drives the PRD and implementation plan for the Connect4 Neighbourhood Finder MVP. It is an internal demo build — not a public launch. All data is mocked. The goal is a working, credible prototype suitable for stakeholder review and future moderated user testing.

---

## Strategic Context

**OST reference:** Opportunity 1 (The Knowledge Gap) + Opportunity 2 (Exploitation & Trust Collapse)
**Solutions exercised:** Solution A (Neighbourhood Matching) + Solution B (Scam Shield — demand test mechanic)
**Experiments enabled:** Test 2 precursor (match trust) + Test 1 precursor (scam shield demand signal)

The neighbourhood finder is the primary value proposition. The rental listing taster is a deliberate honeypot: it looks like a real Craigslist-style listing, is priced and described to be aspirational but slightly too good to be true, and if the user clicks to enquire, they are immediately shown the Scam Shield modal. The user is never deceived — the warning is instant. The mechanic converts product understanding into product demand without a sales pitch.

---

## Target User

**For this build:** Internal team, stakeholders, investor demos.
**Design for:** Economic-class newcomer to Vancouver. Post-secondary educated, employed or job-seeking, arrived within 12 months. Has disposable income and acute time pressure. Not surviving — choosing.

---

## Full Experience Flow

```
Landing
  └─ Phase 1: Practicalities (Q1–Q5)
  └─ Phase 2: Your Lifestyle (Q6–Q10)
  └─ Phase 3: Where You're From (Q11–Q12)
  └─ Phase 4: Your Favourite Place (Q13–Q14)
       └─ "See my match →"
  └─ Loading / Processing Screen
  └─ Result Screen
       ├─ "Save my results" → Mocked save flow (email capture)
       └─ "See what's available in [neighbourhood]" → Rental Taster
            └─ "Reply to this post" → Scam Shield Modal (email capture)
```

---

## Screen 1 — Landing

**Headline (serif):** Find the neighbourhood *that fits who you are.*
**Body:** Tell us who you are. We'll help you find somewhere that feels like it was waiting for you.
**Sub-body:** Under 10 minutes. No account needed to start.
**Supporting copy (below CTA):** Finding a neighbourhood isn't just about price per square foot. It's about whether the place fits how you actually live. That's what we're trying to figure out together.
**CTA:** Start →
**Privacy note (below CTA):** Your answers are used only to find your match. Nothing is saved unless you save it.

**Design decisions:**
- Single CTA, no secondary actions, no login prompt
- Privacy note sits below the button — earns trust through behaviour, not upfront disclaimers
- Serif headline (Palatino Linotype) signals warmth and permanence; italic on second line adds emotional register without changing typeface

---

## Screens 2–12 — Onboarding Quiz

The quiz is fully specified in `Connect4 — Onboarding Flow Walkthrough.pdf` (Prototype v4, 14 questions, 4 phases). That document is the authoritative design spec for screens 2–12. Implement faithfully.

**Universal UX rules across all quiz screens:**
- 14-pip progress bar, grouped into 4 phase clusters with small gaps
- "Why we ask" collapsible toggle on every question — explains specifically what the answer changes, not generic reassurance
- "None of these feel right" escape hatch on every MC question → reveals inline free-text field
- Continue button disabled (muted) until a selection is made
- No Vancouver neighbourhood names appear anywhere before the result screen

**Phase summary:**

| Phase | Questions | Type |
|---|---|---|
| 1 — Practicalities | Q1 Why coming · Q2 Timeline · Q3 Household · Q4 Budget · Q5 Transport | Structured MC / multi-select |
| 2 — Your Lifestyle | Q6 Free day · Q7 Neighbourhood energy · Q8 Outdoors · Q9 Cultural community · Q10 Comfort & safety | Personality / identity MC |
| 3 — Where you're from | Q11 Current location (city + neighbourhood) · Q12 Describe to a friend | Structured + open text |
| 4 — Your favourite place | Q13 Favourite location (optional) · Q14 What makes it yours | Open text |

**Addition to the spec — Bedrooms field:**
Add a bedrooms question to Phase 1 (after Q3 Household, before Q4 Budget). This field is required to gate the rental listing taster.

> **Q3b — How many bedrooms do you need?**
> 1 bedroom · 2 bedrooms · 3 or more bedrooms
> *(No "None of these feel right" escape hatch — single-select, required)*

This can be combined on the same screen as Q3 (Household) as the two questions are thematically adjacent and neither requires significant reflection.

---

## Screen 13 — Loading / Processing

**Headline:** Finding your match...
**Sub-copy:** This usually takes about 20 seconds.

**Animated processing chips (staggered fade-in, 0 / 0.5 / 1.0 / 1.5s):**
1. Reading your neighbourhood descriptions
2. Matching against personality profiles
3. Checking budget against real rental data
4. Building your results

No cancel button. No back navigation. One-way passage to results.

In the internal demo, the "processing" delay is a simulated 3–4 second pause. No actual AI call is made. The matching logic is a deterministic weighted scoring function over mocked neighbourhood data (see Data Model).

---

## Screen 14 — Result Screen

**Purpose:** Deliver the match. Make it feel earned and credible. Surface the rental taster.

**Layout (top to bottom):**

1. **Label:** YOUR MATCH
2. **Neighbourhood name** (large, serif) + tagline (italic, rust)
3. **Analogous comparison block** (rust border):
   > "Think of it as a version of [their neighbourhood] — but with [X] and [Y]."
   Populated from Q11–Q14. For the internal demo, hardcode a plausible comparison per neighbourhood (e.g. for Mount Pleasant: "Think of it as a version of Shoreditch — but calmer, greener, and still early enough that you'd be ahead of the wave.")
4. **Personality description block:**
   > "What this neighbourhood is actually like"
   2–3 sentences of plain-language neighbourhood character. Hardcoded per neighbourhood for the demo.
5. **Community voice block** (Version C default for demo):
   A single quote from a settled newcomer with lifestyle-matched context tag.
   > *"The bike lanes on Ontario Street changed my mornings completely." — Software engineer, arrived Aug 2024, no car*
   If no quote is available for a neighbourhood, this block is omitted silently (no placeholder).
6. **Worth Knowing block:**
   > "This is a match, not a certainty. No algorithm replaces walking the streets on a Tuesday morning. Shortlist two or three and visit each before you commit."
7. **Actions:**
   - [Save my results] — primary button → triggers mocked save flow
   - [Start again] — secondary, text link
8. **Rental taster entry point** (bottom of screen, below the fold):
   Label: COMING NEXT
   > "See what's available in [Neighbourhood Name] right now →"
   This is a secondary CTA that leads to the Rental Taster screen.

**Card version flag (dev-only):**
A URL param or env variable controls which card version is active: `?version=A`, `?version=B`, `?version=C`. Default for internal demo: Version C. This is not a user-facing control.

---

## Screen 15 — Rental Taster (Honeypot)

**Purpose:** Present a single aspirational rental listing in Craigslist style. It is deliberately priced 8–12% below the neighbourhood median and described as renovated/new/immediately available — the three most common phantom listing signals. If the user clicks to enquire, the Scam Shield modal fires instantly.

**Design direction:** The listing should look like a Craigslist post. Plain, functional aesthetic — system font body text, minimal chrome, sparse layout. No Connect4 branding on the listing itself. It reads as a real third-party post. This is intentional: it creates the cognitive experience of encountering a real scam-risk listing.

**Listing anatomy:**

```
[Neighbourhood Name] · [Bedrooms] · $[Price]/month

[HEADLINE — e.g. "Bright 1-bed steps from Kits Beach. New appliances, in-suite laundry."]

Posted 2 hours ago

[2–3 photos — realistic, attractive but not luxury. Natural light, clean finishes.]

[Body copy — 4–6 sentences. Example:]
Beautifully updated 1-bedroom in a quiet building, steps from the beach path and
Kits Pool. New stainless appliances, in-suite laundry, private storage locker.
Hardwood throughout. Utilities included. Landlord is responsive and easy to deal
with. Available April 1 — or sooner for the right person.

[CTA button:] Reply to this post / Express interest
```

**Listing content is neighbourhood- and bedroom-dependent.** Each of the 8 curated neighbourhoods has one pre-written listing per bedroom count. Price is set at 8–12% below current neighbourhood median for that bedroom count.

**Calibrated scam signals (embedded deliberately):**
- Price below median
- Described as renovated or new
- Available immediately or sooner for the right person
- Utilities included
- Landlord described as "responsive" or "easy to deal with"

These are real phantom listing signals. The user encounters them exactly as they would in the real market. The Scam Shield warning then names them specifically — which is what makes the reveal land.

**Back navigation:** A small "← Back to your match" text link at the top. The listing is not a dead end.

---

## Screen 16 — Scam Shield Modal (email capture)

**Trigger:** User clicks "Reply to this post / Express interest" on the rental taster.

**Behaviour:** Full-screen modal overlay. Appears instantly on click, before any "enquiry" form. The user is never asked to enter deposit information.

**Header:** Wait — this listing has 3 red flags.

**Body:**
> Listings priced below market, described as renovated, and available immediately are the most common pattern used in phantom rental scams targeting newcomers in Vancouver.
>
> The typical next step: the "landlord" asks for a deposit by e-transfer before you've seen the property. Once sent, it's gone.
>
> We flagged this listing deliberately. On Craigslist and Kijiji, real listings and fake ones look identical. Without a way to check, the difference is impossible to spot.

**Named red flags (inline, beneath body):**
- Price 10% below neighbourhood median
- "Available immediately — or sooner for the right person"
- Utilities included (uncommon at this price point)

**Scam Shield pitch:**
> Scam Shield is our listing verification tool. Paste a URL — we'll flag phantom listings, suspicious landlord patterns, and illegal deposit requests before you commit.
>
> We're building it now. Leave your email for early access.

**Form:** Single email input + "Get early access" button

**Secondary action:** "No thanks, go back" — closes modal, returns user to the listing. No shaming copy on the dismiss.

**Tone:** Protective, not preachy. The user should feel looked after. The product just saved them from a mistake — it doesn't need to lecture them about it.

---

## Mocked Save Flow

**Trigger:** User clicks "Save my results" on the result screen.

**What it is:** A bottom sheet (not a full-page interrupt) with a single email field and a "Save my results" button. On submit, it shows a confirmation state and closes.

**Confirmation copy:**
> Your profile and neighbourhood match have been saved. We'll send you a link to return to your results.

No email is actually sent. No data is persisted beyond the session. This mocks the future authenticated experience. The demo should feel like saving works — the confirmation state is the end of the interaction.

**Data described as saved (in the confirmation):**
- Your quiz responses
- Your neighbourhood match
- Your selected neighbourhood (if you clicked through to the listing)

---

## Curated Neighbourhood Shortlist

8 Vancouver neighbourhoods. Each has mocked attribute scores, a hardcoded analogous comparison, a personality description, 1 community voice quote, and pre-written listings (1BR / 2BR / 3BR+).

| Neighbourhood | Character | Key matching signals |
|---|---|---|
| Kitsilano | Beach, active, café culture | Outdoors essential, cycling/walking, lively-moderate |
| Mount Pleasant | Creative, tech, young professional | Scene-oriented, cycling, lively-high |
| Commercial Drive | Eclectic, community-oriented | Cultural community, transit/walking, diverse |
| Yaletown | Urban, polished, professional | High walkability, transit, fitness-dense |
| Strathcona | Emerging, independent, character | "Somewhere with edges", cycling, arts |
| West End | Dense, walkable, Seawall access | Walking, LGBTQ+ inclusion signal, outdoors-adjacent |
| Riley Park / Little Mountain | Quiet, residential, family | Household with children, parks, quieter energy |
| East Vancouver | Diverse, affordable, local | Cultural community, transit, budget-conscious |

---

## Data Model (mocked static JSON)

All data is static JSON imported at build time. No database. No API calls.

**`neighbourhood.json`** — array of neighbourhood objects:
```
{
  id, name, district, tagline, heroImage,
  analogousComparisons: { [cityNeighbourhood]: "Think of it as..." },
  personalityDescription,
  communityQuote: { text, attribution },
  attributes: {
    walkability, transitScore, cyclingScore,
    outdoorsAccess, culturalDiversity, safetyPerception,
    socialEnergy, fitnessAccess, quietness
  },
  medianRent: { oneBed, twoBed, threeBed },
  vacancyRate,
  listings: { oneBed: ListingObject, twoBed: ListingObject, threeBed: ListingObject }
}
```

**`listing.json`** (embedded in neighbourhood object):
```
{
  headline, price, bedroomCount, bodyText,
  photos: [url, url, url],
  postedAt: "2 hours ago",
  scamFlags: ["belowMedian", "immediateAvailability", "utilitiesIncluded"]
}
```

**Session state (React context, not persisted):**
```
{
  // Phase 1
  reasonForMoving, timeline, household, bedrooms, budget, transport,
  // Phase 2
  freeDay, neighbourhoodEnergy, outdoorsAccess, culturalCommunity, comfortPriority,
  // Phase 3
  currentCity, currentNeighbourhood, currentDescription,
  // Phase 4
  favouriteCity, favouriteNeighbourhood, favouriteDescription,
  // Output
  matchedNeighbourhoodId, cardVersion
}
```

**Matching logic:** Deterministic weighted scoring function. Each quiz answer maps to attribute weight adjustments. The function scores all 8 neighbourhoods and returns the top match. No ML. No external calls. Auditable and fast.

---

## Design Language

Derived from the onboarding flow walkthrough. Apply consistently across all screens.

**Typography:**
- Headlines: Palatino Linotype (system serif) — no web font penalty
- Body / UI: System sans-serif stack (e.g. `-apple-system, BlinkMacSystemFont, "Segoe UI"`)
- Italic on headline secondary lines: emotional register marker, not a different typeface

**Colour:**
- Primary action / rust: `#C87800` (terracotta/rust — used for CTAs, phase labels, rust-bordered blocks)
- Background: warm off-white (`#F5F2ED` approximate)
- Text: near-black (`#1A1A1A`)
- Disabled state: muted grey (`#A0A0A0`)
- Phase label chips: rust background, white text

**Component patterns:**
- Cards: rounded corners, subtle shadow, white on off-white background
- Selected option: dark fill (near-black) with white text
- Unselected option: white fill, dark border, dark text
- "Why we ask" toggle: small terracotta text link, expands inline
- "None of these feel right": dashed border, lighter text weight
- Pip progress bar: 14 pips in 4 phase clusters, active pips fill in phase colour

**Tone of voice:** Helpful, direct, warm. Speaks to an intelligent adult. No marketing superlatives. The "Worth knowing" caveat pattern (honest about limitations) should inform all copy. First-person question framing where possible.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (TypeScript) |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Data | Static JSON — no database |
| State | React context (session only, no persistence) |
| Auth | None — email capture fields are UI-only, no backend |
| i18n | English only for demo — architecture must support future localisation (i18n-ready string keys from day one) |

---

## Out of Scope for This Build

- Real authentication or persistent user accounts
- Live listing data or any external API integration (Craigslist, Zumper, etc.)
- Actual email delivery or data storage
- AI or ML matching engine (matching is deterministic weighted scoring)
- Card version A/B/C as a user-facing control (dev flag only)
- Mobile app or PWA
- Languages other than English
- Multiple match results / shortlist view (single top match only for demo)
- Community review submission flow
- Landlord or agency views

---

## What Success Looks Like for the Internal Demo

A stakeholder or tester should be able to:
1. Complete the 14-question quiz and feel it was worth their time
2. Receive a neighbourhood match that feels credible and personal — not generic
3. Read the analogous comparison and have a "yes, that's me" moment
4. See a rental listing that feels real and attractive
5. Click through and have the Scam Shield moment land — *"oh, that's exactly how it happens"*
6. Leave their email for Scam Shield early access without feeling coerced

The demo is not proving the algorithm. It is proving the product idea is believable, the matching experience earns trust, and the Scam Shield mechanic creates genuine demand.

---

*Sources: OST v2.2 · Concept Brief Opportunity 1 v1.0 · MVP Requirements Opportunity 1 · Onboarding Flow Walkthrough PDF (Prototype v4) · Interview grounding: Reza, Chris*
