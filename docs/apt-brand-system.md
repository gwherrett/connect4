
apt_brand_system.md

Page
1
/
1
100%
# Apt — Brand & Design System
*Connect4 · ProductBC AI Buildathon · March 2026*
*Geoff's prototype reference — all decisions locked unless noted*

---

## 1. Colour Palette — Avocado

### Logo lockup colours (core 4)

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--apt-lime` | Lime | `#A9B743` | Wordmark / pin on dark ground only |
| `--apt-terra` | Terra | `#7A3E28` | Wordmark / pin on cream ground |
| `--apt-dark` | Warm Dark | `#2A2318` | Dark ground background, primary body text on cream |
| `--apt-cream` | Cream | `#FAF7F0` | UI screen background, "white" in lockup |

### Full UI palette (all 7)

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--apt-lime` | Lime | `#A9B743` | Logo on dark only — NOT for body text on cream |
| `--apt-terra` | Terra | `#7A3E28` | Section headers, chips, labels on cream |
| `--apt-dark` | Warm Dark | `#2A2318` | Primary body text, dark backgrounds |
| `--apt-cream` | Cream | `#FAF7F0` | All screen backgrounds |
| `--apt-mid` | Mid | `#5B5348` | Secondary text, metadata, muted labels |
| `--apt-lime-tint` | Lime Tint | `#F4F8E8` | Chip backgrounds, subtle UI tints |
| `--apt-terra-tint` | Terra Tint | `#F4E8E0` | Caveat blocks ("Worth knowing"), secondary chips |

### CSS custom properties block

```css
:root {
  --apt-lime:        #A9B743;   /* dark ground only for logo */
  --apt-terra:       #7A3E28;
  --apt-dark:        #2A2318;
  --apt-cream:       #FAF7F0;
  --apt-mid:         #5B5348;
  --apt-lime-tint:   #F4F8E8;
  --apt-terra-tint:  #F4E8E0;
}
```

### Accessibility
WCAG AAA (7:1) is required for all body text. These pairings are verified:

| Text colour | Background | Ratio |
|---|---|---|
| `--apt-dark` | `--apt-cream` | 14.5:1 AAA |
| `--apt-terra` | `--apt-cream` | 7.7:1 AAA |
| `--apt-mid` | `--apt-cream` | 7.1:1 AAA |
| `--apt-lime` | `--apt-dark` | 7.1:1 AAA |
| `--apt-cream` | `--apt-dark` | 14.5:1 AAA |

**Hard constraints:**
- `--apt-lime` on `--apt-cream` = 2.1:1 — NEVER use for text on cream backgrounds
- `--apt-terra` on `--apt-dark` = 1.9:1 — NEVER use for text on dark backgrounds

---

## 2. Typography

### Typefaces

| Role | Font | Weights | Source |
|---|---|---|---|
| Display / headings | **Lora** | 400, 500, 600, 700 + italics | Google Fonts |
| UI / body / labels | **Figtree** | 300, 400, 500, 600 | Google Fonts |

### Google Fonts import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Figtree:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### CSS font tokens

```css
:root {
  --font-display: "Lora", Georgia, serif;
  --font-ui:      "Figtree", system-ui, sans-serif;
}
```

### Type scale

| Role | Font | Size | Weight | Line height | Letter spacing | Colour |
|---|---|---|---|---|---|---|
| App name / wordmark | Lora | Relative (see logo geometry) | 700 | 0.85 | -0.04em | Context-dependent |
| Screen headline | Lora | 2rem | 600 | 1.15 | -0.02em | `--apt-dark` |
| Section heading | Lora | 1.375rem | 500 | 1.25 | 0 | `--apt-dark` |
| Body / onboarding question | Figtree | 1rem | 400 | 1.65 | 0 | `--apt-dark` |
| UI label / chip text | Figtree | 0.75rem | 600 | 1.4 | 0.06em (uppercase) | `--apt-terra` or `--apt-mid` |
| Secondary / metadata | Figtree | 0.8125rem | 400 | 1.55 | 0 | `--apt-mid` |
| "Why we ask" inline note | Figtree | 0.8125rem | 400 | 1.6 | 0 | `--apt-mid` |

### Typography rules
- Body copy line length: 60–70 characters maximum
- No all-caps in body copy — labels and metadata only
- Generous line-height on result/profile text (users read, not scan)
- Display type sparingly — not every screen needs a Lora headline
- Neighbourhood profile narrative: Lora 500, generous line-height (1.7+)

---

## 3. Logo — Symbol + Wordmark

### SVG structure
The mark is a compound SVG with two layers:

```
circle  → the "heart" (sits behind, originally black)
path    → the "pin"   (sits in front, originally white, has heart-shaped cutout)
```

The heart colour shows through the cutout in the pin. Circle-on-background contrast is not required — only pin-on-background and circle-on-pin.

### SVG path data

