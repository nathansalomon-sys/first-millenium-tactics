# Decision log

Newest first. Add a dated line whenever a design or technical decision is made, and update `docs/GDD.md` in the same pull request if it changes a rule.

## Provisional — to confirm

These were chosen while setting up the repo so the skeleton could run. They are placeholders, not decisions. Confirm or change each before building on it.

| Topic             | Placeholder in the code                             | Why it needs a decision                                                                                |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Hex orientation   | Pointy-top hexes, odd-r offset maps                 | Sets which six directions a unit can face and whether battle lines run straight along rows or columns. |
| Size names        | `small`, `medium`, `large` in `src/data/sizes.json` | The GDD's MVP scope says "light, medium, heavy"; its tables say Small, Medium, Large.                  |
| Data file shapes  | The JSON structure in `src/data`                    | Written to mirror the GDD tables. Reshape as tickets need.                                             |
| Woods melee       | ×0.7 melee in woods applies to cavalry only         | The GDD sentence can be read as cavalry-only or as all units.                                          |
| Phone orientation | The placeholder board fits any screen               | In portrait, a 20 × 14 board has very small hexes. Landscape-only may be needed.                       |

## 2026-11-14

- **Tech stack:** TypeScript, Phaser 4, Vite and Vitest, with Capacitor later for the stores. Web first, then mobile. Details and reasons in `docs/TECH_STACK.md`.
- **Target platforms:** PC and mobile, including Google Play and the App Store if possible.
- **MVP opponent:** pass-and-play on one device first, then a scoring AI. Online 1v1 with a server comes after the MVP.
- **Visual direction:** top-down, very simple graphics, little scrolling, easy to understand.
- **Process:** GitHub issues with acceptance criteria and a definition of done, one branch and pull request per issue. Development happens in Claude Code and VS Code.
- **No Mac:** iPhone testing goes through the browser; iOS store builds will use a cloud Mac.

## 2026-11-01

- **MVP ruleset** agreed and written up as the GDD: 1v1 on a hex board, one unit per hex, three unit types in three sizes, simultaneous turns with phased resolution, HP / endurance / morale, rout and rally, fog of war.
- **Control:** Fire Emblem-style direct control of every unit. Command radius and order friction are post-MVP.
- **Generals:** passive army-wide buffs only; not on the board in the MVP.
- **Rivers:** fully impassable for now.
- **Disengaging** costs morale.
- **Timers:** 1:30 per turn, 10:00 per player, 25:00 per match. When the turn timer runs out, units repeat their last order. When a player's 10:00 runs out, that player loses. At 25:00 the higher remaining HP% wins, with remaining endurance % as the tiebreaker.
