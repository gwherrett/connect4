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

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context.
</frontend_aesthetics>
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

USER_PROMPT = """Create a neighbourhood explanation card (Version C) for a newcomer housing app called Connect4.

The card is for:
- Neighbourhood: East Vancouver (East Van)
- User profile: Moderate safety sensitivity — comfortable with busy urban areas, wants to avoid specific concerns rather than seeking quiet suburban streets
- Card version: C — includes match score, data rationale, AND a community voice quote

Card must include:
1. Neighbourhood name and match score (show as a visual score, e.g. 84%)
2. A one-line summary of why East Van fits this user
3. Data rationale section — cite real or plausible data sources (Walkscore, CMHC, Vancouver Open Data) for each claim. Include: walkability score, transit access, safety context (crime stats framing for moderate sensitivity), and neighbourhood character
4. Community voice quote — from a settled newcomer (arrived <18 months ago) who matches the profile. Include their arrival context (e.g. "A newcomer from Brazil, works in Mount Pleasant, doesn't own a car, 11 months in Vancouver") but no full name. Visually distinguish this section from the data section.
5. A "Find listings in East Van" CTA button
6. A "Share this match" secondary action

Design should feel: warm, community-focused, trustworthy — not clinical or corporate. This is a tool for people under real stress making a big decision."""

os.makedirs("html_outputs", exist_ok=True)

print("Generating East Van explanation card...\n")

full_response = ""
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=8096,
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
    output_path = os.path.abspath("html_outputs/east_van_card.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved to {output_path}")
    webbrowser.open(f"file://{output_path}")
else:
    print("Could not extract HTML block — saving raw response.")
    with open("html_outputs/east_van_card_raw.txt", "w") as f:
        f.write(full_response)
