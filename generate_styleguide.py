import anthropic
import re
import os
import webbrowser

client = anthropic.Anthropic()

DISTILLED_AESTHETICS_PROMPT = """
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
</frontend_aesthetics>
"""

BASE_SYSTEM_PROMPT = """You are an expert UI developer and design systems architect. When asked to create a UI, produce complete, self-contained HTML with embedded CSS and JS.

Your output MUST follow this format exactly:
```html
<!DOCTYPE html>
<html>
...
</html>
```

Our parser depends on this format - do not deviate from it!
"""

USER_PROMPT = """Create a comprehensive style guide page for Connect4 — a newcomer housing app for Vancouver.

Product character:
- Helps newcomers to Vancouver find the right neighbourhood
- Mood: friendly, helpful, warm, trustworthy — not clinical, not corporate
- Users are under real stress making a big decision; the product should feel like a knowledgeable friend, not a government form
- Light theme only

The style guide page must include all of the following sections, each visually rendered (not just described):

1. BRAND COLOURS
   - Primary, secondary, accent, and neutral palette
   - Each swatch shows: hex value, CSS variable name, and usage note (e.g. "Primary CTA", "Body text", "Warning badge")
   - Include tints/shades for the primary colour (at minimum 100–900 scale)

2. TYPOGRAPHY
   - Chosen font(s) with reasoning
   - Type scale: display, h1, h2, h3, body, small, caption — rendered at actual size
   - Font weights in use
   - Line height and letter spacing guidelines

3. COMPONENTS
   Render each component in its actual styled state:
   - Primary button, secondary button, ghost button (default + hover state shown side by side)
   - Input field (empty, filled, error states)
   - Match score badge (e.g. "84% match")
   - Community voice quote block (the distinctive styled block from explanation cards)
   - Data source citation pill (e.g. "Walkscore · 92")
   - Neighbourhood tag/chip
   - Progress indicator (for the quiz flow)
   - Alert/warning banner (for stale data warnings)

4. SPACING & LAYOUT
   - Spacing scale (4px base, show 4/8/12/16/24/32/48/64px as visual blocks with labels)
   - Border radius scale
   - Shadow scale

5. ICONOGRAPHY STYLE
   - Describe the icon style (stroke weight, corner radius, fill vs outline) with SVG examples for: location pin, transit, safety, community, share, save/shortlist

6. DESIGN TOKENS
   - All values as CSS custom properties (--color-primary, --spacing-md, etc.) shown in a code block ready to copy

Make the style guide itself beautifully designed — it should demonstrate the design system as it documents it. Use the fonts and colours you define within the page itself."""

os.makedirs("html_outputs", exist_ok=True)

print("Generating Connect4 style guide...\n")

full_response = ""
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    system=BASE_SYSTEM_PROMPT + "\n\n" + DISTILLED_AESTHETICS_PROMPT,
    messages=[{"role": "user", "content": USER_PROMPT}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
        full_response += text

print("\n\nExtracting HTML...")

match = re.search(r"```html\n(<!DOCTYPE html>.*?</html>)\n```", full_response, re.DOTALL)
if match:
    html = match.group(1)
    output_path = os.path.abspath("html_outputs/connect4_styleguide.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved to {output_path}")
    webbrowser.open(f"file://{output_path}")
else:
    print("Could not extract HTML block — saving raw response.")
    with open("html_outputs/connect4_styleguide_raw.txt", "w", encoding="utf-8") as f:
        f.write(full_response)
