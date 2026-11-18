# Agent instructions

NichtImKopf UI (`@nichtimkopf/ui`) is the theme and the component kit of the NichtImKopf apps. It builds on Nuxt UI: the theme gives Nuxt UI's components their look, and the kit holds the few parts Nuxt UI has no component for. Nuxt UI comes first: the package adds its own code only where Nuxt UI cannot do the job.

## Before you write code

- Look for what already exists. Check whether a Nuxt UI component, a prop or a theme setting does the job before you write a component.
- Read the official documentation of the mechanism you are about to use, and use it the way it describes. Do not build your own where a documented way exists.
- Learn how a part is built from the parts already in this repository, and build the next one the same way.

## Making the change

- Make the smallest correct change. Do not reformat, rename or move code you did not need to touch.
- Write code that needs no comment. Add one only where the code cannot say it itself: a reason that is not obvious, a limit, a workaround. No comments that narrate the change.
- Every file in `src/` starts with its SPDX lines: copyright holder and licence. A file ported from another project names that project's copyright holder first.
- What a tool can check becomes a check in `.pre-commit-config.yaml`, not a sentence in a file.
- Everything in this repository is English.

## Commands

- Install: `npm ci`.
- Checks: `pre-commit run --files <changed files>`.
- After changing a `uses:` line in a workflow: `gh actions-lock`, from the gh extension `github/gh-actions-lock`.

## Pull requests

- Target `main`. The title becomes the commit, so write it as one: `fix(frame): keep the footer at the bottom`.
- The description says in a few plain sentences what the change is about, and in one line what was checked or that nothing was. No lists, tables or links.
- Commits and pull requests carry no AI attribution line.

## Never

- Never report something as tested, reproduced or checked that did not run.
- Never bring in code from another project without reading its licence. It has to allow use under MIT, and the file keeps the name of its copyright holder.
