# ADR-001: Wizard-of-Oz MVP Over AI Infrastructure

**Status:** Accepted
**Date:** 2026-03-07
**Deciders:** Connect4 product team
**Related:** MVP Requirements Opportunity 1 · Concept Brief Opportunity 1

---

## Context

Connect4 is building a neighbourhood matching tool for newcomers to Vancouver. The core product function — synthesising a user's lifestyle profile against neighbourhood data to produce a ranked shortlist with plain-language explanations — could be implemented as an automated AI pipeline from day one.

Two competing approaches were evaluated:

- **Option A (AI-first):** Build an LLM-backed matching and explanation engine at launch. High infrastructure investment before demand is validated.
- **Option B (Wizard-of-Oz):** Deliver human-curated matches formatted identically to AI output. No AI infrastructure. Validate demand and trust before building automation.

The riskiest unvalidated assumptions at this stage are:
1. Newcomers will complete a lifestyle profiling quiz (Test 1).
2. Newcomers trust and act on AI neighbourhood recommendations when the explanation includes community voice (Test 2).
3. Settled newcomers will voluntarily contribute reviews (Test 3).

None of these assumptions require an AI backend to test.

---

## Decision

**We will launch with a Wizard-of-Oz MVP.** Neighbourhood matches are produced by a human researcher using a templated process. Output is formatted identically to what an automated system would produce — participants cannot distinguish a WoZ card from an AI-generated one.

AI infrastructure will not be built until Tests 1–3 produce a clear go signal.

---

## Consequences

**Positive**
- Eliminates infrastructure investment risk before demand is confirmed.
- Forces output format and explanation structure to be fully specified upfront — the template becomes the spec for the eventual AI system.
- Enables rapid iteration on explanation card versions (A/B/C) without model retraining cycles.
- Test results are directly comparable across participants because all cards are produced from the same templated process.

**Negative**
- WoZ throughput is capped: the process must deliver a completed recommendation card within 24 hours of quiz submission. This limits concurrent test participants.
- Human curation introduces researcher subjectivity. Mitigated by using structured data sources (Walkscore, CMHC, OpenStreetMap) and a fixed card template with no free-text fields.
- The system cannot scale beyond the test cohort without AI infrastructure being built.

**Constraints this imposes on the build**
- The quiz output must be available to the researcher in a structured format (CSV or simple dashboard) within 5 minutes of completion.
- Explanation card templates for Versions A, B, and C must be finalised before any test session begins.
- The WoZ delivery process must be documented well enough that a second team member can run it independently.

---

## Superseded by

This decision is superseded when Tests 1–3 produce a go signal and the automated AI matching engine is scoped and built. At that point, raise ADR-002 covering the AI pipeline architecture.
