# Brand System Implementation Plan — Apt

**Status:** Awaiting approval
**Date:** 2026-03-17
**Relates to:** `docs/apt-brand-system.md` (locked decisions)
**Scope:** Retrofit the existing Next.js prototype to match the locked Apt brand system (colours, typefaces, component tokens).

---

## Background

The prototype was built against an early design spec (Implementation_Plan.md Phase 1). That spec used:
- Primary colour: `#c87800` (orange)
- Fonts: Source Sans 3 (body) + Palatino Linotype (display)

The brand system (`apt-brand-system.md`) locks in different decisions:
- Palette: 7-colour "Avocado" set anchored on **terra** (`#7A3E28`) and **cream** (`#FAF7F0`)
- Fonts: **Figtree** (body/UI) + **Lora** (display/headings)

This plan brings the prototype into alignment. It is a visual-only retrofit — no logic, data, or routing changes.

---

## Risks

| Risk | Severity | What to watch for |
|---|---|---|
| `primary-*` colour class sprawl | **High** | `bg-primary-500`, `text-primary-500`, `border-primary-500` appear in 14+ component files. Any missed instance will leave an orange artefact in the brown UI. Do a Grep pass after implementation to confirm zero remaining `primary-` classes. |
| `--apt-lime` contrast failure | **High** | Lime (`#A9B743`) on cream (`#FAF7F0`) = 2.1:1 — fails WCAG AA. Never use lime for text on cream backgrounds. Lime is valid only on dark ground (dark bg) and for the logo pin on cream (non-text, decorative). Audit all chip and label components after migration. |
| Font-swap layout shift | **Medium** | Lora has different metrics from Palatino Linotype. Line heights and heading element sizes will change visually. Expect heading reflow on result and quiz screens — needs a visual review pass after implementing. |
| `bg-white` surfaces | **Medium** | Several components and both modal panels use `bg-white`. The brand "white" is cream (`#FAF7F0`). A missed `bg-white` will produce a noticeably cooler card surface next to cream backgrounds. |
| `font-body font-semibold` on Button | **Low** | The current Button uses `font-semibold` (600). Brand spec calls for `font-medium` (500) on the primary CTA. Minor but visible at large text sizes. |

---

## Files to Change

| File | What changes |
|---|---|
| `tailwind.config.ts` | Replace `primary`/`neutral` colour scale with `apt.*` tokens; update `fontFamily.display` and `fontFamily.body` |
| `src/app/layout.tsx` | Replace `Source_Sans_3` with `Lora` + `Figtree` via `next/font/google`; apply both CSS variables to `<html>` |
| `src/app/globals.css` | Replace `:root` block entirely; update `body` background + font |
| `src/components/ui/Button.tsx` | Primary variant: terra bg, cream text, font-medium; update hover state |
| `src/components/quiz/ProgressBar.tsx` | Filled pip: terra; inactive pip: apt-mid/20 |
| `src/components/quiz/PhaseLabel.tsx` | Chip: lime-tint bg, terra text, rounded-full |
| `src/components/quiz/SingleSelectOptions.tsx` | Selected state: terra bg; unselected border: apt-mid |
| `src/components/quiz/MultiSelectOptions.tsx` | Same as SingleSelect |
| `src/components/quiz/ContinueButton.tsx` | Inherits from Button — should resolve automatically once Button is updated |
| `src/components/quiz/WhyWeAskToggle.tsx` | Text colour: apt-mid |
| `src/components/result/WorthKnowingBlock.tsx` | terra-tint bg, terra left border (3px) |
| `src/components/result/CommunityVoiceBlock.tsx` | terra-tint bg, terra left border |
| `src/components/result/AnalogousComparisonBlock.tsx` | terra-tint bg, terra left border |
| `src/components/result/DataSourcePills.tsx` | lime-tint bg, terra text |
| `src/components/result/NeighbourhoodMatchCard.tsx` | Any direct colour classes |
| `src/components/layout/SidePanelLayout.tsx` | Background surfaces: apt-cream |
| `src/components/modals/ScamShieldModal.tsx` | `bg-white` panel → `bg-apt-cream` |
| `src/components/modals/SaveBottomSheet.tsx` | `bg-white` panel → `bg-apt-cream` |
| `src/app/page.tsx` | Any inline colour classes on landing screen |

---

## Step-by-Step Changes

### Step 1 — `tailwind.config.ts`

Replace the `colors` and `fontFamily` blocks:

```ts
colors: {
  apt: {
    lime:         '#A9B743',
    terra:        '#7A3E28',
    dark:         '#2A2318',
    cream:        '#FAF7F0',
    mid:          '#5B5348',
    'lime-tint':  '#F4F8E8',
    'terra-tint': '#F4E8E0',
  },
  success: { 500: '#3a7d44' },
  error:   { 500: '#c0392b' },
},
fontFamily: {
  display: ['var(--font-lora)', 'Georgia', 'serif'],
  body:    ['var(--font-figtree)', 'system-ui', 'sans-serif'],
  mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
},
```

Also add a button radius token to the `borderRadius` block:
```ts
borderRadius: {
  sm:  '6px',
  md:  '10px',
  lg:  '16px',
  btn: '0.375rem',   // ← brand spec for CTA buttons
},
```

---

### Step 2 — `src/app/layout.tsx`

Replace the `Source_Sans_3` import with `Lora` + `Figtree`:

