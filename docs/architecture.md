# Connect4 — System Architecture Plan

**Product:** Connect4 · Vancouver Newcomer Housing
**Status:** Pre-build · Wizard-of-Oz MVP
**Version:** v1.0
**Related:** ADR-001 · MVP Requirements Opportunity 1 · Concept Brief Opportunity 1

---

## 1. System Overview

Connect4 is a neighbourhood matching tool for newcomers to Vancouver. At MVP it operates as a Wizard-of-Oz system: the user-facing product is indistinguishable from an AI-powered tool, but matches are produced by a human researcher using a templated process.

The system has two distinct planes:

| Plane | Purpose |
|---|---|
| **Newcomer plane** | Quiz, profile card, neighbourhood shortlist, explanation cards, review submission, shortlist/share |
| **Operations plane** | Researcher card production, review moderation queue, test session logging |

These planes share a data layer but have no user-facing overlap.

---

## 2. User Roles

| Role | Description |
|---|---|
| **Newcomer** | Arrived in Vancouver <12 months. Completes quiz, receives matches, takes action. No account required. |
| **Settled newcomer** | Arrived 3–18 months ago. Submits community reviews via a separate flow. No account required. |
| **Researcher** | Internal team member. Receives quiz completions, produces WoZ recommendation cards using templates. |
| **Moderator** | Internal team member. Reviews and approves/rejects community review submissions before publication. May be the same person as Researcher at MVP scale. |

---

## 3. Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      NEWCOMER PLANE                         │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Quiz Flow   │──▶│ Profile Card │──▶│  Shortlist &   │  │
│  │  (F-01)      │   │  (session)   │   │  Explanation   │  │
│  └──────────────┘   └──────────────┘   │  Cards (F-02)  │  │
│                                        └────────┬───────┘  │
│  ┌──────────────┐                               │          │
│  │ Review Sub-  │                      ┌────────▼───────┐  │
│  │ mission Flow │                      │ Shortlist &    │  │
│  │ (F-03)       │                      │ Share (F-04)   │  │
│  └──────┬───────┘                      └────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────┼───────────────────────────────────────────────────┐
│         │            DATA LAYER                             │
│  ┌──────▼──────────────────────────────────────────────┐   │
│  │  Profile Store │ Neighbourhood Data │ Review Store   │   │
│  │  (anonymous)   │ (refreshed 90d)    │ (staged/pub.)  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
┌─────────┼───────────────────────────────────────────────────┐
│         │            OPERATIONS PLANE                       │
│  ┌──────▼───────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Quiz Result │   │  WoZ Card    │   │  Moderation    │  │
│  │  Feed (F-05) │──▶│  Production  │   │  Queue (F-03)  │  │
│  └──────────────┘   │  (F-05)      │   └────────────────┘  │
│                     └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Components in Detail

### 4.1 Quiz Flow (F-01)

- Mobile-first, single-page flow. Six dimensions: commute mode, daily rhythm, fitness habits, cultural community proximity, safety sensitivity, social preferences.
- Progress indicator visible at all times.
- Answers written to session store after each question (enables resume within 24 hours on the same device).
- Profile card rendered and updated in real time alongside quiz. On completion, card is the primary screen — no redirect.
- No budget or bedroom count fields.
- No account creation. Session persistence via cookie (first-party, no third-party tracking).

### 4.2 Profile Card

- Persistent output of the quiz. Displays all six dimensions in plain language.
- Editable: changes to any dimension update the card immediately and re-trigger matching.
- Shareable: generates a read-only link. Recipient can view card without an account.
- Stored in session store; associated with a session ID, not a user account.

### 4.3 Neighbourhood Shortlist & Explanation Cards (F-02)

- Input: completed profile from session store.
- Output: ranked list of 3–5 Vancouver neighbourhoods, each with a match score and one-line summary.
- At MVP, shortlist is populated by the researcher within 24 hours of quiz submission (WoZ process — see 4.6).
- Each neighbourhood links to an explanation card in one of three versions:

