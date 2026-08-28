# Self-Study Proofbook — visual thesis

## Direction

**Pixel proof terminal.** The interface borrows the discipline of a demoscene
status screen and the intimacy of graph-paper working notes. It should feel like
a private instrument for building evidence: crisp bitmap edges, numbered ledger
rows, small status lamps, and a restrained phosphor glow. It must not resemble a
generic dashboard or a game. The learner's writing remains the most prominent
material.

## Palette

The dark treatment is intentional and single-mode, like a focused terminal on a
quiet desk. Every background is painted explicitly.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#F3F0DF` | Main text |
| `--muted` | `#AAA99D` | Supporting text |
| `--void` | `#0B0E13` | Page background |
| `--panel` | `#141923` | Raised work surfaces |
| `--panel-2` | `#1B2230` | Inputs and selected rows |
| `--grid` | `#303949` | Borders and graph lines |
| `--phosphor` | `#B9F227` | Primary action and focus |
| `--cyan` | `#59DCE8` | Links and source references |
| `--amber` | `#FFC857` | Timers and revisions |
| `--danger` | `#FF6B6B` | Destructive warnings |
| `--success` | `#7CE3A1` | Saved and mastered states |

Body text on `--void` is 16.2:1. Muted text on `--void` is 8.5:1. Dark text on
the phosphor action is above 10:1. Status is always repeated in words or shape.

## Type and spacing

- Display and controls: **Departure Mono**, locally hosted WOFF2, 400. Its square
  counters fit the ledger and demoscene direction.
- Long-form writing: the platform serif stack (`Charter`, `Georgia`, serif). It
  gives proofs the reading rhythm of a printed notebook without another font file.
- Body starts at 16px with 1.55 line height. UI labels are never below 13px.
- The spacing unit is 8px. Main steps: 8, 16, 24, 32, 48, 64, and 96px.
- Corners are clipped with 6px chamfers rather than rounded pills. One-pixel
  borders and offset shadows make depth without card clutter.

## Layout and interaction grammar

The landing screen is an asymmetric two-column field: direct copy on the left,
an original pixel tableau on the right, then the live proof ledger interrupts
the boundary below. Inside the app, a numbered left rail lists topics while the
right side holds the selected attempt. On phones, the rail becomes a horizontal
topic strip and editing becomes one column.

Buttons depress by 2px and lose their offset shadow. Links are cyan and
underlined. Selection uses both a phosphor left rule and a filled background.
Saved actions create a short scan-line sweep across the affected row. Dialogs
return focus to their opener. Destructive actions name the record and require
confirmation.

## Motion policy

The signature motion is a single 420ms **proof scan**: a thin phosphor line moves
top to bottom when a solution revision is saved. Standard controls use 160ms
transform and opacity transitions. Nothing loops. With `prefers-reduced-motion`,
the scan is removed, scroll is instant, and state changes use static borders.

## Original asset plan

The hero is a generated, wide pixel-art scene: a solitary desk terminal whose
screen shows abstract proof blocks, surrounded by index cards that become a
constellation of completed work. It explains that many private attempts form one
coherent record. UI icons, favicon, and status marks are hand-authored SVG or CSS
pixel forms so they remain exact at small sizes.

### Hero prompt sheet

- Use case: stylized-concept
- Asset: wide landing hero and source for the 1200×630 social image
- Subject: an empty late-night self-study desk, compact CRT-style terminal,
  graph-paper cards, pencil, and small stacked theorem blocks
- World: quiet personal study room rendered as a 1990s demoscene still
- Materials: matte black plastic, recycled paper, phosphor pixels, subtle dust
- Light: low-key navy room light with lime and cyan screen glow
- Lens: wide isometric three-quarter view, large calm negative space, crisp edges
- Palette words: ink black, warm paper, phosphor lime, electric cyan, amber
- Negative list: people, hands, logos, readable text, equations, watermarks,
  gradients, glossy 3D, cyberpunk city, neon overload, generic laptop mockup

Final generation prompt: “A wide isometric pixel-art illustration of an empty
late-night self-study desk, compact CRT-style terminal displaying abstract proof
blocks and check marks without readable text, graph-paper problem cards spreading
outward into an ordered constellation, pencil and small stacked theorem blocks,
1990s demoscene still, matte black plastic and recycled paper, sparse room in ink
black and navy, phosphor lime and electric cyan screen glow with one amber timer
light, large calm dark negative space, crisp deliberate pixel clusters, editorial
composition, no people, no hands, no brands, no logos, no readable text, no
watermark, no equations, no glossy 3D, no cyberpunk city, no neon overload.”

## Provenance

The hero is generated specifically for this product with the factory image model
(`factory-image`) on 2026-08-28. The exact prompt is stored above and beside the
source image in `assets/src/hero-proof-terminal.json`. Generated imagery is
original product art. Hand-authored SVG marks are MIT-licensed with the app.
