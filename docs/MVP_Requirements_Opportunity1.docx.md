**MVP Product Requirements**
Opportunity 1 — The Knowledge Gap
Newcomer Accommodation · Vancouver

AI Neighbourhood Matcher · Wizard-of-Oz v1

## **1\. Context & Problem Statement**

| Core Problem (Opportunity 1: The Knowledge Gap) |
| :---- |
| Newcomers cannot make confident neighbourhood decisions because generic online data doesn't synthesise to personal fit. |
| The gap is not information availability — it is personalised trust. |
| Reza defaulted to his Iranian Telegram community (the only source that felt tailored). |
| Chris chose Dunbar based on map data alone — it didn't match his lifestyle, delaying his ability to settle. |

These requirements define the MVP for the AI Neighbourhood Matcher (Solution A) and its supporting capabilities. The MVP is designed to validate the riskiest assumptions identified in the Assumption Mapping Worksheet and the Opportunity Solution Tree before investing in automated AI infrastructure.

| Product | AI Neighbourhood Matcher (Solution A \+ B \+ D, WoZ v1) |
| :---- | :---- |
| **Opportunity** | Opportunity 1 — The Knowledge Gap |
| **Target user** | Newcomers to Vancouver, arrived \<12 months |
| **Delivery approach** | Wizard-of-Oz — human-curated matches; no AI infrastructure at launch |
| **Version** | v1.0 — MVP scope |

## **2\. Design Principles**

All features must conform to the following principles derived from user research:

* ① Explainability is non-negotiable. AI recommendations must show their reasoning. Both Reza and Chris stated they would not act on a recommendation without it.

* ② Community voice is the trust anchor. Data without lived experience will not be trusted. Resident quotes are a required feature, not a nice-to-have.

* ③ Recency matters. Stale community information is worse than no information. All data and reviews must carry timestamps and staleness warnings.

* ④ Time pressure is real. Solutions must reduce cognitive load, not add to it. No flow should exceed 3 minutes for a newcomer in active search.

## **3\. MVP Scope**

Each feature is tagged with one of three scope designations:

| Scope Tag | Definition |
| :---- | :---- |
| **MVP Core** | Required to run Test 2 (Wizard-of-Oz). Cannot be descoped. |
| **MVP Conditional** | Required if Tests 1–3 pass. Can be deferred if earlier tests fail. |
| **Post-MVP** | Valuable but not required to validate the riskiest assumptions. Build after MVP is validated. |

## **4\. Features, User Stories & Acceptance Criteria**

| F-01  Lifestyle Profiling Quiz |  |
| :---- | :---- |
| A short, mobile-first quiz that builds a structured lifestyle profile for each newcomer. The quiz covers six dimensions: commute mode, daily rhythm, fitness habits, cultural community proximity, safety sensitivity, and social preferences. Output is a persistent profile card the user can view, edit, and share. This is the prerequisite for all matching and feeds Tests 1 and 2. | **MVP Scope** **MVP Core** |

| US-1.1 · As a newcomer arriving in Vancouver within the last 12 months, I want to complete a short lifestyle profiling quiz, so that the tool can understand my daily priorities before showing me neighbourhoods |
| :---- |
| **AC1**  Given I land on the tool, when I start the quiz, then it completes in ≤3 minutes on a mobile device. |
| **AC2**  Given I am answering questions, when I progress, then a visible progress indicator shows how far I am and the current question renders correctly on screen without horizontal scrolling. |
| **AC3**  Given I answer each question, then my profile card updates in real time so I can see my emerging profile as I go. |
| **AC4**  Given I complete the quiz, when I reach the final question, then my completed profile card is immediately displayed — I am not redirected to a blank page or made to wait more than 3 seconds. |
| **AC5**  Given I have completed the quiz, when I view my profile card, then I can edit any answer and see the card update accordingly. |
| **AC6**  Given I abandon the quiz mid-way, when I return within 24 hours on the same device, then my answers are pre-populated so I do not have to start over. |

