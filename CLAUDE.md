# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-rule stylelint plugin (`header/header`) that asserts every stylesheet
begins with a configured header comment (typically a copyright/licence notice)
and prepends it on `--fix`. The entire implementation lives in `index.js`.

## Commands

- `yarn test` — run the Jest suite (ESM via `NODE_OPTIONS=--experimental-vm-modules`, `jest-preset-stylelint`).
- `yarn test -t "<description>"` — run a single case by its `testRule` `description` string.
- `yarn watch` — Jest in watch mode.
- `yarn coverage` — Jest with cobertura coverage output (CI enforces 80% line / 100% branch thresholds).
- `yarn lint` — ESLint (flat config) across all files; `yarn format` runs it with `--fix`.
- `yarn changeset` — record a changeset for release (see Releases below).

Requires Node >= 24 and Yarn 4 (Corepack). CI matrix tests stylelint 17 on macOS/Ubuntu/Windows.

## Architecture

`index.js` exports a stylelint plugin built with `createPlugin`. The rule closure
`(pathOrString, options, context) => (root, result) => …` does:

1. **Resolve the template.** `pathOrString` is either an inline template string
   or a path to a file. `existsSync` is checked both as-given and relative to
   `process.cwd()`; a matching file is read, otherwise the string is used verbatim.
   A `null`/empty value disables the rule (early return).
2. **Normalize.** Comment tags (`/*`, `*/`, leading `*`) and whitespace are
   stripped from the template so authors can store it as a real comment block.
3. **Render.** `lodash-es` `template()` substitutes variables. `YEAR`,
   `FILE_NAME` (`context.file.basename`), and `FILE_PATH` (`context.file.dirname`)
   are always injected; `options.templateVariables` are merged on top.
4. **Fuzzy match.** `root.walkComments` compares each comment against the rendered
   header with `string-similarity`'s `compareTwoStrings`, after stripping asterisks
   and whitespace from both sides. A score `>= nonMatchingTolerance` (default 0.98)
   counts as found — this is what lets year bumps and cosmetic edits pass.
5. **Fix or report.** If not found and `context.fix`, prepend the header (each line
   prefixed ` * `) with `raws.left` of `!\n` (the `/*!` minifier-safe prefix) unless
   `isRemovable` is true, then push blank lines before the first node. Otherwise
   `report()` the `rejected` message.

Options: `nonMatchingTolerance` (0–1), `templateVariables` (object), `isRemovable`
(bool). All are validated through stylelint's `validateOptions`.

## Tests

`test/stylelint-header.test.js` drives the rule through `jest-preset-stylelint`'s
`testRule` helper — each block is a config with `accept`/`reject` cases, and `fix: true`
blocks assert the `fixed` output. Fixtures in `test/` are the CSS inputs/outputs
(`fail.css`, `fixed.css`, `pass.css`, `multi-line.css`, `*-removable.css`) plus
`input.txt` (a template file) and `COPYRIGHT` (multi-line template). When changing
fix behavior, update the corresponding `fixed*.css` fixture.

## Releases

Versioning is via [Changesets](https://github.com/changesets/changesets), not
semantic-release. Add a changeset (`yarn changeset`) for any user-facing change;
`.changeset/changelog.js` is a custom changelog formatter. `.github/workflows/release.yml`
handles publishing to npm.

## Conventions

- ESM only (`"type": "module"`), single default export.
- Pre-commit runs husky + lint-staged (ESLint + Prettier on staged files).
- README badges/banner between `weaver:*` markers are auto-generated — do not hand-edit.