```tsx
import { Lora, Figtree } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
```

Update `<html>` tag:
```tsx
<html lang="en" className={`${lora.variable} ${figtree.variable}`}>
```

---

### Step 3 — `src/app/globals.css`

Replace the entire `:root` block and `body` rule:

```css
:root {
  --apt-lime:        #A9B743;
  --apt-terra:       #7A3E28;
  --apt-dark:        #2A2318;
  --apt-cream:       #FAF7F0;
  --apt-mid:         #5B5348;
  --apt-lime-tint:   #F4F8E8;
  --apt-terra-tint:  #F4E8E0;

  --font-display: var(--font-lora), Georgia, serif;
  --font-ui:      var(--font-figtree), system-ui, sans-serif;

  --space-xs:  0.5rem;
  --space-sm:  0.75rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;

  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.14);
}

body {
  background-color: var(--apt-cream);
  color: var(--apt-dark);
  font-family: var(--font-ui);
}
```

Remove: `--color-bg`, `--color-surface`, `--color-primary`, `--color-text`, `--color-text-muted`.

---

### Step 4 — Colour class migration (all components)

Find-and-replace these Tailwind class names across all `src/` files:

| Find | Replace | Context |
|---|---|---|
| `bg-primary-500` | `bg-apt-terra` | Buttons, active pips, left borders used as bg |
| `hover:bg-primary-700` | `hover:bg-apt-dark` | Button hover |
| `text-primary-500` | `text-apt-terra` | Text accents, chip text |
| `border-primary-500` | `border-apt-terra` | Left-border accent cards |
| `bg-neutral-50` | `bg-apt-cream` | Card and screen backgrounds |
| `bg-neutral-100` | `bg-apt-terra-tint` | Caveat / WorthKnowing blocks |
| `bg-white` | `bg-apt-cream` | Modal panels, any "white" surface |
| `text-neutral-900` | `text-apt-dark` | Primary body text |
| `text-neutral-600` | `text-apt-mid` | Secondary / muted text |
| `text-neutral-400` | `text-apt-mid` | Very muted text (check contrast — apt-mid on cream = 7.1:1 AAA, safe) |
| `border-neutral-200` | `border-apt-mid/20` | Subtle dividers and card borders |
| `bg-neutral-200` | `bg-apt-mid/20` | Progress pip track |
| `bg-neutral-900 text-white` | `bg-apt-dark text-apt-cream` | Selected option state in SingleSelect/MultiSelect |

**Note on `text-white`:** Keep `text-white` only in `danger` variant buttons and error states. Replace all other occurrences with `text-apt-cream`.

---

### Step 5 — `Button.tsx` — primary variant spec

Update `variantClasses.primary`:

```ts
primary:
  'bg-apt-terra text-apt-cream font-medium hover:bg-apt-dark disabled:bg-apt-mid/30 disabled:text-apt-cream/50',
```

Update size classes to use `rounded-btn` (new token = 0.375rem):
```ts
sm: 'text-sm px-3 py-2 rounded-btn',
md: 'text-sm px-6 py-3 rounded-btn',
lg: 'text-base px-6 py-4 rounded-btn',
```

Change base class `font-semibold` → `font-medium`.

---

### Step 6 — `PhaseLabel.tsx` (chip) spec

The chip should match brand component token exactly:
```tsx
className="bg-apt-lime-tint text-apt-terra font-body text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
```

---

### Step 7 — Caveat block components

`WorthKnowingBlock`, `CommunityVoiceBlock`, `AnalogousComparisonBlock` — all use the same caveat token:

```
bg-apt-terra-tint border-l-[3px] border-apt-terra rounded-[0.25rem_0.375rem_0.375rem_0.25rem] p-4
```

Body text inside: `font-body text-sm text-apt-dark`

---

### Step 8 — `DataSourcePills.tsx`

Update pill style to chip spec:
```
bg-apt-lime-tint text-apt-terra font-body text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full
```

---

## Post-Implementation Checks

Run these after completing all steps:

1. **Build:** `npm run build` — must pass with zero TypeScript errors
2. **No orange:** `grep -r "primary-" src/` — must return zero matches
3. **No #c87800:** `grep -r "c87800" src/` — must return zero matches
4. **No bg-white:** `grep -r "bg-white" src/` — should return zero (modals converted to `bg-apt-cream`)
5. **Visual review — quiz screen `/quiz/1`:**
   - Progress pips: terra brown (not orange)
   - Phase chip: lime-tint background, terra text, fully rounded
   - Continue button: terra brown, cream text
6. **Visual review — result screen `/result`:**
   - WorthKnowing block: warm pinkish-brown tint bg, terra left border
   - Community voice block: same tint
   - Data source pills: pale green tint, terra text
7. **Visual review — fonts:**
   - Headings: Lora (serif) — confirm in DevTools computed styles
   - Body/labels: Figtree (sans) — confirm in DevTools
8. **Accessibility:** inspect the page with the axe DevTools extension — no new contrast failures

---

## What This Plan Does NOT Change

- Routing, matching logic, session state, quiz questions
- Copy / locale strings
- Data structures or neighbourhood JSON
- `html_outputs/` — standalone HTML prototypes are out of scope
- Logo SVG (not yet implemented in the Next.js app)

---

*Apt · Connect4 · ProductBC AI Buildathon · March 2026*
