# Connect4 Style Guide

**Product:** Connect4 · Vancouver Newcomer Housing
**Theme:** Light only
**Mood:** Friendly, helpful, warm, trustworthy — a knowledgeable friend, not a government form

---

## 1. Brand Colours

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary-900` | `#1A3D2B` | Dark text on light backgrounds |
| `--color-primary-700` | `#2D6A4F` | Primary headings, active states |
| `--color-primary-500` | `#52B788` | Primary CTA buttons, key highlights |
| `--color-primary-300` | `#95D5B2` | Hover states, progress fills |
| `--color-primary-100` | `#D8F3DC` | Backgrounds, tinted surfaces |

### Secondary Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-secondary-700` | `#B5451B` | Accent, match score badge |
| `--color-secondary-500` | `#E76F51` | Secondary CTA, tags |
| `--color-secondary-100` | `#FAE0D9` | Alert backgrounds, warning tints |

### Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-neutral-900` | `#1C1C1C` | Body text |
| `--color-neutral-700` | `#3D3D3D` | Secondary text |
| `--color-neutral-500` | `#767676` | Captions, placeholders |
| `--color-neutral-300` | `#C4C4C4` | Borders, dividers |
| `--color-neutral-100` | `#F5F5F0` | Page background |
| `--color-white` | `#FFFFFF` | Card surfaces |

### Semantic Colours

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#52B788` | Confirmed data, verified reviews |
| `--color-warning` | `#E9C46A` | Stale data warning badge |
| `--color-error` | `#E76F51` | Form errors, scam flags |
| `--color-info` | `#4A9EBA` | Informational banners |

---

## 2. Typography

### Font Choice