| US-1.2 · As a newcomer, I want to the quiz to capture my commute mode, daily rhythm, fitness habits, cultural proximity needs, safety sensitivity, and social preferences, so that the neighbourhood match reflects my real lifestyle, not just budget and bedroom count |
| :---- |
| **AC1**  Given I am completing the quiz, then it covers all six lifestyle dimensions: commute mode, daily rhythm (early riser / night owl), fitness habits, cultural community proximity, safety sensitivity, and social preferences. |
| **AC2**  Given each question is displayed, then it is framed conversationally (e.g. 'How do you usually get around?') rather than as a form field label. |
| **AC3**  Given I complete the quiz, then I am never asked for budget or bedroom count — those are handled at the listing stage. |
| **AC4**  Given I view my profile card, then each dimension is represented with a plain-language label (not a numeric code or internal tag). |

| F-02  Neighbourhood Match with Explanation Card |  |
| :---- | :---- |
| The core matching engine (Wizard-of-Oz at MVP). Takes a completed lifestyle profile and returns a ranked shortlist of 3–5 Vancouver neighbourhoods. Each match is accompanied by a plain-language explanation card structured in three layers: (A) recommendation \+ score only, (B) \+ data rationale, (C) \+ community voice excerpt. This is the feature under test in Test 2. | **MVP Scope** **MVP Core** |

| US-2.1 · As a newcomer who has completed the lifestyle quiz, I want to to receive a ranked shortlist of Vancouver neighbourhoods matched to my profile, so that I can focus on a small set of relevant options rather than researching the entire city |
| :---- |
| **AC1**  Given I have completed the quiz, when the results load, then I see a ranked shortlist of 3–5 neighbourhoods within 5 seconds. |
| **AC2**  Given the shortlist is displayed, then each neighbourhood is shown with its name, a match score (expressed as a percentage or 1–5 scale), and a one-line summary. |
| **AC3**  Given I view the shortlist, then neighbourhoods are ordered highest-match-first by default. |
| **AC4**  Given the matching runs, then it uses at minimum: transit score, walkability score, median rent band, gym/fitness facility density within 800 m, and community demographic data for cultural proximity. |
| **AC5**  Given the underlying data source for any neighbourhood attribute is more than 12 months old, then that attribute is flagged with a recency warning. |

| US-2.2 · As a newcomer viewing a matched neighbourhood, I want to to see a plain-language explanation of why this neighbourhood fits my profile, so that I can understand and trust the match rather than having to interpret raw scores |
| :---- |
| **AC1**  Given I select a neighbourhood from the shortlist, then an explanation card loads that maps my specific quiz answers to the neighbourhood's attributes (e.g. 'You said you commute by transit — this neighbourhood has a transit score of 92 and 4 SkyTrain lines within 800 m'). |
| **AC2**  Given the explanation card is displayed, then every factual claim is accompanied by its data source (e.g. Walkscore, CMHC, OpenStreetMap). |
| **AC3**  Given the explanation card loads, then it renders and is readable within 10 seconds on a standard mobile connection. |
| **AC4**  Given a participant in usability testing is shown the card for the first time, then in a 5-second test ≥70% of participants correctly identify the top reason the neighbourhood was recommended. |
| **AC5**  Given the explanation relies on a Wizard-of-Oz (human-curated) process at MVP launch, then the output is indistinguishable in format and quality from an automated AI explanation. |

| US-2.3 · As a newcomer viewing a neighbourhood explanation, I want to to see at least one real resident's voice embedded in the explanation, so that I trust the match is grounded in lived experience, not just statistics |
| :---- |
| **AC1**  Given I view the explanation card, then it includes at least one community voice excerpt from a settled newcomer (arrived \<18 months prior) who shares a relevant lifestyle characteristic with me. |
| **AC2**  Given a community quote is displayed, then it includes the contributor's arrival context (e.g. 'A newcomer from the Philippines who works downtown and doesn't own a car, 8 months in Vancouver') but never their full name. |
| **AC3**  Given I view the community quote, then it is visually distinguished from the data rationale section (different background colour or typographic treatment). |
| **AC4**  Given a usability participant reads the community quote, then in a think-aloud session they can articulate a meaningful difference between the quote and marketing copy. |
| **AC5**  Given no community review exists for a matched neighbourhood, then the explanation card displays a data-rationale-only version and does not display a placeholder or fabricated quote. |