| Version | Content |
|---|---|
| A | Recommendation + match score only |
| B | A + data rationale (every factual claim cites its source) |
| C | B + community voice excerpt from a settled newcomer with a matching lifestyle tag |

- Cards are templated. The template is the spec for the eventual automated AI card — format must be identical.
- If no approved review exists for a neighbourhood, the card falls back to Version B regardless of assigned version.
- Data attributes older than 12 months display a staleness warning badge.

### 4.4 Community Review Submission & Moderation (F-03)

- Separate flow for settled newcomers (3–18 months). ≤10 structured questions, completable in ≤15 minutes.
- Reviewer provides: neighbourhood, arrival timeline, lifestyle tags, free-text responses.
- Submitted reviews enter a moderation staging area — not visible to newcomers until approved.
- Moderator actions: approve, reject (with plain-language reason sent to contributor), or request edit.
- On approval, review is tagged with: neighbourhood, arrival timeline band, lifestyle tags, submission date.
- Published reviews carry a recency timestamp (month and year only — no day-level precision).
- If approved review count for a neighbourhood falls below 2, community voice is suppressed from explanation cards for that neighbourhood.

### 4.5 Shortlist & Share Actions (F-04)

- "Find listings" action on each explanation card links to an external listing platform filtered to that neighbourhood. No listing data is ingested or hosted.
- Shortlisted listings are saved to the session store (cookie-based). No account required.
- A consolidated shortlist view is accessible from the profile card.
- Share action on profile card or explanation card generates a read-only link via native share sheet or clipboard copy.

### 4.6 WoZ Research Operations (F-05)

- When a newcomer completes the quiz, their profile is surfaced to the researcher in a structured format (CSV export or lightweight admin view) within 5 minutes.
- Researcher uses a fixed card template to produce Versions A, B, and C for the assigned test participant.
- Cards are loaded into the system so the participant receives the same URL-based experience as they would with an automated system.
- After each test session, the researcher logs: participant session ID, card version shown, shortlist intent response, confidence rating, qualitative notes. Log is structured and linked to the assigned version.
- Throughput constraint: the WoZ process must support delivering a completed card within 24 hours of quiz submission. Concurrent test participant capacity is limited by researcher bandwidth — not a platform constraint.

---

## 5. Data Architecture

### 5.1 Data Entities

| Entity | Fields | Notes |
|---|---|---|
| **Session** | Session ID, created at, last active, quiz answers, profile card state, shortlisted listings | Cookie-bound. No PII unless email optionally provided. |
| **Neighbourhood** | Name, transit score, walkability score, median rent band, fitness facility density (800m), demographic data, staleness timestamp | Sourced from Walkscore, CMHC, OpenStreetMap. Refreshed every 90 days minimum. |
| **Explanation Card** | Session ID, neighbourhood ID, version (A/B/C), content, community quote ID (nullable), created at | WoZ cards: created by researcher. Future: generated by AI pipeline. |
| **Community Review** | Review ID, neighbourhood ID, lifestyle tags, arrival timeline band, content, submission date, moderation status, moderator notes | Staged on submission; published on approval. |
| **Test Session Log** | Session ID, card version, shortlist intent (boolean/scale), confidence rating, qualitative notes, timestamp | Internal research record. Not user-facing. |

### 5.2 PII Handling

- No PII is required to use the product.
- Email is optional (for future Fit-Match Alerts feature — Post-MVP). If collected, stored separately from profile data and not shared with third parties.
- Lifestyle profile data is anonymised before use in community-facing content.
- Session IDs are not linked to identifiable information.

### 5.3 Data Freshness

- Neighbourhood data attributes carry a `last_refreshed` timestamp.
- Any attribute older than 90 days triggers a staleness warning badge in the UI.
- Community reviews carry a submission month/year. No additional freshness threshold at MVP — review age is visible to the newcomer and they can judge recency themselves.

---

## 6. External Integrations

