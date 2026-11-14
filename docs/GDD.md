# First-Millennium Tactics — MVP Game Design Doc

Exported 2026-11-14 from the Claude project doc "First-Millennium Tactics — MVP Game Design Doc" (first drafted 2026-11-01), then updated with the decisions made on 2026-11-14. The changes from the original are listed in [Changes from the project doc](#changes-from-the-project-doc) at the end.

This file is the source of truth for the game rules. If code and this doc disagree, one of them has a bug: fix the code, or change the doc in the same pull request.

## Motivation and Target Player

Many war/army simulation games exist. Usually, they tend towards one of two sides: highly realistic simulations (Mount & Blade, Total War…) which have high spec requirements to run, and rely on RTS systems; Overly simplified turn-based systems which either exist as a sub-gameplay (Civilization) or with mechanics that are overly gamified (Fire Emblem, Chess).

For strategy and medieval age game enthusiasts, there is currently no lightweight games that engage historical mechanics of what commanding a large-scale army would be like.

## Overview

A 1v1 hex-based tactics game where each player commands a first-millennium army of infantry, foot archers and cavalry in simultaneous turns. Battles are won by breaking the enemy's cohesion, not by grinding down hit points. Inspirations: Prussian Kriegsspiel (umpired resolution, fog of war), Fire Emblem and Chess (readable boards, direct control), Mount & Blade (weight of a cavalry charge), and _Kingdom_ (generals and sand-table strategy).

**Design pillars**

- **Feel like a commander.** The decisions are about positioning, timing, flanks, managing armies, and when to commit reserves, not micro-managing individual soldiers.
- **Historically grounded.** Morale and cohesion decide battles. Most losses happen once a unit breaks and is pursued. Flank and rear attacks are decisive.
- **Readable and fast.** One unit per hex, Fire Emblem-level control, and a match capped at 25 minutes.

**MVP scope:** 1v1, 3 unit types in 3 sizes (light, medium, heavy), 1 general per side with passive buffs, 2–3 handmade maps, simultaneous turns with phased resolution, fog of war, routing and rallying, chess-style timers. Everything else is in the backlog at the end of this doc.

**MVP opponent (decided 2026-11-14):** pass-and-play on one device first, then an AI opponent. Online 1v1 comes after the MVP. See [Opponent](#opponent).

**Platforms (decided 2026-11-14):** web first (PC and phone browsers), then Google Play and the App Store. See `docs/TECH_STACK.md`.

All numbers in this doc are first-pass values meant for playtesting, not final balance.

## Match flow

A match runs in five stages, from map choice to a decisive result or the 25-minute cap.

1. **Map selection.** The map defines terrain, both deployment zones, the army budget and a default army.
2. **Army building.** Each player spends the budget on units (type and size) and picks one general, or accepts the map's default army. Neither player sees the other's choices.
3. **Deployment.** Players place units and set their facing inside their own deployment zone, simultaneously and hidden from each other.
4. **Turn loop.** Both players issue orders at the same time (1:30 limit), then the engine resolves the turn in fixed phases (see Turn structure). Repeat.
5. **End.** The match ends on one of the conditions in Timers & win conditions.

## Board & terrain

The board is a hex grid. Each hex holds at most one unit, and each unit faces one of the 6 hexsides. Suggested MVP map size: about 20 × 14 hexes.

**Facing arcs.** A unit's facing sets three arcs, and attacks are judged by the arc they come from:

- **Front:** the faced hexside plus the two next to it (3 hexsides).
- **Flank:** the next two hexsides.
- **Rear:** the hexside directly behind.

**Elevation.** Hexes have an elevation level of 0 (plain), 1 or 2 (hill). Mountains are their own impassable terrain.

| Terrain                 | Move cost (MP)                         | Line of sight                                                                         | Combat effect                                                                     |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Open                    | 1                                      | Clear                                                                                 | None                                                                              |
| Woods                   | 2 (cavalry 3)                          | Blocks sight past the first woods hex; units inside are seen only from adjacent hexes | Volleys into woods ×0.5; cavalry shock ×0.5 and melee ×0.7 in woods               |
| Hill (higher elevation) | +1 when moving uphill; normal downhill | Units on higher ground see +2 hexes and over lower obstacles                          | Attacking downhill ×1.2; attacking uphill ×0.8; archers on higher ground +1 range |
| River                   | Impassable                             | Clear (archers can shoot across)                                                      | None                                                                              |
| Mountain                | Impassable                             | Blocks                                                                                | None                                                                              |

Every map must give both sides at least one way around or across a river, so rivers shape the battle without splitting the map in two.

## Units

There are three unit types, each with one defining trait. Each type comes in three sizes. Bigger units hit harder and last longer, but move and turn more slowly.

**Stats every unit has**

- **HP:** permanent strength (men and horses). It scales damage dealt and never regenerates.
- **Endurance (0–100):** cohesion. It acts as a shield in front of HP. At 0, the unit routs.
- **Morale (0–100, starts at 70):** fighting spirit. It scales damage and decides initiative.
- **MP:** movement points per turn.
- **Melee, Shock, Volley, Range, Vision, Ammo:** see the tables in Draft balance tables.

**Type traits**

- **Infantry — shield wall.** Takes 40% less damage from attacks into its front arc (melee, shock and volleys).
- **Foot archers — volleys.** Attack from 2–4 hexes away with limited ammo. Weak in melee, and they take ×1.25 melee damage.
- **Cavalry — speed and shock.** Twice the infantry's MP, which lets it reach flanks, plus the strongest shock. No frontal protection. Shock is halved when charging an infantry unit's front arc, into woods, or uphill.

**Size effects**

| Size   | HP  | Cost multiplier | MP modifier | Turning cost per hexside | Shock multiplier |
| ------ | --- | --------------- | ----------- | ------------------------ | ---------------- |
| Small  | 60  | ×0.6            | +1          | 0 MP                     | ×0.7             |
| Medium | 100 | ×1.0            | 0           | 0.5 MP                   | ×1.0             |
| Large  | 150 | ×1.5            | −1          | 1 MP                     | ×1.3             |

No unit spans more than one hex in the MVP. The Large cap keeps big armies built as several adjacent units, which preserves flanking.

## Army building & generals

Each player spends a points budget (default 1,000, set per map) on up to 10 units, then picks one general. Unit cost = the type's base cost × the size's cost multiplier.

| Type         | Base cost (Medium) | Small | Large |
| ------------ | ------------------ | ----- | ----- |
| Infantry     | 100                | 60    | 150   |
| Foot archers | 90                 | 54    | 135   |
| Cavalry      | 160                | 96    | 240   |

**Example default army (960 pts):** 4 Medium infantry, 1 Small infantry, 2 Medium archers, 2 Medium cavalry.

**Generals.** The general is a passive buff for the whole army and does not appear on the board in the MVP. Three starter generals:

| General      | Style      | Passive buffs                                                                     |
| ------------ | ---------- | --------------------------------------------------------------------------------- |
| The Vanguard | Aggressive | Shock +15%; cavalry start with morale 80                                          |
| The Bulwark  | Defensive  | Infantry front damage reduction 50% (instead of 40%); endurance regen +3 per turn |
| The Marksman | Ranged     | Archers +1 range and +2 ammo                                                      |

General names and buffs are placeholders. In the backlog, generals become units on the board with a command radius.

## Turn structure

Both players give orders at the same time, then the engine resolves everything in fixed phases. Within a phase, all effects are calculated first and applied together, so acting order never gives an advantage.

**Orders (one per unit)**

- **Move:** a path plus a final facing. Moving into an enemy-adjacent hex ends movement. If the unit moved far enough, this counts as a charge (see Shock).
- **Hold:** stay in place; rotating is allowed.
- **Volley (archers only):** shoot a target hex in range. Allowed after moving at most 1 hex.
- **Disengage (engaged units only):** step 1 hex away from the enemy, at a morale cost.

Units without a new order when the turn timer expires repeat their last order. Engaged units stay engaged.

**Resolution phases**

1. **Rout movement.** Routing units flee automatically.
2. **Movement.** Moves happen in ticks of 1 MP, so faster units cover more ground and reach flanks first. If two units want the same hex in the same tick, initiative decides: higher morale moves first, then the smaller unit (fewer HP), then a seeded random roll. The loser stops in its previous hex.
3. **Volleys.** All archers fire at once.
4. **Shock.** Units that charged into contact this turn apply their shock damage.
5. **Melee.** Every engaged unit attacks one enemy, either the one it charged or the one in its front arc. A unit hit from several sides still strikes back at only one of them, which is what makes flanking pay.
6. **Morale & status.** Routs trigger, morale events apply, rallies are checked and endurance regenerates.
7. **Visibility.** Fog of war updates for both players.

## Combat model

Damage hits endurance first. While endurance holds, only a small "bleed" share reaches HP. Once a unit breaks, damage goes straight to HP. This reproduces how ancient battles went: long, low-casualty pressure, then collapse and slaughter.

**Damage formula (melee and volleys)**

```text
D = Atk × (HP_attacker / 100) × M_arc × M_terrain × M_morale × M_general × (1 − R_front) × U(0.85, 1.15)
```

- **Atk:** the unit's Melee or Volley value.
- **M_arc:** front ×1.0, flank ×1.5, rear ×2.0.
- **M_terrain:** from the terrain table (uphill, downhill, woods), multiplied together.
- **M_morale:** 0.75 + morale / 200. That gives ×0.75 at morale 0, ×1.0 at 50 and ×1.25 at 100.
- **R_front:** the defender's front damage reduction, applied only to front-arc hits (infantry 0.40, others 0).
- **U(0.85, 1.15):** a seeded random spread of ±15%.

**Where damage lands**

| Unit state                    | To endurance  | To HP                                              |
| ----------------------------- | ------------- | -------------------------------------------------- |
| Steady (endurance > 0), melee | 100% of D     | 10% of D                                           |
| Steady, volley                | 100% of D     | 5% of D                                            |
| Steady, shock                 | 100% of shock | 20% of shock                                       |
| Routing                       | —             | 100% of D, always resolved as a rear attack (×2.0) |

**Shock.** A unit that moved at least 1 hex (infantry) or 2 hexes (cavalry) before making contact deals one-time shock damage that turn:

```text
S = Shock_type × M_size × M_arc × M_general × (1 − R_front)
```

Cavalry shock is ×0.5 when charging an infantry unit's front arc, into woods, or uphill. These penalties stack.

**Volleys.** These need line of sight and range 2–4 (+1 from higher ground), and cost 1 ammo each. Range falloff: 2 hexes ×1.0, 3 hexes ×0.8, 4 hexes ×0.6. Into woods ×0.5. Friendly units do not block volleys; woods, mountains and higher hills do.

**Worked example.** A Medium infantry unit (Melee 20, morale 70) attacks another infantry unit's front on open ground: 20 × 1.0 × 1.0 × 1.1 × 0.6 ≈ 13 endurance and about 1.3 HP per turn. The defender breaks in about 8 turns. The same attack into the flank deals 20 × 1.5 × 1.1 = 33 per turn and breaks it in about 3 turns.

## Morale, engagement, rout & rally

Units commit by engaging, break when endurance runs out, and can recover if left alone. Morale is the army's mood across the battle. Endurance is a unit's cohesion in the current fight.

**Engagement.** A unit is engaged when it is adjacent to an enemy and either side has it in its front arc, or when it fought in melee this turn. Engaged units have 1 MP, which is only enough to rotate one hexside or disengage.

**Disengage.** The unit steps 1 hex away into a hex that is not adjacent to an enemy, and loses 10 morale.

**Morale events**

| Event                                       | Morale change |
| ------------------------------------------- | ------------- |
| A friendly unit routs within 2 hexes        | −10           |
| A friendly unit is destroyed within 3 hexes | −10           |
| Disengaging                                 | −10           |
| Attacked in the flank this turn             | −5            |
| Attacked in the rear this turn              | −10           |
| An adjacent enemy unit routs                | +10           |

**Endurance regen.** Units gain +5 endurance per turn if they were neither engaged nor shot that turn, and none if their morale is below 25.

**Rout.** A unit routs when its endurance reaches 0 or its HP drops below 20% of its starting HP. A routing unit:

- leaves the player's control;
- flees automatically with MP −1 (minimum 1), away from the nearest visible enemy and toward its own deployment edge;
- does not attack, unless it is cornered and cannot move, in which case it deals ×0.25 damage;
- takes all damage straight to HP, always as a rear attack (×2.0);
- is removed from the match if it leaves the map. Its remaining HP counts as lost.

**Rally.** A routing unit that goes 2 consecutive turns without being attacked or shot rallies at the end of the turn. It returns at endurance 30 and morale 40, under player control from the next turn.

## Fog of war & visibility

You only see enemies inside at least one of your units' vision range and line of sight. What you can see of an enemy is approximate.

- **Vision range:** infantry 4 hexes, archers 5, cavalry 6 (cavalry are the natural scouts). Higher ground adds +2.
- **Line of sight:** blocked by mountains, by hexes of higher elevation, and by woods beyond the first woods hex. Units inside woods are seen only from adjacent hexes.
- **What you see of an enemy:** its type, size, facing, and whether it is routing. Endurance shows only as a band: Fresh (above 66), Worn (33–66), Shaken (below 33). HP is hidden.
- **Last-known markers:** when an enemy leaves your vision, a ghost marker stays at its last seen hex, showing the turn it was seen.
- **Before the battle:** army composition and deployment are hidden from the opponent.

## Timers & win conditions

Three timers keep a match under 25 minutes. The model is Pokémon Champions' turn, player and match timers.

| Timer  | Length                    | Counts during                           | When it runs out                                                              |
| ------ | ------------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| Turn   | 1:30                      | Each order phase                        | Units without a new order repeat their last order; engaged units stay engaged |
| Player | 10:00 for the whole match | Only while that player is giving orders | That player loses                                                             |
| Match  | 25:00                     | The whole match, from deployment onward | The match is decided by remaining strength (below)                            |

**Win conditions, checked at the end of every turn**

1. **Decisive victory:** every enemy unit is destroyed, has left the map, or is routing.
2. **Player timer:** a player whose 10:00 runs out loses.
3. **Match timer:** at 25:00, the higher remaining HP% wins. HP% is current HP across all units divided by starting HP; destroyed and fled units count as 0.
4. **Tiebreaker:** if HP% is equal, the higher total remaining endurance % wins. If still tied, the match is a draw.

## Draft balance tables

Base stats for Medium units. Apply the size modifiers from Units for Small and Large. These are starting points to tune in playtests, kept in data files rather than code.

| Stat                   | Infantry | Foot archers | Cavalry |
| ---------------------- | -------- | ------------ | ------- |
| HP                     | 100      | 100          | 100     |
| Endurance              | 100      | 100          | 100     |
| Starting morale        | 70       | 70           | 70      |
| MP                     | 3        | 3            | 6       |
| Melee (Atk)            | 20       | 6            | 16      |
| Shock                  | 12       | 0            | 30      |
| Volley (Atk)           | —        | 8            | —       |
| Range (hexes)          | —        | 2–4          | —       |
| Ammo (volleys)         | —        | 6            | —       |
| Vision (hexes)         | 4        | 5            | 6       |
| Front damage reduction | 40%      | 0%           | 0%      |
| Melee damage taken     | ×1.0     | ×1.25        | ×1.0    |
| Cost (pts)             | 100      | 90           | 160     |

**Targets to check in playtests**

- A frontal infantry clash should take about 6–10 turns to break one side. A flank attack should break it in about 3.
- A Medium cavalry charge into a flank (30 × 1.5 = 45 endurance) plus one round of melee should leave the target Shaken but not routed.
- Archers should be able to wear a unit down to Worn over their 6 volleys, but not break it alone.
- A typical match should reach a decision in about 15–20 turns, inside the 25-minute cap.

## Visual direction

Decided 2026-11-14.

- Top-down view of the battlefield.
- Very simple graphics. What matters is that the board is easy to understand and looks minimally neat.
- Little scrolling: the player should see the whole battlefield, or close to it, at once.

## Opponent

Decided 2026-11-14. This closes the open question "MVP opponent: hotseat, online 1v1, or a basic AI?".

1. **Pass-and-play on one device** comes first. Each player enters orders in turn with the other's orders hidden, then the turn resolves. It needs no AI and no server, and it is enough to playtest the rules.
2. **AI opponent** is the MVP's single-player mode. Chess-style search does not carry over directly, because turns are simultaneous and every unit moves each turn, so the number of combinations explodes. The planned approach is a scoring AI: each unit rates its possible orders (threat, target value, terrain, support from neighbors) under a simple army-level plan. Because the engine is deterministic, the AI can later simulate a few turns ahead, and AI-vs-AI matches can be run in bulk to check balance.
3. **Online 1v1** comes after the MVP. Hidden simultaneous orders need a server that resolves each turn, so no client can peek at the other's orders. The rules engine must not need changes for this.

## Implementation notes for Claude Code

Build the rules as a pure, deterministic engine, separate from rendering. That makes simultaneous turns, testing, replays and later netplay or AI much easier. `docs/ARCHITECTURE.md` has the details; `docs/TECH_STACK.md` has the tools.

**Architecture**

- **Rules engine (pure TypeScript):** `resolveTurn(state, ordersA, ordersB, seed) → { newState, events[] }`, with one function per resolution phase. No rendering or timers inside.
- **Seeded RNG:** every random roll comes from a seed stored in the match state, so a match can be replayed exactly and tests are deterministic.
- **Data files:** `units.json`, `sizes.json`, `terrain.json`, `generals.json`, `rules.json` and one JSON file per map. All numbers in this doc live there, not in code.
- **Hex math:** axial coordinates. [Red Blob Games' hex grid guide](https://www.redblobgames.com/grids/hexagons/) is the standard reference for neighbors, distance, line of sight and pathfinding.
- **Client:** Phaser 4 as the 2D renderer, plus an order-input UI and a visibility filter that only draws what the active player can see.
- **Event log:** the engine emits events (moved, volleyed, charged, routed, rallied), and the client animates them in phase order.

**Suggested build order**

1. Hex grid, map loading from JSON, terrain rendering.
2. Units, facing, movement with MP, terrain costs and turning costs.
3. Order input, plus simultaneous resolution of movement ticks with initiative, in pass-and-play mode on one device.
4. Combat: arcs, volleys, shock, melee, endurance and HP.
5. Morale events, engagement, disengage, rout and rally.
6. Fog of war and last-known markers.
7. Army builder, generals and default armies.
8. Timers and win conditions.
9. AI opponent (scoring AI).
10. Mobile packaging for the stores.

`docs/BACKLOG.md` turns this order into milestones and tickets.

**Testing:** unit tests per phase, plus "golden" scenarios: small fixed setups with known expected outcomes, such as "cavalry flank charge leaves the target Shaken". They catch balance regressions whenever the data files change.

## Post-MVP backlog & open questions

**Backlog (deliberately left out of the MVP)**

- Online 1v1, with a server that resolves turns.
- Generals on the board, with a command radius, delayed orders outside it, and a morale shock if the general falls.
- Formations that link adjacent units so they move together, in place of multi-hex units.
- Fords and bridges as river crossings and chokepoints.
- A free strike against a disengaging unit, on top of the morale cost.
- Rout contagion beyond the morale hit (a nearby rout can trigger a rout check).
- More unit types: skirmishers, heavy infantry, heavy cavalry, horse archers, chariots.
- Active general abilities with limited uses per battle.
- Weather, time of day, ammo resupply, campaigns, replays.

**Open questions**

From the original doc:

- Scale: how many meters per hex and minutes per turn, if any, should be stated to players?
- Should players see the opponent's general before deployment?
- Final map size, and how many maps ship with the MVP?
- Cap the number of turns as well as the 25-minute timer?

Added on 2026-11-14 while setting up the repo:

- **Size names.** The MVP scope says "light, medium, heavy"; the size table and everything after it say Small, Medium, Large. Which names does the game use? The data files use `small`, `medium`, `large` until this is settled.
- **Hex orientation.** Pointy-top or flat-top hexes? It changes which six directions a unit can face and whether battle lines run straight along rows or columns. The placeholder board uses pointy-top.
- **Phone orientation.** Landscape only, or portrait too? A 20 × 14 board that fits a phone in portrait has very small hexes.
- **Timers outside online play.** Do the turn, player and match timers apply in pass-and-play and against the AI, or only online?
- **Woods melee penalty.** "Cavalry shock ×0.5 and melee ×0.7 in woods" is read as applying to cavalry only. Confirm, or should every unit's melee be ×0.7 in woods?

## Changes from the project doc

What differs from the Claude project doc as it stood on 2026-11-14:

- Added the MVP opponent and platform lines to the Overview, and the new Opponent and Visual direction sections.
- Implementation notes: the client is now Phaser 4 (was "for example Phaser or PixiJS"); `rules.json` added to the data files; build order step 3 says pass-and-play (was "hotseat"), step 9 is the AI opponent (was "online play or a simple AI"), and step 10 (mobile packaging) is new. The tip about exporting the doc to the repo was removed, since this file is that export.
- Backlog: online 1v1 added as the first item.
- Open questions: the opponent question was removed (now decided), and five questions were added.
- Formulas are written as plain text.

Rules, numbers and tables are unchanged.
