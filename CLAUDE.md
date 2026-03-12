# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is a **product discovery repository** for Connect4 — a newcomer housing tool for Vancouver. There is no application code. The repository contains research documents, hypotheses, and product artefacts produced using continuous discovery habits methodology (Opportunity Solution Trees, assumption testing, user interviews).

## Repository Structure

```
docs/          Product artefacts — OST, MVP requirements, concept briefs
hypotheses/    Falsifiable hypotheses under investigation
```

## Document Conventions

**Hypotheses** follow the template in [hypotheses/hypothesis-template.md](hypotheses/hypothesis-template.md):
> "We believe [user segment] experiences [problem] when [context] because [underlying cause]"

They must be specific, falsifiable, and consequential.

**Docs** are keyed to Opportunities from the OST:
- [Opportunity_Solution_Tree.md](docs/Opportunity_Solution_Tree.md) — **master OST v2.0**, synthesised from Miro problem-space review + primary interview data
- [Opportunity_Solution_Tree_Interview_Updated.docx.md](docs/Opportunity_Solution_Tree_Interview_Updated.docx.md) — earlier OST version with interview signal annotations (superseded by v2.0)
- [MVP_Requirements_Opportunity1.docx.md](docs/MVP_Requirements_Opportunity1.docx.md) — feature requirements for Opportunity 1 (The Knowledge Gap), Wizard-of-Oz v1
- [Concept_Brief_Opportunity1.md](docs/Concept_Brief_Opportunity1.md) — concept brief for Solution A (Personalised Neighbourhood Matching), derived from the OST and MVP requirements

## Key Product Context

**North Star:** Newcomers find housing that makes them feel settled, safe, and informed — not just a signed lease.

**Current focus:** Opportunity 1 (The Knowledge Gap). The primary gap is an emotional trust and synthesis gap, not information availability. Interview data (n=2, Reza and Chris) resolved competing hypotheses H-A (info gap) vs H-B (trust gap) in favour of H-B.

**MVP approach:** Wizard-of-Oz — human-curated neighbourhood matches, no AI infrastructure. Three explanation card versions (A: score only, B: + data rationale, C: + community voice) are the core experiment. Test 2 (match explanation trust) is the riskiest assumption.

**Test priority order:** Test 1 (Scam Shield smoke test) → Test 2 (neighbourhood fit / matching) → Test 3 (community review supply).

## Working in This Repo

When adding or editing documents:
- Keep hypothesis files to a single falsifiable statement plus the three criteria (specific, falsifiable, consequential)
- New docs should be linked from this file or from the OST if they relate to a specific opportunity or solution
- Interview data citations should reference participant name and question number (e.g. "Reza Q7, Q8")
- Scope tags in requirements docs use three values only: **MVP Core**, **MVP Conditional**, **Post-MVP**
