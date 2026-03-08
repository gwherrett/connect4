import anthropic
import re
import os
import webbrowser

client = anthropic.Anthropic()

STYLE_GUIDE = """
<style_guide>
Follow this design system exactly. Do not deviate from these tokens.

FONTS (load from Google Fonts):
- Fraunces (700, 600) — display and headings
- DM Sans (400, 600) — body, labels, captions, buttons
- JetBrains Mono (500) — data citations, match scores

COLOURS (use these exact hex values):
--color-primary-900: #1A3D2B
--color-primary-700: #2D6A4F
--color-primary-500: #52B788
--color-primary-300: #95D5B2
--color-primary-100: #D8F3DC
--color-secondary-700: #B5451B
--color-secondary-500: #E76F51
--color-secondary-100: #FAE0D9
--color-neutral-900: #1C1C1C
--color-neutral-700: #3D3D3D
--color-neutral-500: #767676
--color-neutral-300: #C4C4C4
--color-neutral-100: #F5F5F0
--color-white: #FFFFFF
--color-warning: #E9C46A

TYPOGRAPHY SCALE:
- Display: Fraunces 48px / 700 / lh 1.1
- H1: Fraunces 36px / 600 / lh 1.2
- H2: Fraunces 28px / 600 / lh 1.25
- H3: DM Sans 20px / 600 / lh 1.3
- Body: DM Sans 16px / 400 / lh 1.6
- Small: DM Sans 14px / 400 / lh 1.5
- Caption: DM Sans 12px / 400 / lh 1.4
- Mono: JetBrains Mono 13px / 500

COMPONENTS:
Primary button: bg #52B788, text white, border-radius 8px, padding 12px 24px, DM Sans 16px/600
Secondary button: bg white, text #2D6A4F, border 1px solid #52B788, border-radius 8px
Match score badge: bg #D8F3DC, text #2D6A4F, score in JetBrains Mono 32px/700
Community quote block: bg #FAE0D9, border-left 4px solid #E76F51, border-radius 0 8px 8px 0, Fraunces italic 17px/1.6
Data citation pill: bg #F5F5F0, border 1px solid #C4C4C4, border-radius 9999px, padding 4px 10px, JetBrains Mono 12px/500
Neighbourhood tag: bg #D8F3DC, border-radius 9999px, padding 4px 12px, DM Sans 13px/500/#2D6A4F

SPACING: 4/8/12/16/24/32/48/64px
BORDER RADIUS: sm 4px, md 8px, lg 16px, full 9999px
SHADOWS: sm 0 1px 3px rgba(0,0,0,0.08), md 0 4px 12px rgba(0,0,0,0.10)

Page background: #F5F5F0
Card background: #FFFFFF
</style_guide>
"""

BASE_SYSTEM_PROMPT = """You are an expert UI developer. When asked to create a UI, produce complete, self-contained HTML with embedded CSS and JS.

Your output MUST follow this format exactly:
```html
<!DOCTYPE html>
<html>
...
</html>
```

Our parser depends on this format - do not deviate from it!
"""

USER_PROMPT = """Create a Version C neighbourhood explanation card for the Connect4 newcomer housing app.

This is a mobile-first screen (375px max-width, centred on desktop). It represents the END EXPERIENCE — the polished output a newcomer sees after completing the lifestyle quiz.

CONTENT:
- Neighbourhood: East Vancouver (East Van)
- User profile: moderate safety sensitivity, transit-dependent, no car
- Match score: 84%

CARD STRUCTURE (in this order):

1. HEADER
   - Back navigation ("< All matches")
   - Neighbourhood name: "East Vancouver" in Display/H1
   - One-line match summary: "A walkable, connected neighbourhood that fits your transit-first lifestyle"
   - Match score badge (84%) — prominent, not buried

2. NEIGHBOURHOOD TAGS
   - 3–4 chips: e.g. "Transit-friendly" "Walkable" "Diverse community" "Urban energy"

3. DATA RATIONALE SECTION
   - Section heading: "Why we matched you here" (H3)
   - 3–4 data points, each with:
     - Icon (use inline SVG, Lucide-style outline, 1.5px stroke)
     - Attribute label (e.g. "Transit access")
     - Plain-language explanation tied to the user's profile
     - Data citation pill (e.g. "Walkscore · 88" "TransLink 2024")
   - Data points to include:
     a. Transit: "4 bus routes + SkyTrain within 800m — you won't need a car for your daily commute"  · TransLink 2024
     b. Walkability: "Most errands are walkable — grocery, pharmacy, and cafés all within 10 min on foot" · Walkscore · 88
     c. Safety: "Moderate urban activity — busy streets with good foot traffic. Active community watch program in place." · Vancouver Open Data 2024
     d. Community: "One of Vancouver's most culturally diverse neighbourhoods — strong South Asian, Chinese, and Latin American communities" · Statistics Canada 2021

4. COMMUNITY VOICE SECTION
   - Section heading: "Heard from someone like you" (H3)
   - Community quote block (styled per style guide: bg #FAE0D9, left border #E76F51, Fraunces italic)
   - Quote: "East Van took me a week to get used to — it's busier than I expected. But the transit is unreal. I go everywhere without a car and it just works. I feel like I belong here now."
   - Attribution: "A newcomer from Colombia, works in Downtown Vancouver, no car, 11 months in Vancouver"
   - Small note: "Review verified · Submitted February 2025"

5. ACTIONS (sticky bottom bar on mobile)
   - Primary: "Find listings in East Van" (full width, primary button style)
   - Secondary: "Share this match" (ghost/secondary style, with share icon)

DESIGN NOTES:
- Follow the style guide exactly — Fraunces headings, DM Sans body, JetBrains Mono for data
- Page background #F5F5F0, card on #FFFFFF with shadow-md
- Add a subtle staggered fade-in animation on page load (CSS only)
- The card should feel warm and human — not a data dashboard
- On desktop: card centred, max-width 430px, with soft background
- Icons: inline SVG, outline style, 20px, stroke #2D6A4F or contextual colour"""

os.makedirs("html_outputs", exist_ok=True)

print("Generating East Van explanation card...\n")

full_response = ""
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    system=BASE_SYSTEM_PROMPT + "\n\n" + STYLE_GUIDE,
    messages=[{"role": "user", "content": USER_PROMPT}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
        full_response += text

print("\n\nExtracting HTML...")

match = re.search(r"```html\n(<!DOCTYPE html>.*?</html>)\n```", full_response, re.DOTALL)
if match:
    html = match.group(1)
    output_path = os.path.abspath("html_outputs/east_van_explanation_card.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved to {output_path}")
    webbrowser.open(f"file://{output_path}")
else:
    print("Could not extract HTML — saving raw response.")
    with open("html_outputs/east_van_explanation_card_raw.txt", "w", encoding="utf-8") as f:
        f.write(full_response)
