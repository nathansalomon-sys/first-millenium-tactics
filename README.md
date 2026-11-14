# first-millenium-tactics

Strategy turn-based game based on ancient battlefield tactics and sandbox war simulation games.

**FMT (First-Millennium Tactics, working title)** is a 1v1 hex tactics game. Each player is a general commanding infantry, foot archers and cavalry in simultaneous turns, and battles are won by breaking the enemy's cohesion rather than grinding down hit points.

Status: project skeleton. The game currently shows an empty 20 × 14 hex board.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install     # once
npm run dev     # opens the game at the address it prints (usually http://localhost:5173)
npm test        # run the tests
npm run check   # type-check + tests + format check
```

## Where to look

| File                                         | What it is                                                   |
| -------------------------------------------- | ------------------------------------------------------------ |
| [docs/GDD.md](docs/GDD.md)                   | Game design doc: the rules and balance numbers               |
| [docs/BACKLOG.md](docs/BACKLOG.md)           | Milestones and draft tickets                                 |
| [docs/WORKFLOW.md](docs/WORKFLOW.md)         | How work moves from issue to merged pull request             |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the code is organized                                    |
| [docs/TECH_STACK.md](docs/TECH_STACK.md)     | Tools, and the route to the app stores                       |
| [docs/DECISIONS.md](docs/DECISIONS.md)       | Decision log                                                 |
| [CLAUDE.md](CLAUDE.md)                       | Instructions Claude Code reads at the start of every session |

## Built with

TypeScript, Phaser 4, Vite and Vitest. Capacitor will package it for Android and iOS later.