| F-03  Community Review Submission & Moderation |  |
| :---- | :---- |
| A structured review flow for settled newcomers (3–18 months in Vancouver) to contribute lived-experience content that feeds the community voice layer of explanation cards. Includes a lightweight moderation workflow to ensure review quality and authenticity before publication. | **MVP Scope** **MVP Core** |

| US-3.1 · As a settled newcomer (3–18 months in Vancouver), I want to to submit a structured neighbourhood review, so that my lived experience can help future newcomers make better decisions |
| :---- |
| **AC1**  Given I access the review submission flow, then it asks ≤10 structured questions and is completable in ≤15 minutes. |
| **AC2**  Given I am completing a review, then I am asked to tag my lifestyle type (e.g. transit-dependent, car owner, family, student) so the review can be surfaced to relevant newcomers. |
| **AC3**  Given I submit a review, then it is held for moderation before appearing in any newcomer-facing explanation card. |
| **AC4**  Given my review is published, then I am notified (by email or in-app) that it is live. |
| **AC5**  Given the review is published, then it displays a recency timestamp (month and year of submission) so newcomers can assess how current it is. |

| US-3.2 · As a product team member, I want to to moderate submitted community reviews before they are surfaced to newcomers, so that I can ensure reviews are genuine, relevant, and free of harmful content |
| :---- |
| **AC1**  Given a review is submitted, when I access the moderation queue, then I can approve, reject, or request an edit with a single action per review. |
| **AC2**  Given a review is rejected, then the contributor is notified with a plain-language reason. |
| **AC3**  Given a review is approved, then it is tagged with: neighbourhood, arrival timeline band, lifestyle tag(s), and submission date. |
| **AC4**  Given a neighbourhood has fewer than 2 approved reviews, then no community quote is surfaced to newcomers for that neighbourhood — the explanation card falls back to data-rationale only. |

| F-04  Shortlist & Share Actions |  |
| :---- | :---- |
| Lightweight action layer that allows a newcomer who trusts a neighbourhood match to take an immediate next step — either shortlisting a listing in that neighbourhood or sharing the match with a trusted person. This closes the loop between trust and action, which is the primary metric in Test 2. | **MVP Scope** **MVP Conditional** |

| US-4.1 · As a newcomer who has received a neighbourhood match, I want to to shortlist a listing in a matched neighbourhood directly from the explanation card, so that I can act on a match I trust without having to navigate away and lose my context |
| :---- |
| **AC1**  Given I am viewing a neighbourhood explanation card, then there is a clear 'Find listings here' or 'View listings' action visible without scrolling. |
| **AC2**  Given I tap 'Find listings', then I am taken to a filtered listing view (or an external listing platform filtered to that neighbourhood) within 2 taps. |
| **AC3**  Given I shortlist a listing, then it is saved and accessible from my profile without requiring account creation at this stage (cookie-based session persistence is acceptable for MVP). |
| **AC4**  Given I have shortlisted at least one listing, then I can view all shortlisted listings in a single consolidated view. |

| US-4.2 · As a newcomer, I want to to share my profile card or a neighbourhood explanation with someone I trust (family, settlement worker), so that I can get a second opinion from someone who knows me |
| :---- |
| **AC1**  Given I am viewing my profile card or a neighbourhood explanation, then a share action is available. |
| **AC2**  Given I tap share, then I can copy a link or share via a native share sheet. |
| **AC3**  Given a recipient opens the shared link, then they see a read-only version of the profile card or explanation card — they are not required to create an account to view it. |

| F-05  Wizard-of-Oz Research Operations |  |
| :---- | :---- |
| Internal tooling and process requirements to support the manual Wizard-of-Oz protocol during the MVP test phase. This is not user-facing but is required to run the tests reliably and produce comparable data across participants. | **MVP Scope** **MVP Core** |

| US-5.1 · As a product team member running the Wizard-of-Oz MVP, I want to to manually produce neighbourhood recommendation cards from completed quiz responses, so that I can validate demand and trust before investing in AI infrastructure |
| :---- |
| **AC1**  Given a participant completes the quiz, then their profile data is available to the researcher in a structured format (CSV or simple dashboard) within 5 minutes of completion. |
| **AC2**  Given I am producing a WoZ recommendation card, then I can generate Version A (recommendation only), Version B (+ data rationale), and Version C (+ community quote) from the same profile using a templated format. |
| **AC3**  Given I produce a recommendation card, then it is formatted identically to what the eventual AI-automated card will look like — the participant cannot distinguish a WoZ card from an automated one. |
| **AC4**  Given a test session is complete, then participant responses (shortlist intent, confidence rating, qualitative notes) are recorded in a structured log linked to the version shown. |

