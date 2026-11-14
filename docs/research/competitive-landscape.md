# Competitive landscape — takeaways

Background for design and UI decisions, not requirements. Summarized from competitor research done on 2026-11-02. Sales and install figures in that research were third-party estimates, so only the qualitative points are kept here. The recommendations are suggestions; decisions are recorded in `docs/DECISIONS.md`.

## Where FMT sits

FMT aims to be historically grounded like the hardcore wargames, fast and readable like mobile tactics games, and 1v1 with simultaneous turns.

| Game                                                     | What it shows                                                                                                                                                                     |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Field of Glory II (PC)                                   | The benchmark for historical depth in ancient tactics. Players praise its depth and criticize clunky rules, a steep learning curve and slow battles. Multiplayer is asynchronous. |
| HexWar / Hunted Cow _Ancient Battle_ series (mobile, PC) | The closest match on platforms. Criticised as repetitive, and on phones the hex field is so crowded that selecting the right unit is hard.                                        |
| Kingdom: Hadou (mobile, Japan)                           | Shows appetite for the _Kingdom_ theme, but it is a gacha strategy game, not a tactics duel.                                                                                      |
| The Battle of Polytopia (mobile, PC)                     | Shows that lightweight turn-based strategy works on both mobile and PC.                                                                                                           |
| Frozen Synapse (PC, iPad)                                | Simultaneous turns working at indie scale. Its multiplayer was asynchronous, so players could run several matches at once.                                                        |
| Atlas Reactor (PC)                                       | A simultaneous-turn live PvP game that shut down after under three years.                                                                                                         |
| Total War: Arena (PC)                                    | Antiquity-era team battles that closed in beta. Players wanted to be the sole commander, which supports FMT's one-general design.                                                 |
| Total War Battles: KINGDOM; Hero Academy 1 & 2           | Cross-platform PvP tactics games that could not keep enough concurrent players and shut down.                                                                                     |

## What this means for FMT

1. **Depending on live PvP is the biggest risk.** Almost every game above that needed two players online at once shut down. This is why the MVP has pass-and-play and an AI opponent before any online mode. If online play is added later, an asynchronous mode is worth considering; it would need its own timer rules.
2. **The design gap looks real.** Deep but slow on one side, shallow or gacha on the other.
3. **Prove the phone UI early.** Cramped hexes were the most consistent complaint about mobile wargames. Test a 20 × 14 board with facing and fog on a real phone before adding content.
4. **Avoid a free-to-play live service.** The survivors were premium or lightly monetized.
5. **Size expectations to a niche.** Historical tactics is a small market, which argues against server-heavy infrastructure at launch.