```
viewBox: 0 0 117.24 164.74
circle: cx="58.75" cy="56.69" r="40.12"
path: M117.24,62.93c0,1.72,0,44.05-58.62,101.81C0,109.57,0,62.93,0,62.93v-4.31
      C0,26.25,26.25,0,58.62,0s58.62,26.25,58.62,58.62v4.31Z
      M76.57,33.43c-6.06-1.83-13.32,4.57-17.97,8.19-4.65-3.6-11.92-9.99-17.97-8.14
      -9.93,3.02-14.53,13.52-11.51,23.44.14.45.4,1.32.4,1.32,0,0,6.03,19.83,29.15,
      31.29,23.33-12.31,28.91-30.83,29.07-31.36,0,0,.26-.88.4-1.32,
      2.99-9.94-1.64-20.42-11.57-23.41Z
```

### SVG snippet

```html
<svg viewBox="0 0 117.24 164.74" xmlns="http://www.w3.org/2000/svg">
  <circle fill="[HEART_COLOUR]" cx="58.75" cy="56.69" r="40.12"/>
  <path fill="[PIN_COLOUR]" d="M117.24,62.93c0,1.72,0,44.05-58.62,101.81C0,109.57,0,62.93,0,62.93v-4.31C0,26.25,26.25,0,58.62,0s58.62,26.25,58.62,58.62v4.31ZM76.57,33.43c-6.06-1.83-13.32,4.57-17.97,8.19-4.65-3.6-11.92-9.99-17.97-8.14-9.93,3.02-14.53,13.52-11.51,23.44.14.45.4,1.32.4,1.32,0,0,6.03,19.83,29.15,31.29,23.33-12.31,28.91-30.83,29.07-31.36,0,0,.26-.88.4-1.32,2.99-9.94-1.64-20.42-11.57-23.41Z"/>
</svg>
```

### Primary lockup colour combination

| Context | Wordmark | Pin (path) | Heart (circle) |
|---|---|---|---|
| **Primary — cream bg** | `#2A2318` Dark | `#A9B743` Lime | `#7A3E28` Terra |
| Primary — dark bg | `#FAF7F0` Cream | `#A9B743` Lime | `#7A3E28` Terra |
| Monochrome — cream bg | `#2A2318` Dark | `#2A2318` Dark | `#FAF7F0` Cream |
| Monochrome — dark bg | `#FAF7F0` Cream | `#FAF7F0` Cream | `#2A2318` Dark |

---

## 4. Logo Geometry

All values are in `em` — relative to the font-size set on the lockup wrapper element. Scale by changing font-size on the wrapper; everything else scales proportionally.

### Stacked lockup

```
Wrapper:  font-size: [desired size]px  ← set this, everything else is relative

Symbol wrapper (.pw):
  position: relative
  padding-top: 0.731em       ← seats symbol above wordmark cap height
  margin-bottom: 0.26em      ← gap between symbol and wordmark

Symbol (SVG):
  position: absolute
  top: 0
  left: 0.583em              ← centres symbol over 'p' of wordmark
  width: 0.648em
  height: auto               ← aspect ratio preserved (1.405 h/w)

Wordmark:
  font-family: Lora, serif
  font-size: 1em
  font-weight: 700
  line-height: 0.85
  letter-spacing: -0.04em
```

### Horizontal lockup

```
Wrapper:  font-size: [desired size]px  ← set this, everything else is relative
          display: inline-flex
          align-items: flex-start

Symbol (SVG):
  display: block
  width: 0.605em
  height: 0.850em            ← cap height (0.715em) × 1.19
  margin-right: 0.025em
  transform: translateY(-0.020em)  ← top sits slightly above cap line

Wordmark:
  font-family: Lora, serif
  font-weight: 700
  line-height: 0.85
  letter-spacing: -0.04em

Placement result:
  Symbol top: ~0.025em above cap line
  Symbol bottom: ~0.11em below baseline (pin tail extends below A)
```

### CSS implementation (copy-paste ready)

```css
/* Stacked lockup */
.lockup-v { display: flex; flex-direction: column; align-items: flex-start; }
.lockup-v .pw { position: relative; padding-top: 0.731em; margin-bottom: 0.26em; }
.lockup-v .pw svg { position: absolute; top: 0; left: 0.583em; width: 0.648em; height: auto; }
.lockup-v .wm { font-family: 'Lora', serif; font-size: 1em; font-weight: 700;
                line-height: 0.85; letter-spacing: -0.04em; }

/* Horizontal lockup */
.lockup-h { display: inline-flex; align-items: flex-start; }
.lockup-h .sym { flex-shrink: 0; display: block; width: 0.605em; height: 0.850em;
                 margin-right: 0.025em; transform: translateY(-0.020em); }
.lockup-h .wm { font-family: 'Lora', serif; font-weight: 700;
                line-height: 0.85; letter-spacing: -0.04em; }
```

### Usage example (stacked at 48px)

```html
<div class="lockup-v" style="font-size: 48px;">
  <div class="pw">
    <svg viewBox="0 0 117.24 164.74" xmlns="http://www.w3.org/2000/svg">
      <circle fill="#7A3E28" cx="58.75" cy="56.69" r="40.12"/>
      <path fill="#A9B743" d="M117.24,62.93..."/>
    </svg>
    <div class="wm" style="color: #2A2318;">Apt</div>
  </div>
</div>
```

