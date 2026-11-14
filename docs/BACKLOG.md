# Backlog

Milestones follow the build order in `docs/GDD.md`. The first four milestones have draft tickets written in the issue template's format, ready to paste into GitHub issues and edit. Later milestones are outlines to turn into tickets when they get close.

Ticket ids here (`B-01`, …) are placeholders. GitHub assigns the real issue numbers.

## Milestones

| #   | Milestone                        | Outcome                                                               |
| --- | -------------------------------- | --------------------------------------------------------------------- |
| M0  | Foundations                      | Every merge publishes a playable link; orientation questions settled  |
| M1  | Board                            | Maps load from files and draw with terrain; the camera fits the board |
| M2  | Units & movement                 | Units on the board with facing; legal moves shown                     |
| M3  | Orders & simultaneous resolution | Two players on one device give move orders and watch them resolve     |
| M4  | Combat                           | Arcs, volleys, shock, melee, endurance and HP                         |
| M5  | Morale, rout & rally             | Engagement, disengage, morale events, rout, rally                     |
| M6  | Fog of war                       | Vision, line of sight, last-known markers                             |
| M7  | Armies & generals                | Army builder, generals, default armies, deployment                    |
| M8  | Timers & win conditions          | Three timers, victory checks, end-of-match screen                     |
| M9  | AI opponent                      | Single-player against a scoring AI; AI-vs-AI runs for balance         |
| M10 | Mobile packaging                 | Android and iOS builds through Capacitor; store accounts and testing  |
| —   | After the MVP                    | Online 1v1, and the post-MVP backlog in the GDD                       |

The first full playtest of the rules is possible at the end of M5 (pass-and-play, no fog). Until M7, matches use each map's default army and a fixed starting layout stored in the map file.

## Rules gaps to settle

Spotted while reading the GDD for these tickets. Each needs a design decision before the ticket that depends on it. Raise them as Design question issues.

| Gap                                                                                                                                                                            | Needed by |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| **Hex orientation**: pointy-top or flat-top?                                                                                                                                   | B-02      |
| **Phone orientation**: landscape only, or portrait too?                                                                                                                        | B-02      |
| **Size names**: Small / Medium / Large, or Light / Medium / Heavy?                                                                                                             | B-07      |
| **Turning cost**: is it charged only for the difference between starting and final facing, or for every change of direction along the path? Must a unit face the way it moves? | B-09      |
| **Rotating on Hold**: does it use the same turning cost, and is there a limit?                                                                                                 | B-11      |
| **Crossing paths**: can two units swap hexes or pass through each other in the same tick? Can a unit pass through a friendly unit's hex?                                       | B-13      |
| **Contact during movement**: if an enemy moves next to a unit mid-turn, does that unit stop at once, and does it still count as charging?                                      | B-13      |
| **Tick accounting**: is a hex that costs 2 or 3 MP entered on the tick when its full cost has been paid?                                                                       | B-13      |
| **Volley at a hex the target left**: movement resolves before volleys. Does the volley miss, or follow the unit?                                                               | M4        |
| **Melee target**: when several enemies are in a unit's front arc, which one does it attack?                                                                                    | M4        |
| **Woods melee penalty**: cavalry only, or every unit?                                                                                                                          | M4        |
| **Rout direction** when no enemy is visible, and when the path to its own edge is blocked.                                                                                     | M5        |
| **Timers** in pass-and-play and against the AI: on or off?                                                                                                                     | M8        |

---

## M0 — Foundations

### B-01 Publish a playable link on every merge

**User story.** As the designer, I want every merge to `main` to publish the game to a public link, so that I can test on my iPhone and share playtests without installing anything.

**Context.** `docs/TECH_STACK.md` → Playtest link. `vite.config.ts` already builds with relative paths.

**Acceptance criteria**

- [ ] A GitHub Actions workflow builds the game and publishes it to GitHub Pages on every push to `main`.
- [ ] The workflow does not publish if type-check, tests or build fail.
- [ ] The link opens the board on desktop Chrome and on iPhone Safari.
- [ ] "Add to Home Screen" on iPhone opens the game full-screen, with a name and icon.
- [ ] `README.md` shows the link.