**Primary:** [Fraunces](https://fonts.google.com/specimen/Fraunces) — a variable optical-size serif with warmth and character. Used for display and headings.

**Secondary:** [DM Sans](https://fonts.google.com/specimen/DM+Sans) — a geometric sans with friendly geometry and excellent legibility at small sizes. Used for body, UI labels, and captions.

**Mono:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — used for data citations, code, and match scores.

### Type Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Display | Fraunces | 48px / 3rem | 700 | 1.1 | -0.02em |
| H1 | Fraunces | 36px / 2.25rem | 600 | 1.2 | -0.01em |
| H2 | Fraunces | 28px / 1.75rem | 600 | 1.25 | 0 |
| H3 | DM Sans | 20px / 1.25rem | 600 | 1.3 | 0 |
| Body | DM Sans | 16px / 1rem | 400 | 1.6 | 0 |
| Small | DM Sans | 14px / 0.875rem | 400 | 1.5 | 0 |
| Caption | DM Sans | 12px / 0.75rem | 400 | 1.4 | 0.02em |
| Data/Mono | JetBrains Mono | 13px / 0.8125rem | 500 | 1.4 | 0 |

---

## 3. Components

### Buttons

```
Primary:    bg --color-primary-500   text white        border none
Secondary:  bg white                 text --color-primary-700   border --color-primary-500
Ghost:      bg transparent           text --color-primary-700   border none   underline on hover
Danger:     bg --color-secondary-500 text white        border none
```

- Border radius: 8px
- Padding: 12px 24px (default), 8px 16px (small)
- Font: DM Sans 16px / 600
- Hover: darken bg by 10%, translate-y -1px, box-shadow sm

### Input Fields

```
Default:  border --color-neutral-300   bg white         focus border --color-primary-500
Filled:   border --color-neutral-500   bg white
Error:    border --color-error         bg #FFF5F5       + error message below in --color-error
```

- Border radius: 8px
- Padding: 12px 16px
- Font: DM Sans 16px / 400
- Label: DM Sans 14px / 600 / --color-neutral-700, 6px above input

### Match Score Badge

```
Large:  circular or pill   bg --color-primary-100   text --color-primary-700
        Score number: JetBrains Mono 32px / 700
        "match" label: DM Sans 12px / 400

Small:  pill               bg --color-primary-100   text --color-primary-700
        Score: JetBrains Mono 14px / 600
```

### Community Voice Quote Block

Visually distinct from data rationale — warm, human, slightly inset.

```
bg --color-secondary-100
border-left: 4px solid --color-secondary-500
border-radius: 0 8px 8px 0
padding: 16px 20px
font: Fraunces italic 17px / 1.6
attribution: DM Sans 12px / 400 / --color-neutral-500, below quote
```

### Data Source Citation Pill

```
bg --color-neutral-100
border: 1px solid --color-neutral-300
border-radius: 99px
padding: 4px 10px
font: JetBrains Mono 12px / 500 / --color-neutral-700
```

Example: `Walkscore · 92` `CMHC 2024` `Vancouver Open Data`

### Neighbourhood Tag / Chip

```
bg --color-primary-100
border-radius: 99px
padding: 4px 12px
font: DM Sans 13px / 500 / --color-primary-700
```

### Quiz Progress Indicator

Horizontal bar, full width.

```
Track:    bg --color-neutral-200   height 4px   border-radius 99px
Fill:     bg --color-primary-500   animated width transition 300ms ease
Step text: DM Sans 12px / --color-neutral-500   "Step 3 of 6"
```

### Stale Data Warning Banner

```
bg --color-warning (10% opacity tint)
border: 1px solid --color-warning
border-radius: 8px
padding: 10px 14px
icon: warning triangle in --color-warning
font: DM Sans 14px / --color-neutral-700
```

Example: "Transit data last updated 4 months ago. Verify before deciding."

---

## 4. Spacing & Layout

### Spacing Scale (4px base)

| Token | Value | Usage |
|---|---|---|
| `--spacing-1` | 4px | Icon gap, tight label spacing |
| `--spacing-2` | 8px | Internal component padding |
| `--spacing-3` | 12px | Button padding vertical |
| `--spacing-4` | 16px | Card padding, input padding |
| `--spacing-6` | 24px | Section gap within a card |
| `--spacing-8` | 32px | Card margin, between components |
| `--spacing-12` | 48px | Section separation |
| `--spacing-16` | 64px | Page section breaks |

### Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, pills (inner) |
| `--radius-md` | 8px | Buttons, inputs, cards |
| `--radius-lg` | 16px | Modal sheets, large cards |
| `--radius-full` | 9999px | Tags, chips, score pills |

### Shadow Scale

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Subtle card lift |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Active cards, dropdowns |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals, bottom sheets |

---

## 5. Iconography

**Style:** Outline icons, 1.5px stroke, rounded line caps and joins, minimal fills. Never solid/filled icons except for active/selected states.

**Size:** 20px default, 16px small, 24px large/CTA.

**Reference set:** Use [Lucide](https://lucide.dev) as the base icon library — it matches the stroke weight and corner radius of the design language.

**Key icons and their usage:**

| Icon | Lucide name | Usage |
|---|---|---|
| Location pin | `map-pin` | Neighbourhood marker |
| Transit | `bus` | Commute mode indicator |
| Safety | `shield` | Safety sensitivity dimension |
| Community | `users` | Cultural proximity dimension |
| Share | `share-2` | Share match action |
| Save / Shortlist | `bookmark` | Save listing action |
| Warning | `alert-triangle` | Stale data, scam flag |
| Verified | `check-circle` | Approved review, verified data |

---

## 6. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colours — Primary */
  --color-primary-900: #1A3D2B;
  --color-primary-700: #2D6A4F;
  --color-primary-500: #52B788;
  --color-primary-300: #95D5B2;
  --color-primary-100: #D8F3DC;

  /* Colours — Secondary */
  --color-secondary-700: #B5451B;
  --color-secondary-500: #E76F51;
  --color-secondary-100: #FAE0D9;

  /* Colours — Neutral */
  --color-neutral-900: #1C1C1C;
  --color-neutral-700: #3D3D3D;
  --color-neutral-500: #767676;
  --color-neutral-300: #C4C4C4;
  --color-neutral-100: #F5F5F0;
  --color-white: #FFFFFF;

  /* Colours — Semantic */
  --color-success: #52B788;
  --color-warning: #E9C46A;
  --color-error: #E76F51;
  --color-info: #4A9EBA;

  /* Typography */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-display: 3rem;
  --text-h1: 2.25rem;
  --text-h2: 1.75rem;
  --text-h3: 1.25rem;
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-caption: 0.75rem;
  --text-mono: 0.8125rem;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.10);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

---

*Connect4 Style Guide v1.0 · Derived from MVP Requirements Opportunity 1 and Concept Brief*
