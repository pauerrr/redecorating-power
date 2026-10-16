# Design notes

The kit borrows the visual language of [domesticstreamers.com](https://www.domesticstreamers.com), read from the live site in October 2026. Use these rules when adding pages, slides or printed material so new pieces sit with the rest.

## Type

| Role | Face | Weight | Notes |
|---|---|---|---|
| Everything | **Roobert** (licensed) → **Geist** fallback | 400 body, 500 headings | Roobert renders if installed; Geist is bundled. |
| Codes, numbers, file paths | Geist Mono | 400 | Small, 12–13 px, never for running text. |

- Headings are large and medium weight, never bold. Display sizes run 96–124 px on the web, 100–180 px on slides, with slightly negative tracking.
- The wordmark is set in capitals with wide tracking: `DOMESTIC DATA STREAMERS`.
- Statements (the DDS "big sentence") sit at 24–36 px, regular weight, short measure.

## Colour

| Token | Hex | Use |
|---|---|---|
| Ink | `#0B0C0C` | Text, dark sections, solid buttons. Never pure black. |
| Cream | `#F0EEE5` | Page background. |
| White | `#FFFFFF` | Rounded content sheets. |
| Lime | `#C5FF71` | The live accent: active menu item, primary actions, highlights. |
| Line | `rgba(11,12,12,.3)` | Hairlines between rows. |
| Sky / Yellow / Lilac / Red / Blue | `#A9EAFF` `#FBE965` `#E1BCE0` `#FF3F25` `#3F5DFE` | Phase colours only (01, 02, 03, 04, 05). Not decoration. |

Phase map: 00 lime · 01 sky · 02 yellow · 03 lilac · 04 red · 05 blue · 06 ink.

## Patterns

- **The rounded sheet.** White panels with a very large top radius (≈120 px on desktop) slide up over the cream background. Consecutive sheets overlap.
- **Hairline rows.** Lists are rows separated by 1 px lines: a mono number, a name, a description, an arrow. Rows tint on hover; the arrow nudges up and right.
- **Pill buttons.** 1 px ink outline, fully rounded, 15 px medium text. Solid ink or lime for the main action.
- **Outline tags.** Small 12 px labels with a 1 px border and a 3 px radius; fully rounded for status.
- **Media cards.** Image on top, a caption row underneath with the title left and tags right.
- **Left-aligned heroes.** Big heading on the left, statement and actions on the right column.

## Motion

Short and quiet: elements rise 16 px and fade in with a stagger on load; hover states move by transform only; nothing loops except the small breathing dot on live edition info. Respect `prefers-reduced-motion`.

## Voice

Plain, dry, specific. Short sentences next to longer ones. No hype words. If a joke needs a wink, cut it: the deadpan is the point.