**Out of scope.** Custom domain, offline support, preview links per pull request.

**Note.** GitHub Pages must be switched on once in the repository settings (Settings → Pages → Source: GitHub Actions). This is a manual step for the owner.

### B-02 Decide hex and phone orientation

**User story.** As the designer, I want to see the board in both hex orientations on a real phone, so that I can choose the one that reads best before anything is built on it.

**Context.** `docs/DECISIONS.md` → Provisional. Type: design question with a small spike.

**Acceptance criteria**

- [ ] The placeholder board can be switched between pointy-top and flat-top (a temporary toggle is fine).
- [ ] Screenshots of both at 844 × 390 (phone landscape), 390 × 844 (phone portrait) and 1280 × 720 are attached to the issue, with the hex size in pixels for each.
- [ ] The owner records the decision on hex orientation and on whether portrait is supported.
- [ ] `docs/GDD.md` and `docs/DECISIONS.md` are updated, and the toggle is removed.

**Out of scope.** Terrain, units, camera controls.

---

## M1 — Board

### B-03 Map file format and loader

**User story.** As the designer, I want maps stored as data files, so that I can add or change a battlefield without touching code.

**Context.** GDD → Match flow (a map defines terrain, deployment zones, budget, default army), Board & terrain. Engine and data only; no drawing.

**Acceptance criteria**

- [ ] A documented JSON map format holds: id, name, width, height, terrain and elevation (0–2) for every hex, a deployment zone per player, the army budget, and a default army with a starting layout per player.
- [ ] The engine loads a map file into a typed `GameMap` with lookups by hex: terrain, elevation, whether the hex is on the map.
- [ ] Loading rejects a bad map with a clear message: unknown terrain, wrong number of hexes, elevation outside 0–2, a missing or empty deployment zone, a default army over budget or over 10 units, a starting unit on an impassable hex or outside its deployment zone.
- [ ] Loading rejects a map where impassable terrain cuts one deployment zone off from the other (GDD: every map must give both sides a way around or across a river).
- [ ] The map format is described in `docs/ARCHITECTURE.md`.

**Worked examples**

- A 4 × 3 all-open map with two deployment zones loads, and every hex reports terrain `open`, elevation 0.
- The same map with a full column of river between the zones is rejected with a "zones are not connected" message.
- The same river column with one open hex in it loads.

**Out of scope.** Drawing, a map editor, more than a tiny test map.

### B-04 Draw terrain and elevation

**User story.** As a player, I want to tell open ground, woods, hills, rivers and mountains apart at a glance, so that I can read the battlefield.

**Context.** GDD → Board & terrain, Visual direction. Depends on B-03.

**Acceptance criteria**

- [ ] The board draws a loaded map: each terrain type has its own color and a simple symbol or pattern, so they are distinguishable without relying on color alone.
- [ ] Elevation 0, 1 and 2 are visibly different (for example by shade), and a hill reads as higher than the plain next to it.
- [ ] Impassable terrain (river, mountain) clearly looks impassable.
- [ ] The whole map is readable at 844 × 390 and at 1280 × 720.
- [ ] Colors and symbols are defined in one place in `src/render`.

**Out of scope.** Art assets, animation, units.

### B-05 Camera and hex selection

**User story.** As a player, I want to see the whole battlefield with little scrolling and tap a hex to learn what it is, so that I always know what I am looking at.

**Context.** GDD → Visual direction. Depends on B-04.

**Acceptance criteria**

- [ ] On load, the camera fits the whole map on screen, on desktop and phone.
- [ ] The player can zoom in (pinch on touch, wheel on desktop) and drag to pan, and cannot zoom out past the whole map or pan the map off screen.
- [ ] Tapping or clicking a hex highlights it and shows its terrain, elevation and movement cost.
- [ ] Converting a screen position to a hex is a pure function with unit tests, including positions near hex edges and outside the map.
- [ ] A tap is not mistaken for a drag, and a drag does not select a hex.

**Out of scope.** Units, orders.

