# Concept Brief: Semantic Matching — Solution A, Variant 2

**Product:** Connect4 · Vancouver Newcomer Housing
**Opportunity Addressed:** Opportunity 1 — The Knowledge Gap
**Status:** Post-MVP candidate — not in scope for Wizard-of-Oz v1
**Version:** v1.0 — Algorithm design document

---

## The Problem with Variant 1 (Weighted Scoring)

The current prototype (Variant 1) matches users to neighbourhoods by adjusting attribute weights — safety, walkability, transit, cultural fit — against hand-crafted 1–10 scores for each neighbourhood. This approach has four structural limits:

- **Attribute scores are hand-crafted estimates, not real data.** Every neighbourhood score is a human judgement call, not a measurement. They don't update automatically and they embed the scorer's assumptions about what matters.
- **Open-ended quiz answers have no place in a weighted model.** If a user types "I want to feel like I did in my neighbourhood back home," there is no weight to adjust. The algorithm can only work with predefined, structured inputs.
- **Qualitative neighbourhood character can't be reduced to 1–10 scores.** The difference between Commercial Drive and Yaletown isn't a number — it's a personality. Weighted scoring flattens signal that matters most to the trust condition.
- **Weights are manually tuned and don't learn from outcomes.** If Test 2 reveals that community vibe matters more than walkability for settled confidence, Variant 1 must be re-tuned by hand. It has no path to self-improvement.

---

## How Semantic Matching Works

Semantic matching replaces numeric weights with meaning. Instead of adjusting scores, the system compares what a neighbourhood *feels like* to what a user *is looking for* — in natural language.

**Step 1: Embed neighbourhood descriptions**
Neighbourhood personality text, community quotes, taglines, and contextual descriptions are converted into vector embeddings — one vector per neighbourhood — and stored in a vector database. Each vector encodes the semantic character of that neighbourhood, not just its attributes.

**Step 2: Convert quiz input into a query vector**
Quiz selections and any open-ended text responses are combined into a structured prompt or query vector. A response like "I want to feel like I did in my neighbourhood back home — tight community, open-air markets, neighbours who say hello" becomes a meaningful input rather than a field the algorithm discards.

**Step 3: Retrieve top-N neighbourhood contexts**
The query vector is matched against neighbourhood vectors. The closest matches — by semantic similarity, not numeric distance — are retrieved as candidate recommendations. For Connect4's current scope of N=8 neighbourhoods, this step may be skipped entirely: all neighbourhood descriptions can fit comfortably in a single LLM context window.

**Step 4: LLM generates ranked recommendations with plain-language rationale**
The query and retrieved neighbourhood contexts are sent to an LLM. The LLM returns a ranked shortlist of 3–5 neighbourhoods, each with a specific, grounded explanation of why it fits — drawn from the neighbourhood description text, not fabricated.

---

## What It Handles Better Than Variant 1

| Capability | Variant 1: Weighted Scoring | Variant 2: Semantic |
|---|---|---|
| Open-ended answers | No | Yes |
| Qualitative vibe matching | No | Yes |
| Learns from outcomes | No | Possible (with fine-tuning) |
| New quiz dimensions | Requires re-tuning | Natural extension |

**Open-ended answers** are the clearest gap. A user who says "I want to feel settled, not like a tourist" is communicating something real and actionable — Variant 1 cannot process it, Variant 2 can.

**Qualitative vibe** is the second gap. Commercial Drive's character as a place with layered immigrant history and a street-first personality is exactly the kind of signal that produces trust — and exactly the kind of signal that collapses when you try to score it.

**No manual weight tuning** means the algorithm's quality is a function of the neighbourhood descriptions, not the scorer's calibration assumptions. Better text in, better matches out.

---

## The Explainability Challenge — and How to Solve It

Explainability is non-negotiable. Both interview participants (Reza Q7, Q8; Chris Q7, Q8) stated they would not act on a recommendation without understanding the reasoning. An opaque ranking is not a product — it is a liability.

The risk in semantic matching is that LLM explanations become generic ("Commercial Drive is a great fit because you value community") or confabulated (the LLM asserts facts not present in the source text). This is a real risk that must be addressed by design, not patched later.

**The solution: structured rationale output**
Instruct the LLM to return a defined output schema alongside rankings. Example:

> "Commercial Drive was ranked first because your preference for cultural diversity and walkability aligns with its description as a place with layered immigrant history and a street-first character. Your open-ended response about wanting neighbours who say hello maps to its profile as a neighbourhood where long-term residents are described as actively social."

The LLM cites the source text. It does not invent attributes. Every claim traces back to the neighbourhood description that was passed in as context.

**Prompt engineering and usability testing are required.** The explanation schema must be designed, tested against real quiz responses, and evaluated by users before deployment. This is not a launch-day task.

---

## When to Consider Switching

Variant 2 is not an MVP candidate. The switching triggers are:

- **After Test 1 and Test 2 validate demand.** Don't build infrastructure for a product that hasn't proven willingness to use.
- **When open-ended quiz questions are added.** This is the natural trigger: the moment the quiz includes a free-text field, Variant 1 hits a hard limit that Variant 2 resolves immediately.
- **If Variant 1 shows poor discrimination.** If multiple neighbourhoods cluster at similar weighted scores and users can't distinguish between recommendations, the algorithm is failing its purpose. Semantic matching is less sensitive to score clustering because it operates on meaning rather than numeric proximity.

---

## Technical Components Required

| Component | Purpose | Note |
|---|---|---|
| Neighbourhood description text | The raw semantic signal for each neighbourhood | Must be written and maintained — quality of text determines quality of match |
| Vector embeddings | Convert text to semantic vectors (e.g. OpenAI `text-embedding-3-small`) | One embedding per neighbourhood |
| Vector store | Store and query neighbourhood vectors (e.g. Pinecone, pgvector, Supabase) | For N=8 neighbourhoods, a vector DB is unnecessary — all contexts fit in one LLM call |
| LLM with structured output | Generate ranked recommendations + rationale (e.g. Claude Sonnet, GPT-4o) | Must return a defined schema; rationale must cite source text |
| Prompt template | Translate quiz output into a structured LLM prompt | Requires design and iteration |

**Infrastructure note:** At N=8 neighbourhoods, this system is simpler than it looks. There is no need for a vector database. All neighbourhood descriptions are passed directly into the LLM prompt alongside the quiz output, and the LLM performs both retrieval and ranking in a single call. The architecture scales to a vector DB if the neighbourhood set grows beyond ~20–30.

---

## Variant Comparison

| Dimension | Variant 1: Weighted Scoring | Variant 2: Semantic |
|---|---|---|
| Open-ended answers | No | Yes |
| Qualitative vibe | No | Yes |
| Explainability | Built-in (attribute mapping) | Requires prompt engineering |
| Deterministic | Yes (good for A/B testing) | No (varies by LLM) |
| Data required | Hand-crafted attribute scores | Neighbourhood description text |
| Infrastructure | None (pure JS) | LLM API + optional vector DB |
| Manual tuning | Required (weight adjustment) | Not required |
| MVP suitability | High | Low (use post-MVP) |

Variant 1 is the right choice for the Wizard-of-Oz MVP because it requires no external API calls, produces deterministic output suited to A/B testing, and can be fully controlled by a human curator. Variant 2 becomes the right choice when open-ended input handling, vibe matching, or algorithm learning become requirements.

---

*Source: OST Opportunity 1 · Concept Brief Opportunity 1 v1.0 · Interview grounding: Reza (Q7, Q8), Chris (Q7, Q8)*
