# Architecture

The game is split into a rules engine that knows nothing about graphics, and a client that draws the game and collects orders. The split is what makes simultaneous turns, automated tests, the AI opponent and, later, online play straightforward.

## Layers

```text
src/data/     Balance numbers as JSON, plus small typed helpers
   ▲
src/engine/   Rules engine: pure, deterministic TypeScript
   ▲
src/render/   Phaser client: draws state, animates events, collects orders
   ▲
src/main.ts   Starts Phaser
```

Imports only point upward in this picture. The engine imports from `src/data` and from itself. The client imports from the engine and the data. Nothing in the engine imports from the client.

| Folder       | May import                       | Must not                                                                                         |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/data`   | Its own JSON files               | Import the engine or the client                                                                  |
| `src/engine` | `src/engine`, `src/data`         | Import Phaser or `src/render`; use `window`, `document`, timers, `Date.now()` or `Math.random()` |
| `src/render` | Phaser, `src/engine`, `src/data` | Contain game rules or balance numbers                                                            |

`src/engine/purity.test.ts` fails the build if the engine breaks these rules.

## The engine

### One entry point per turn

```ts
resolveTurn(state, ordersA, ordersB) → { state, events }
```

- `state` is the whole match: board, units, turn number, RNG state. It is plain data that can be saved as JSON.
- `ordersA` and `ordersB` are each player's orders for the turn, at most one per unit.
- The result is a new state plus an ordered list of events. The input state is never modified.

The GDD writes the signature with a separate `seed` argument. Keeping the RNG state inside `state` is the same idea and makes a saved match replayable from any turn. Either form is fine as long as the engine stays deterministic.

Inside, the engine runs one function per resolution phase, in the GDD's order:

1. Rout movement
2. Movement (in ticks of 1 MP, with initiative for contested hexes)
3. Volleys
4. Shock
5. Melee
6. Morale & status
7. Visibility

Within a phase, all effects are calculated first and then applied together, so the order units are processed in never gives an advantage.

### Determinism

- Every random roll uses `src/engine/rng.ts`. The functions are pure: they take an RNG state and return a value plus the next state.
- Never iterate in an order that could differ between runs. Sort units by id before processing when order could matter.
- No clocks. Timers are the client's job; the engine only receives "these are the orders for this turn".

Determinism is what allows exact replays, tests with fixed expected outcomes, an AI that simulates turns ahead, and a server that re-runs a turn to check a client.

### Events

The engine reports what happened as a list of events, in phase order: for example `moved`, `blocked`, `volleyed`, `charged`, `meleed`, `routed`, `rallied`, `destroyed`. The client plays them back as animation. The client never works out what happened by comparing two states.

### Visibility

The engine computes what each player can see. The client draws only that. In pass-and-play, both players share one device, so the client shows a hand-over screen between players and never shows one player's orders or hidden units to the other. For online play later, the server sends each player only their visible view.

### Suggested data model

A starting point, not a contract. Shape it in the tickets that introduce each part.

```ts
type PlayerId = 'A' | 'B';

interface Unit {
  id: string;
  owner: PlayerId;
  type: UnitType; // 'infantry' | 'archers' | 'cavalry'
  size: UnitSize; // 'small' | 'medium' | 'large' (names provisional)
  position: Hex; // axial coordinates
  facing: Direction; // 0–5
  hp: number;
  endurance: number; // 0–100
  morale: number; // 0–100
  ammo: number; // archers only
  status: 'steady' | 'routing' | 'destroyed' | 'fled';
  lastOrder: Order | null; // repeated when the turn timer runs out
}

type Order =
  | { kind: 'move'; unitId: string; path: Hex[]; facing: Direction }
  | { kind: 'hold'; unitId: string; facing: Direction }
  | { kind: 'volley'; unitId: string; target: Hex; moveTo?: Hex }
  | { kind: 'disengage'; unitId: string; to: Hex };

interface MatchState {
  map: GameMap; // terrain, elevation, deployment zones
  units: Unit[];
  generals: Record<PlayerId, GeneralId>;
  turn: number;
  rng: RngState;
  result: MatchResult | null;
}
```

## Data

Every balance number in the GDD lives in `src/data`:

| File            | Contents                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `units.json`    | Per unit type: cost, endurance, morale, MP, melee, shock, volley, vision, damage modifiers                  |
| `sizes.json`    | Per size: HP, cost multiplier, MP modifier, turning cost, shock multiplier                                  |
| `terrain.json`  | Per terrain: passability, move cost, line of sight, combat modifiers                                        |
| `generals.json` | The three starter generals and their passive buffs                                                          |
| `rules.json`    | Everything else: arc multipliers, morale events, rout and rally values, volley falloff, timers, army budget |

`src/data/index.ts` exports them with types, plus small helpers such as `unitCost`. `src/data/data.test.ts` pins the values the GDD states outright (the cost table, the 960-point default army, the worked combat examples). If a playtest changes a number, change the JSON, the GDD and that test in one pull request.

Notes on how the GDD was transcribed:

- All unit types share HP by size (60 / 100 / 150), so HP is in `sizes.json`, not `units.json`.
- Elevation is a property of each hex (0, 1 or 2), not a terrain type. Its modifiers are under `elevation` in `rules.json`.
- "Cavalry shock ×0.5 and melee ×0.7 in woods" is stored as cavalry-only. This reading is an open question in the GDD.
- The shape of these files is provisional. Change it when a ticket needs to, and keep `data.test.ts` passing.

Maps will be one JSON file each (format to be defined in the first map ticket), stored in odd-r offset coordinates and converted to axial when loaded.

## The client

- Phaser scenes in `src/render` draw the state and animate the events.
- Layout math that does not need Phaser (`src/render/layout.ts`) is kept separate so it can be unit-tested.
- Input turns taps and drags into `Order` objects, asks the engine whether they are legal, and shows the engine's answer. The client does not re-implement rules such as movement range.
- The board should fit the screen with little scrolling, and stay readable at phone size.

The current `BoardScene` is a placeholder that draws an empty 20 × 14 grid.

## Hex grid

- Engine: axial coordinates `(q, r)`, with facings numbered 0–5. See `src/engine/hex.ts`.
- Map files and rectangular loops: odd-r offset `(col, row)`.
- The placeholder uses pointy-top hexes. Orientation is still an open question (see `docs/DECISIONS.md`). The engine math does not depend on it; only the compass names of the six directions and `src/render/layout.ts` do.

## Testing

| Kind             | What it checks                                                                                                                                              | Where                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Unit tests       | One function or one phase                                                                                                                                   | Next to the code, `*.test.ts`   |
| Golden scenarios | A small fixed setup with a known outcome from the GDD, e.g. "a Medium cavalry flank charge plus one round of melee leaves the target Shaken but not routed" | `src/engine`, as they are added |
| Data tests       | The JSON matches the GDD's stated numbers                                                                                                                   | `src/data/data.test.ts`         |
| Purity test      | The engine has no rendering imports, browser globals, clocks or `Math.random`                                                                               | `src/engine/purity.test.ts`     |

Golden scenarios double as balance alarms: when a data file changes, they show which of the GDD's playtest targets moved.

Tests run in Node with no browser. For visual work, run `npm run dev` and look at it, at phone size too.

## Later: AI and online play

- **AI opponent.** The AI is a function from a player's visible view to a list of orders. It lives beside the engine, uses only what that player can see, and can call the engine to simulate outcomes.
- **Online 1v1.** The server runs the same engine, collects both players' orders, resolves the turn, and sends each player only their visible view. The engine must not need changes for this.
