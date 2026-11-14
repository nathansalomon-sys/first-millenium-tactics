# Tech stack

Decided 2026-11-14. The plan is web first: build and playtest the game in the browser on PC and phone, then wrap it for Google Play and the App Store.

## The stack

| Layer                      | Choice                           | What it does                                                                                     |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Language                   | TypeScript                       | One language for the rules, the game client, and later the server.                               |
| Rules engine               | Plain TypeScript in `src/engine` | The game rules with no graphics code. Same inputs always give the same result.                   |
| Graphics and input         | Phaser 4                         | 2D game library for the browser: draws the board and units, handles camera, touch and animation. |
| Build tool                 | Vite                             | Runs the game locally with live reload and packages the final version.                           |
| Tests                      | Vitest                           | Runs the unit tests and golden scenarios.                                                        |
| Formatting                 | Prettier                         | Keeps code style consistent.                                                                     |
| Automated checks           | GitHub Actions                   | Runs type-check, tests and build on every pull request (`.github/workflows/ci.yml`).             |
| Mobile packaging (later)   | Capacitor                        | Wraps the finished web game in a real Android and iOS app for the stores.                        |
| PC store (later)           | Electron or Tauri                | Wraps the web game for Steam, if wanted.                                                         |
| Online 1v1 (after the MVP) | Colyseus (planned)               | A TypeScript multiplayer server that resolves each turn, so no client can peek at hidden orders. |

Versions installed when the repo was set up: Phaser 4.2, Vite 8, Vitest 5, TypeScript 7, Prettier 3, on Node 22. `package-lock.json` pins the exact versions.

Capacitor, Electron/Tauri and Colyseus are not installed yet. Add them in the milestone that needs them.

## Why this stack

- **The game is a 2D hex board with turns.** It needs little graphics power, so a full game engine is more than it needs.
- **One language from client to server.** Simultaneous hidden orders mean online play needs a server to resolve each turn. In TypeScript the same rules engine runs in the browser (move previews, the AI) and on the server. Nothing is written twice.
- **Every build is a link.** A playtest is a URL that opens on any PC or phone, with nothing to install.
- **The owner has no Mac.** A web game can be tested on an iPhone from day one through Safari ("Add to Home Screen" gives a full-screen icon). A Mac is only needed for the final App Store build, and a cloud Mac can do that.
- **Everything is text.** Rules, data and tests are plain files that are easy to review and test automatically.

Godot 4 was the close second. It would be the better choice for a 3D battlefield or heavy animation. Unity was ruled out as more than a 2D hex game needs.

## Visual direction

Top-down view, very simple graphics, little scrolling: the player should see the whole battlefield, or close to it. What matters is that it is easy to understand and looks minimally neat. See "Visual direction" in `docs/GDD.md`.

## Route to the stores

Build order: browser on PC → browser on phone → Android app → iOS app. Store work is the last milestone (see `docs/BACKLOG.md`).

**Android (Google Play)**

- Builds on a PC with Android Studio, from the project Capacitor generates.
- Google Play developer account: $25, one time.
- A new personal developer account must run a closed test with at least 12 testers opted in for 14 days in a row before it can publish to production. Recruit more than 12, because the count must not drop below 12 during those 14 days. An organization account is exempt but needs a D-U-N-S number.

**iOS (App Store)**

- Needs Xcode, which only runs on macOS. With no Mac, use a cloud Mac: GitHub Actions has macOS build machines (free for public repositories, charged at a higher rate for private ones), and paid services can handle the build and code signing.
- Apple Developer Program: $99 per year. TestFlight handles beta testing.

Store rules and prices were checked on 2026-11-14. Check them again before starting the store milestone.

## Playtest link

Auto-publishing `main` to a public link (GitHub Pages) is the first ticket in `docs/BACKLOG.md`. `vite.config.ts` already uses relative asset paths (`base: './'`), so the same build works on GitHub Pages and inside a Capacitor app.
