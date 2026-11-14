# Workflow

Work moves through GitHub: an issue describes one piece of work, a branch implements it, a pull request reviews it, and CI checks it before it merges into `main`.

## The loop

1. **Issue.** The owner writes a ticket (or asks Claude Code to draft one from `docs/BACKLOG.md`) using the Feature, Bug or Design question template.
2. **Branch.** Start from an up-to-date `main`. Name it after the issue: `feat/12-terrain-rendering`, `fix/31-rally-timing`, `docs/40-gdd-size-names`.
3. **Build.** For rules work, write the tests first from the ticket's worked examples, then the code.
4. **Check.** Run `npm run check` and `npm run build`. For anything visible, run `npm run dev` and look at it at desktop and phone size.
5. **Pull request.** Push the branch and open a pull request that says `Closes #12` and fills in the template. CI runs type-check, tests, format check and build.
6. **Review and merge.** The owner reviews and merges (squash merge keeps `main` at one commit per ticket). Nobody commits straight to `main`.

In Claude Code, `/ticket 12` runs steps 2–5 for issue 12.

## What a good ticket has

| Part                | Why it matters                                                           |
| ------------------- | ------------------------------------------------------------------------ |
| User story          | Says who it is for and why, so trade-offs can be judged.                 |
| Context             | The GDD section it implements and its milestone.                         |
| Acceptance criteria | A checklist that can each be answered yes or no.                         |
| Worked examples     | For rules: concrete cases with expected numbers. These become the tests. |
| Out of scope        | Stops the ticket from growing.                                           |

A worked example looks like this: "A Medium infantry unit (Melee 20, morale 70) attacks another infantry unit's flank on open ground → 33 damage to endurance." The more of these a rules ticket has, the less the code can drift from the design.

Keep tickets small: one rule, one screen, or one phase. If a ticket needs more than a few hundred lines, split it.

## Definition of done

A ticket is done when:

- every acceptance criterion is met;
- new rules have tests, including the ticket's worked examples;
- `npm run check` and `npm run build` pass locally and in CI;
- rules and numbers match `docs/GDD.md`, or the GDD is updated in the same pull request;
- the engine is still pure (no Phaser, browser or clock in `src/engine`);
- anything visible was checked at phone size as well as desktop;
- the pull request is reviewed and merged.

## When the design is unclear

If a ticket or the GDD is ambiguous, or two rules conflict, do not pick an answer in code. Open a Design question issue (or ask in the conversation), get a decision, then record it:

- update `docs/GDD.md`;
- add a dated line to `docs/DECISIONS.md`.

`docs/BACKLOG.md` lists rules gaps already spotted.

## Commits

- Short, present-tense subject that says what changed: `Add terrain move costs to pathfinding`.
- Reference the issue in the pull request, not necessarily in every commit.
- Commit `package-lock.json` whenever dependencies change.

## Labels

Suggested labels: `feature`, `bug`, `design`, `engine`, `client`, `data`, and one per milestone (`M1-board`, `M2-units`, …). The issue templates apply `feature`, `bug` and `design`; create the labels once in the repository's Issues → Labels page.

## Playtest builds

Once the first backlog ticket is done, every merge to `main` publishes the game to a public link. Open it on a phone and use "Add to Home Screen" for a full-screen test.