## **5\. Non-Functional Requirements**

| Area | Requirement |
| :---- | :---- |
| **Performance** | Quiz loads in \<3 s on a 4G mobile connection. Profile card updates in \<1 s after each question answer. |
| **Accessibility** | Quiz and explanation cards meet WCAG 2.1 AA. All UI is operable via keyboard. Colour contrast ratio ≥4.5:1 for all body text. |
| **Mobile-first** | All flows are designed for mobile-first (375 px viewport minimum). No horizontal scrolling on any screen. |
| **Language** | MVP launches in English only. Architecture must support future localisation (string externalisation from day one). |
| **Privacy** | No PII is collected beyond email (optional, for alert feature). Lifestyle profile data is anonymised before being shared with any third party or used in community-facing content. |
| **Data freshness** | All structured data attributes used in matching must be refreshed at minimum every 90 days. Stale attributes display a warning badge. |
| **WoZ throughput** | The Wizard-of-Oz process must support delivering a completed recommendation card to a test participant within 24 hours of quiz submission. |

## **6\. Assumption Test — Feature Dependency Map**

Each assumption test from the OST Deep Dive maps to specific features in this document. Tests must be run in order.

| Test | Assumption | Features Required | Success Signal |
| :---- | :---- | :---- | :---- |
| **Test 1: Quiz Completion** | Newcomers will complete the lifestyle quiz if framed as 'find your neighbourhood'. | F-01 (all stories) | \>65% completion rate. 4/5 users say profile card feels accurate. |
| **Test 2: Match Explanation Trust — RISKIEST** | Newcomers trust and act on AI recommendations only when explanation includes community voice. | F-02, F-03, F-05 | Version C produces ≥2× shortlist intent vs. Version A. Confidence score ≥1.5 pts above A. |
| **Test 3: Community Review Supply** | Settled newcomers will voluntarily submit reviews if the contribution feels low-effort and purposeful. | F-03 | 15/20 settled newcomers complete a review. Trustworthiness score: card with reviews ≥1.5 pts above card without. |

## **7\. Out of Scope for MVP**

The following capabilities are explicitly excluded from this MVP to maintain focus on validating the riskiest assumptions:

* Automated AI matching engine — the MVP uses a Wizard-of-Oz (human-curated) process to validate demand before infrastructure investment.

* Fit-Match Alerts (Solution E) — depends on Solutions A and D being live and validated. Cannot stand alone.

* Day-in-the-Life neighbourhood profiles (Solution C) — highest content production cost; only invest after Tests 1–3 confirm demand.

* User accounts and authenticated sessions — cookie-based session persistence is acceptable for MVP.

* Listing platform integration — the MVP links to external listing platforms; it does not ingest or host listing data.

* Landlord or settlement agency-facing dashboards — these are post-validation commercial features.

* Languages other than English.

## **8\. Kill & Pivot Conditions**

These requirements are contingent on assumption test outcomes. The following signals should trigger a product direction review:

| Kill Signal — Full AI Matcher Concept |
| :---- |
| Test 2 shows no statistically meaningful difference between Version A, B, and C. |
| Users report 'I'd still want to visit in person regardless of explanation'. |
| → Pivot to Solution B-first: human-curated community guide, no AI matching. |

| Partial Signal — Deprioritise Community Layer |
| :---- |
| Test 2 shows Version B outperforms A but Version C does not significantly outperform B. |
| Community voice is not the key trust driver — data transparency is sufficient. |
| → Deprioritise Solution B community review supply chain. Invest in data quality instead. |

| Kill Signal — Quiz Feature |
| :---- |
| Test 1 shows \<40% completion rate OR consistent drop-off at the same question. |
| Signals quiz is too long or wrong framing. |
| → Redesign quiz structure before proceeding to Test 2. |

Source: OST Opportunity 1 Deep Dive · Assumption Mapping Worksheet Test 2 · Interview grounding: Reza (Q7, Q8), Chris (Q7, Q8)