### B-06 First handmade map

**User story.** As the designer, I want one real 20 × 14 battlefield, so that later tickets have something to play on.

**Context.** GDD → Board & terrain (about 20 × 14; 2–3 handmade maps in the MVP). Depends on B-03.

**Acceptance criteria**

- [ ] One 20 × 14 map with open ground, at least one woods area, one hill with both elevation levels, and one river that leaves a way around.
- [ ] Deployment zones on opposite edges, a 1,000-point budget, and the GDD's example default army (4 Medium infantry, 1 Small infantry, 2 Medium archers, 2 Medium cavalry) for both sides, with a starting layout.
- [ ] The map passes the loader's checks and is the map the game opens with.
- [ ] The owner has reviewed the layout on screen.

**Out of scope.** The second and third maps.

---

## M2 — Units & movement

### B-07 Unit model and match setup

**User story.** As the designer, I want units created from the data files, so that a unit's stats always match the GDD tables.

**Context.** GDD → Units, Draft balance tables. `docs/ARCHITECTURE.md` → Suggested data model. Engine only.

**Acceptance criteria**

- [ ] The engine has typed `Unit` and `MatchState` models, and a function that creates the starting state from a map and its default armies.
- [ ] A new unit's stats come from `src/data`: HP from its size, endurance 100, morale 70, MP from its type plus its size modifier, ammo for archers.
- [ ] One hex holds at most one unit; setup rejects two units on the same hex.
- [ ] The state is plain data: it survives being saved to JSON and loaded back unchanged.

**Worked examples**

- Small / Medium / Large infantry start with 60 / 100 / 150 HP and 4 / 3 / 2 MP.
- Small / Medium / Large cavalry have 7 / 6 / 5 MP.
- Medium archers start with 6 ammo; infantry and cavalry have none.

**Out of scope.** Generals' buffs (M7), drawing.

### B-08 Facing and arcs

**User story.** As a player, I want attacks from the side and behind to count differently from the front, so that positioning matters.

**Context.** GDD → Board & terrain → Facing arcs. Engine only.

**Acceptance criteria**

- [ ] Given a unit's facing and the position of an adjacent hex, the engine returns `front`, `flank` or `rear`.
- [ ] Front is the faced hexside plus the two next to it; flank is the next two; rear is the one directly behind.
- [ ] For a non-adjacent attacker (a volley), the engine returns the arc the shot arrives from, with a documented rule for shots that arrive exactly between two hexsides.

**Worked examples** (directions numbered 0–5 clockwise; a unit facing direction 0)

- An enemy in direction 0, 1 or 5 is in the front arc.
- An enemy in direction 2 or 4 is in the flank arc.
- An enemy in direction 3 is in the rear arc.
- The same holds for every facing, by rotation.

**Out of scope.** Damage.

### B-09 Movement range and paths

**User story.** As a player, I want to see where a unit can move this turn, so that I can plan around terrain.

**Context.** GDD → Board & terrain (move costs), Units (size effects), Turn structure (Move order). Engine only. Blocked by the turning-cost design question.

**Acceptance criteria**

- [ ] Given a unit, the engine returns every hex it can reach this turn and a cheapest path to each.
- [ ] Move costs follow the terrain table: open 1; woods 2 (cavalry 3); +1 for each step uphill; downhill normal; river and mountain impassable.
- [ ] Turning costs follow the size table (0 / 0.5 / 1 MP per hexside), applied as decided in the design question.
- [ ] A unit cannot enter or pass through an occupied hex.
- [ ] Moving into a hex next to an enemy ends the move.
- [ ] The engine can check whether a given path and final facing is a legal Move order, with a reason when it is not.

**Worked examples** (no turning)

- A Medium infantry unit (3 MP) on open ground reaches hexes up to 3 steps away.
- The same unit can enter one woods hex (2 MP) and then one open hex (1 MP), but not two woods hexes.
- A Medium cavalry unit (6 MP) can enter two woods hexes (3 MP each) and no more.
- A step from elevation 0 to an open hex at elevation 1 costs 2 MP.
- A unit next to a river cannot cross it, whatever its MP.
- A unit that steps next to an enemy stops there, even with MP left.

