# Characterization UI Redesign v2

This package keeps the cleaned CSS baseline and replaces only the Characterization block in `24-final-overrides.css`.

## Recommended replacement
Replace the Characterization section at the bottom of:

`resources/js/styles/24-final-overrides.css`

Look for:

`SILICA2CON — CHARACTERIZATION / CLEAN BASELINE`

Replace from that comment to the end of the Characterization-specific block with the contents of:

`CHARACTERIZATION_REDESIGN_BLOCK_v2.css`

Do **not** replace the entire CSS file with the standalone block.

## What the redesign does
- Keeps Demo Dataset: Qualified / Conditional / Incomplete.
- Keeps the existing TSX/data contract.
- Makes the top area a 3-card summary strip.
- Uses a balanced two-column workspace for Identity and Lab.
- Makes Qualification a full-width focal card.
- Turns `Data yang Dinilai` into a 5-column × 2-row grid on desktop.
- Makes the Formulation next-step area full-width.
- Gives Qualified / Conditional / Incomplete distinct visual states.
- Polishes Phase Assessment and Particle Class blocks.
- Includes tablet/mobile responsive rules.

## No logic changes
No engine, routing, data contracts, or calculation code is changed by this CSS package.
