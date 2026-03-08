# Concept Brief: Personalised Neighbourhood Matching

**Product:** Connect4 · Vancouver Newcomer Housing
**Opportunity Addressed:** Opportunity 1 — The Knowledge Gap
**Status:** Interview-validated (n=2, strongly confirmed) · MVP requirements defined
**Version:** v1.0 — Wizard-of-Oz MVP

---

## The Problem

Newcomers to Vancouver arrive with access to data but not to confidence. The barrier is not information availability — it's the inability to personalise and trust that information for a decision of this magnitude. Both interview participants described having "lots of data" yet still making housing decisions they regretted.

This is an **emotional trust and synthesis gap**, not a data gap.

---

## The Solution

A neighbourhood matching tool that synthesises lived-experience data (safety perception, walkability, transit access, neighbourhood vibe, cultural context) against the user's specific profile — commute mode, daily rhythm, fitness habits, cultural community proximity, safety sensitivity, and social preferences — and returns a **ranked shortlist of 3–5 neighbourhoods with plain-language explanations** of why each fits or doesn't.

**v1 is a Wizard-of-Oz MVP.** Matches are human-curated, not AI-generated. This is deliberate: the goal is to validate demand and trust before investing in automated infrastructure. The output is formatted identically to what an AI system would produce — participants cannot distinguish WoZ cards from automated ones.

---

## How It Works

**Step 1: Lifestyle Profiling Quiz**
A short, mobile-first quiz (≤3 minutes) captures six dimensions: commute mode, daily rhythm, fitness habits, cultural community proximity, safety sensitivity, and social preferences. Budget and bedroom count are explicitly out of scope — those belong at the listing stage. The quiz output is a persistent profile card the user can view, edit, and share.

**Step 2: Neighbourhood Match**
The completed profile is used to produce a ranked shortlist of 3–5 Vancouver neighbourhoods. Each neighbourhood is shown with a match score and one-line summary. Matching draws on transit score, walkability score, median rent band, gym/fitness facility density within 800 m, and community demographic data.

**Step 3: Explanation Card (three versions — this is the core experiment)**

The explanation card is the hypothesis under test. Three versions are shown to different participants:

| Version | Content |
|---|---|
| A | Recommendation + match score only |
| B | A + data rationale (sources cited for every factual claim) |
| C | B + community voice excerpt from a settled newcomer with a matching lifestyle profile |

Version C is the full product vision. The experiment tests whether community voice is the trust driver — or whether data transparency alone is sufficient.

---

## Key Design Principles

- **Explainability is non-negotiable.** Every factual claim in the explanation card is sourced (Walkscore, CMHC, OpenStreetMap). Both interviewees said they would not act on a recommendation without understanding the reasoning.
- **Community voice is the trust anchor.** Resident quotes are a required feature, not a nice-to-have. A community quote must come from a settled newcomer (arrived <18 months prior) who shares a relevant lifestyle characteristic with the reader. No fabricated or placeholder quotes — if fewer than 2 approved reviews exist for a neighbourhood, the card falls back to data-rationale only.
- **Recency matters.** All data attributes must be refreshed every 90 days minimum. Stale attributes display a warning badge.
- **Time pressure is real.** No flow exceeds 3 minutes. The WoZ process delivers a completed recommendation card within 24 hours of quiz submission.

---

## Community Review Supply Chain

Community voice doesn't appear automatically — it requires a parallel supply chain. Settled newcomers (3–18 months in Vancouver) submit structured reviews via a separate flow (≤10 questions, ≤15 minutes). Reviews are held for moderation before appearing in any newcomer-facing card. Each approved review is tagged with neighbourhood, arrival timeline, lifestyle tags, and submission date.

This is a required MVP component, not a post-launch feature. Without it, Version C cannot be tested.

---

## Evidence

| Signal | Source |
|---|---|
| Chris had "lots of data" but chose Dunbar — wrong neighbourhood for his lifestyle | Interview |
| Reza wanted a tool that could fuse "feeling and facts" and confirm "it was right for me" | Interview |
| Both said they would have used this tool | Interview |
| Both open to AI if it explains its reasoning | Interview |
| Reza's trust breakthrough came from Iranian Telegram community voices (people-like-me) | Interview |

---

## How We'll Know It Worked

**Test 1 — Quiz Completion** (prerequisite)
- Success: >65% completion rate; 4/5 users say profile card feels accurate
- Kill signal: <40% completion rate or consistent drop-off at the same question → redesign quiz before proceeding

**Test 2 — Match Explanation Trust (riskiest assumption)**
- Success: Version C produces ≥2× shortlist intent vs. Version A; confidence score ≥1.5 pts above A
- Partial signal: Version B outperforms A but C does not significantly outperform B → community voice is not the key driver; invest in data quality instead of review supply chain
- Kill signal: No meaningful difference between A, B, and C; users say "I'd still want to visit in person regardless" → pivot to human-curated community guide, no AI matching

**Test 3 — Community Review Supply**
- Success: 15/20 settled newcomers complete a review; trustworthiness score for cards with reviews ≥1.5 pts above cards without

---

## Success Condition

**North Star metric:** 30-day housing confidence score — not lease signing alone. A newcomer who signed a lease but feels unsettled is not a success.

**Immediate metric:** Version C shortlist intent rate vs. Version A (Test 2).

---

## Out of Scope for MVP

- Automated AI matching engine
- User accounts (cookie-based session persistence acceptable)
- Listing platform integration (links to external platforms only)
- Fit-Match Alerts
- Day-in-the-Life neighbourhood profiles
- Landlord or settlement agency dashboards
- Languages other than English (architecture must support future localisation from day one)

---

## Open Questions

- How to source and maintain lived-experience / community data at scale post-MVP
- Whether to bundle market intelligence signals (rent trends, vacancy) into the explanation card output rather than building Solution D as a standalone product
- AI trust calibration post-WoZ — what level of explanation is sufficient without being overwhelming

---

*Source: OST Opportunity 1 · MVP Requirements v1.0 · Interview grounding: Reza (Q7, Q8), Chris (Q7, Q8)*
