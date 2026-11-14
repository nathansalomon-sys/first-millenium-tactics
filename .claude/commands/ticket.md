---
description: Work on one GitHub issue from start to pull request
argument-hint: <issue number>
---

Work on GitHub issue #$ARGUMENTS in this repository, following `docs/WORKFLOW.md`.

1. Read the issue (`gh issue view $ARGUMENTS` if the GitHub CLI is installed; otherwise ask me to paste it). Read the GDD sections it points to in `docs/GDD.md`.
2. Before writing code, tell me in a few plain sentences how you plan to do it. If the issue or the GDD is ambiguous, or the ticket touches an open question in `docs/GDD.md`, stop and ask me. Do not pick a rule yourself.
3. Create a branch named `feat/$ARGUMENTS-<short-slug>` (or `fix/…` for a bug) from an up-to-date `main`.
4. For rules work, write the tests first from the issue's worked examples, then the code.
5. Run `npm run check` and `npm run build`. For anything visible, run the game and look at it at phone size too.
6. Commit, push the branch and open a pull request that says `Closes #$ARGUMENTS` and fills in the pull request template. Do not merge it; I review and merge.
7. Finish with a short summary: what changed, how I can check it, and anything you were unsure about.