---

## 5. Layout Principles

### Spacing scale (rem-based)

```css
--space-xs:  0.5rem;   /*  8px */
--space-sm:  0.75rem;  /* 12px */
--space-md:  1rem;     /* 16px */
--space-lg:  1.5rem;   /* 24px */
--space-xl:  2rem;     /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### Screen layout rules

| Rule | Detail |
|---|---|
| One thing per screen in onboarding | No question competes with another. Progress indicator is the only persistent element. |
| Generous white space | Space is a trust signal. The experience should feel unhurried. |
| Body copy max-width | 60–70 characters (approx `38em` at 1rem base) |
| Result screen density | Earns multiple sections — user has done the work. |
| No decorative elements | If removal doesn't change communication, remove it. |

### Onboarding screen structure

```
[Progress indicator — top, full width]
[Screen question — Lora 600, centred or left-aligned]
[Answer area — generous padding, large touch targets]
["Why we ask" inline note — Figtree 400, --apt-mid]
[CTA button — Figtree 500, full-width on mobile]
```

### Result screen structure

```
[Neighbourhood name — Lora 700, large]
[Match descriptor — Figtree 400, --apt-mid]
[Neighbourhood profile narrative — Lora 500, generous line-height, --apt-cream bg]
[Analogous neighbourhood feature — --apt-terra-tint bg, distinct section]
[Transparent reasoning — "Why this neighbourhood" — two-column or stacked]
[Caveat block — "Worth knowing" — --apt-terra-tint bg, Figtree 400]
[Secondary matches — abbreviated cards]
```

---

## 6. Component Tokens

### Buttons

```css
/* Primary CTA */
background:    var(--apt-terra);
color:         var(--apt-cream);
font-family:   var(--font-ui);
font-weight:   500;
border-radius: 0.375rem;
padding:       0.75rem 1.5rem;

/* On dark ground */
background:    var(--apt-lime);
color:         var(--apt-dark);
```

### Chips / phase tags

```css
background:    var(--apt-lime-tint);
color:         var(--apt-terra);
font-family:   var(--font-ui);
font-size:     0.75rem;
font-weight:   600;
letter-spacing: 0.06em;
text-transform: uppercase;
border-radius: 2rem;
padding:       0.25rem 0.75rem;
```

### Caveat / "Worth knowing" block

```css
background:    var(--apt-terra-tint);
border-left:   3px solid var(--apt-terra);
padding:       1rem 1.25rem;
border-radius: 0.25rem 0.375rem 0.375rem 0.25rem;
font-family:   var(--font-ui);
font-size:     0.875rem;
color:         var(--apt-dark);
```

### "Why we ask" inline note

```css
font-family:   var(--font-ui);
font-size:     0.8125rem;
color:         var(--apt-mid);
font-style:    italic;
margin-top:    0.5rem;
```

### Progress indicator (pip bar)

```css
/* Track */
background:    rgba(90, 83, 72, 0.2);   /* --apt-mid at low opacity */
height:        3px;
border-radius: 2px;

/* Filled segment */
background:    var(--apt-terra);

/* Active segment */
background:    var(--apt-lime);   /* on dark ground */
background:    var(--apt-terra);  /* on cream ground */
```

---

## 7. Voice & Copy Principles

The product's voice: *a knowledgeable local friend who has lived here long enough to be honest, and arrived recently enough to remember what it felt like not to know.*

### Rules
- Short sentences. If it can be said in eight words, don't use fourteen.
- Active voice. The product does something for the user.
- No jargon. "Neighbourhood fit" not "algorithmic preference mapping."
- Specificity over reassurance. Don't say "we take your privacy seriously." Say "your answers attach to neighbourhood profiles, not to you."
- Present, not heavy. Acknowledge the stakes; don't dramatise them.
- First sentence earns the second. Every screen earns the next line.

### Emotional targets per screen moment

| Moment | Target feeling |
|---|---|
| Landing | Calm curiosity — "this might actually understand me" |
| Mid-onboarding | Seen — "it's asking the right questions" |
| Generating / loading | Anticipation — not anxiety |
| Result | Recognition — "yes, that's me" |
| Save / share | Confidence — ready to act |

### What to never produce
Clinical, overwhelming, presumptuous, cheerful-despite-the-stakes, generically tech-optimistic.

---

## 8. Open Decisions

| Item | Status |
|---|---|
| Product name | **Decided — Apt.** Final for the buildathon. |
| Photography vs. typographic-only imagery | Unresolved — working hypothesis: Direction A (type-only) for onboarding, Direction B (neighbourhood texture) for result screen |
| OQ-1 through OQ-4 in onboarding spec | Parked until post-mini-pitch |

---

*Apt · Connect4 · ProductBC AI Buildathon · March 2026 · Kiki's working position*
Displaying apt_brand_system.md.