**Out of scope.** Simultaneous resolution, charges.

### B-10 Draw units and movement range

**User story.** As a player, I want to see each unit's side, type, size and facing, and where a selected unit can go, so that the board is readable.

**Context.** GDD → Visual direction, Units. Depends on B-07 and B-09.

**Acceptance criteria**

- [ ] Each unit is a simple token showing its owner (color plus a second cue such as shape or border), its type (symbol), its size, and its facing.
- [ ] The player's own units show endurance and HP at a glance.
- [ ] Tapping a unit selects it and highlights the hexes it can reach; tapping elsewhere deselects.
- [ ] Tokens are readable and tappable at 844 × 390: no token is smaller than a comfortable touch target when the whole map is on screen, or the camera zooms to make it so.

**Out of scope.** Giving orders, enemy fog.

---

## M3 — Orders & simultaneous resolution

### B-11 Orders model and validation

**User story.** As the designer, I want orders to be data that the engine checks, so that the client, the AI and later the server all give orders the same way.

**Context.** GDD → Turn structure → Orders. Engine only. This milestone covers Move and Hold; Volley and Disengage arrive in M4 and M5.

**Acceptance criteria**

- [ ] Typed Move and Hold orders: Move is a path plus a final facing; Hold keeps the unit in place and may rotate it.
- [ ] The engine validates a player's set of orders: at most one per unit, only for that player's own controllable units, each legal by B-09's rules. Invalid orders come back with a reason.
- [ ] A unit with no order this turn repeats its last order if it is still legal, and otherwise holds.

**Out of scope.** Volley, Disengage, timers.

### B-12 Give orders on the board

**User story.** As a player, I want to give each unit a move and a final facing with a few taps, so that planning a turn is quick.

**Context.** GDD → Turn structure, Design pillars (readable and fast). Depends on B-10 and B-11.

**Acceptance criteria**

- [ ] With a unit selected, tapping a reachable hex sets a Move order along the engine's path and shows it as an arrow.
- [ ] The player can choose the final facing, and can rotate a unit in place as a Hold order.
- [ ] The player can change or clear a unit's order before confirming the turn.
- [ ] Units with and without orders are visibly different, and a "Confirm orders" button ends the player's planning.
- [ ] The whole flow works by touch at 844 × 390.

**Out of scope.** Resolution, the second player.

### B-13 Resolve movement simultaneously

**User story.** As a player, I want both armies to move at the same time, with faster units arriving first, so that neither side gains from moving second.

**Context.** GDD → Turn structure → Resolution phases → Movement. Engine only. Blocked by the crossing-paths, contact and tick-accounting design questions.

**Acceptance criteria**

- [ ] `resolveTurn` takes the state and both players' orders and returns a new state and an ordered list of events, without modifying the input.
- [ ] Movement runs in ticks of 1 MP, so a unit with more MP covers more ground in the same turn.
- [ ] When two units want the same hex in the same tick, initiative decides: higher morale first, then the smaller unit (fewer HP), then a seeded random roll. The loser stops in its previous hex.
- [ ] A unit that moves next to an enemy stops.
- [ ] The same state, orders and seed always give the same result.
- [ ] Events record each step, stop and blocked move, in order.

**Worked examples**

- Two units one hex apart on either side of an empty hex both order a move into it. The one with morale 80 gets it; the one with morale 70 stays put.
- Same setup, equal morale, one Small and one Large unit: the Small unit gets the hex.
- Same setup, equal morale and size: the winner is decided by the seed, and re-running with the same seed gives the same winner.
- A cavalry unit and an infantry unit are each 3 open steps from the same hex: both arrive on tick 3, so initiative decides.
- A cavalry unit is 2 open steps from a hex. An infantry unit is also 2 steps away, but its first step is a woods hex (2 MP). The cavalry arrives first and takes the hex; the infantry stops in the woods.
- A cavalry unit ordered 6 open steps and an infantry unit ordered 3 open steps, on paths that never meet, both finish their full moves in the same turn.