| Integration | Purpose | Refresh cadence |
|---|---|---|
| **Walkscore API** | Transit score, walkability score per neighbourhood | Every 90 days |
| **CMHC data** | Median rent band per neighbourhood | Every 90 days |
| **OpenStreetMap** | Fitness facility density within 800m, spatial context | Every 90 days |
| **External listing platforms** | "Find listings" action deep-links to a filtered view | No ingestion — link only |

All external data is cached internally. The application does not make live API calls during a newcomer session — stale data is surfaced with a warning badge rather than fetched on demand.

---

## 7. Technical Constraints

Derived directly from the MVP non-functional requirements:

| Constraint | Requirement |
|---|---|
| **Performance** | Quiz loads <3s on 4G. Profile card updates <1s per question answer. Explanation card renders and is readable within 10s on a standard mobile connection. |
| **Viewport** | Mobile-first. Minimum supported viewport: 375px. No horizontal scrolling on any screen. |
| **Accessibility** | WCAG 2.1 AA throughout. All UI operable via keyboard. Colour contrast ≥4.5:1 for body text. |
| **Localisation** | MVP launches in English only. All user-facing strings must be externalised from day one (no hardcoded copy). Architecture must support adding languages without structural changes. |
| **Session persistence** | Cookie-based. Quiz answers persist for 24 hours on the same device without account creation. |
| **No user accounts** | Account creation is out of scope for MVP. All state is session-scoped. |
| **WoZ throughput** | Researcher must be able to deliver a completed card to a test participant within 24 hours of quiz submission. |

---

## 8. Localisation Strategy

String externalisation is a day-one architectural requirement — not a post-MVP retrofit. This means:

- All user-facing copy (labels, questions, explanations, error messages) is stored in resource files, not hardcoded in templates or components.
- Language selection is a configuration parameter, not a code branch.
- Community review content carries a `language` tag to support future language-filtered display.
- No localisation infrastructure (translation management, locale routing) is required at MVP — the resource file structure just needs to be in place.

---

## 9. Future State: AI Transition (Post-WoZ)

When Tests 1–3 produce a go signal, the WoZ operational layer is replaced by an automated AI pipeline. The architectural transition is designed to be incremental:

| Component | WoZ state | Post-WoZ state |
|---|---|---|
| Quiz & profile card | No change | No change |
| Shortlist generation | Researcher produces manually | AI pipeline generates from profile + neighbourhood data |
| Explanation card production | Researcher fills template | AI generates card content; template structure unchanged |
| Community voice selection | Researcher selects quote | System matches review to newcomer profile by lifestyle tag |
| WoZ researcher interface | Required | Retired (replaced by monitoring/QA tooling) |
| Test session logging | Manual researcher log | Automated event logging |

The explanation card template is the contractual interface between the WoZ phase and the AI phase. Any change to the template must be treated as a breaking change and versioned accordingly.

See ADR-002 (not yet written) for the AI pipeline architecture decision.

---

## 10. Open Architectural Questions

| Question | Context |
|---|---|
| How are WoZ cards delivered to participants? | The researcher produces the card, but the mechanism for loading it into the participant's session needs to be specified. Options: researcher-facing admin UI that writes directly to the data layer; email link with a pre-populated session state; or a shareable card URL the researcher sends manually. |
| How is test version assignment (A/B/C) managed? | Random assignment, sequential rotation, or researcher-selected per session? Needs to be consistent and logged to produce comparable test data. |
| What is the community review submission entry point? | Settled newcomers need to discover the review flow. Not part of the newcomer quiz flow. Options: separate URL, settlement agency referral, post-arrival email if optional email was provided. |
| Should market intelligence signals (rent trends, vacancy) be bundled into the explanation card? | OST recommends against building Solution D (Market Intelligence) standalone. If bundled into the explanation card, this needs to be reflected in the card template and neighbourhood data schema. Decision gates on Test 2 results. |
| Moderation tooling at MVP | Is a custom moderation queue UI required, or is a spreadsheet/Airtable workflow sufficient for the MVP test volume? |
