# FMT — First-Millennium Tactics

A 1v1 hex tactics game about first-millennium warfare. Each player is a general commanding infantry, foot archers and cavalry in simultaneous turns. "FMT" is a working title.

The owner designs the game, writes the tickets and reviews every pull request. He is new to Vite, Phaser and Capacitor, so explain technical choices in plain language and keep jargon out of summaries.

## Read before you work

| File                                     | What it is                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `docs/GDD.md`                            | The game rules and every balance number. Source of truth.                             |
| `docs/ARCHITECTURE.md`                   | How the code is organized, and the rules that keep the engine pure and deterministic. |
| `docs/WORKFLOW.md`                       | Issue → branch → pull request → merge, and the definition of done.                    |
| `docs/BACKLOG.md`                        | Milestones, draft tickets, and rules gaps that need a design decision.                |
| `docs/TECH_STACK.md`                     | The tools, why they were chosen, and the route to the app stores.                     |
| `docs/DECISIONS.md`                      | Dated log of decisions, including provisional ones still to confirm.                  |
| `docs/research/competitive-landscape.md` | Takeaways from competitor research. Background, not requirements.                     |

Read the GDD section a ticket points to before writing any rules code. Do not rely on memory of it.

## Commands

```bash
npm install         # once, after cloning
npm run dev         # run the game locally with live reload
npm test            # run all tests once
npm run test:watch  # re-run tests on save
npm run typecheck   # TypeScript check
npm run format      # format every file with Prettier
npm run check       # typecheck + tests + format check — run before every commit
npm run build       # production build into dist/
```

## Rules that always apply

1. **The engine is pure.** Code in `src/engine` never imports Phaser or anything from `src/render`, and never touches `window`, `document`, timers or the clock. `src/engine/purity.test.ts` enforces this.
2. **The engine is deterministic.** No `Math.random()`. Every roll goes through `src/engine/rng.ts`, using the seed in the match state. Same state + same orders + same seed = same result.
3. **Numbers live in data.** Every balance value belongs in `src/data/*.json`, never as a literal in code. `src/data/data.test.ts` pins the values the GDD states.
4. **The GDD is the source of truth.** If a ticket and the GDD disagree, or the GDD is silent or ambiguous, stop and ask. Never choose a game rule yourself. If a rule or number changes, update `docs/GDD.md` in the same pull request and add a line to `docs/DECISIONS.md`.
5. **Rules come with tests.** Write the tests first, from the ticket's worked examples. Add a "golden scenario" test for any outcome the GDD describes.
6. **One ticket, one branch, one pull request.** Keep changes small. Do not merge your own pull request. Do not commit straight to `main`.
7. **No new dependencies without asking.** The stack is in `docs/TECH_STACK.md`.
8. **Stay inside the ticket.** Note anything else you spot as a follow-up issue instead of fixing it in passing. MVP scope is in the GDD; the post-MVP backlog is out of bounds unless a ticket says otherwise.
9. **Check what is visible.** For UI work, run the game and look at it at phone size (about 390 × 844 and 844 × 390) as well as desktop. The board must stay readable on a phone.

## Things to know

- **Phaser 4 is recent** (first stable release April 2026). Check the official Phaser 4 documentation and examples rather than assuming Phaser 3 behaviour.
- **Hex math** follows [Red Blob Games' hex grid guide](https://www.redblobgames.com/grids/hexagons/): axial coordinates in the engine, odd-r offset coordinates for map files.
- **The owner develops on a PC and has no Mac.** He tests on an iPhone through the browser. Keep scripts cross-platform (npm scripts, no shell-specific commands).
- **Open questions** are listed at the end of `docs/GDD.md` and in `docs/BACKLOG.md`. Some choices in the current code are provisional (see `docs/DECISIONS.md`): hex orientation, size names, and the shape of the data files. Ask before building on them in a way that would be hard to undo.

## Where things are

```text
src/engine/   rules engine: pure TypeScript, no rendering
src/data/     balance data as JSON, plus small typed helpers
src/render/   Phaser scenes and layout math (drawing and input only)
src/main.ts   starts the game
docs/         design, architecture and process docs
```