**Out of scope.** Combat, rout movement, fog.

### B-14 Pass-and-play turn loop

**User story.** As two players sharing one device, we want to give orders in secret and then watch the turn play out, so that we can playtest the game together.

**Context.** GDD → Opponent, Match flow → Turn loop. Depends on B-12 and B-13.

**Acceptance criteria**

- [ ] Player A plans and confirms, a hand-over screen hides the board, then Player B plans and confirms.
- [ ] While one player plans, the other player's orders for this turn are not shown.
- [ ] After both confirm, the turn resolves and the events play back as animation in order, then the next turn starts.
- [ ] The current turn number and whose turn it is to plan are always visible.
- [ ] A match can be restarted from the starting layout.

**Out of scope.** Fog of war (both armies are visible until M6), timers, win conditions.

---

## M4 — Combat (outline)

GDD → Combat model, Draft balance tables.

- Damage formula for melee and volleys, with every multiplier taken from data and the ±15% spread from the seeded RNG.
- Where damage lands: endurance first, with the bleed share to HP (melee 10%, volley 5%, shock 20%).
- Volley order: range 2–4, line of sight, ammo, falloff, at most 1 hex moved first.
- Shock: charge distance (1 hex infantry, 2 cavalry), size and arc multipliers, cavalry penalties that stack.
- Melee phase: one target per unit; a unit hit from several sides strikes back at one.
- Elevation and woods modifiers.
- Combat events and their animation; damage numbers or bands shown to the player.
- Golden scenarios for the GDD's playtest targets: frontal infantry clash breaks a side in about 6–10 turns; a flank attack in about 3; a Medium cavalry flank charge plus one round of melee leaves the target Shaken but not routed; archers wear a unit down to Worn over 6 volleys but do not break it alone.

## M5 — Morale, rout & rally (outline)

GDD → Morale, engagement, rout & rally.

- Engagement: when a unit counts as engaged, and the 1 MP limit.
- Disengage order and its morale cost.
- Morale events table.
- Endurance regeneration and its conditions.
- Rout triggers, automatic rout movement, damage to routing units, cornered units, leaving the map.
- Rally after 2 quiet turns.
- First full rules playtest in pass-and-play.

## M6 — Fog of war (outline)

GDD → Fog of war & visibility.

- Vision range by type, plus the higher-ground bonus.
- Line of sight: mountains, higher elevation, woods.
- What a player sees of an enemy: type, size, facing, routing, endurance band; HP hidden.
- Last-known ghost markers.
- The client draws only the active player's view; pass-and-play hand-over hides the rest.

## M7 — Armies & generals (outline)

GDD → Army building & generals, Match flow.

- Army builder: budget, up to 10 units, costs by type and size.
- The three starter generals and their buffs applied in the engine.
- Hidden, simultaneous deployment inside each player's zone.
- Map selection, and the second and third maps.

## M8 — Timers & win conditions (outline)

GDD → Timers & win conditions.

- Turn, player and match timers in the client; the engine only receives orders.
- Turn timer expiry: units without a new order repeat their last one.
- Decisive victory, player-timer loss, match-timer result by HP%, endurance tiebreaker, draw.
- End-of-match screen.

## M9 — AI opponent (outline)

GDD → Opponent.

- An AI interface: visible view in, orders out.
- Scoring AI: each unit rates its possible orders (threat, target value, terrain, support) under a simple army plan.
- Single-player mode against the AI.
- A command-line runner that plays many AI-vs-AI matches and reports results, for balance checks.
- Optional: look a turn or two ahead using the engine.

## M10 — Mobile packaging (outline)

`docs/TECH_STACK.md` → Route to the stores.

- Add Capacitor; app name, icons, splash screen, screen orientation.
- Android build on PC; internal test on a real device.
- Google Play account and the closed test (12 testers for 14 days on a new personal account).
- iOS build on a cloud Mac; Apple Developer account; TestFlight.
- Store listings and screenshots.

## After the MVP

- Online 1v1: a server that runs the same engine and resolves turns.
- The post-MVP backlog in `docs/GDD.md`.
