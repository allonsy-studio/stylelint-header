# Change log

## 4.0.0 (2026-04-29)

### Major Changes

- **Requires stylelint 17; drops support for stylelint 15 and 16.** The
  `stylelint` peer dependency is now `17.x`, keeping the rule aligned with
  stylelint's ESM-only Node.js API and its stricter `report()` position
  contract. For projects already on modern stylelint this is a drop-in upgrade
  with no config changes, and CI now runs the rule against stylelint 17 on
  macOS, Linux, and Windows so regressions get caught on every supported
  platform. ([`b54abd8`](https://github.com/allonsy-studio/stylelint-header/commit/b54abd89e1827b503d97ae3982e05ec13e5393e7))
- **Requires Node.js 24 or newer.** The minimum runtime moves up from Node.js
  20/22 to match the baseline used by stylelint and the surrounding tooling.

## 3.0.1 (2026-03-11)

### Patch Changes

- Updated the bundled `lodash-es` dependency to `4.17.23`, picking up upstream
  fixes so the template-rendering internals stay current and
  secure. ([`679b834`](https://github.com/allonsy-studio/stylelint-header/commit/679b834ade77b89b77ce8187c989c45b1c23f169))

## 3.0.0 (2025-04-16)

### Major Changes

- **Drops support for Node.js 20 and stylelint 15.** Removing these end-of-life
  targets lets the plugin rely on current language and API features and keeps
  the install footprint small. No rule behavior changed — as long as you're on
  a maintained Node.js and stylelint release, upgrading is
  seamless. ([`abdbc74`](https://github.com/allonsy-studio/stylelint-header/commit/abdbc74cc8b95e0ed5a2d37a5de7a1fdd0c78976))

## 2.1.0 (2025-01-29)

### Minor Changes

- **Added the `isRemovable` option to opt out of the minifier-safe `/*!`
  prefix.** By default the header is written as a "special" comment that most
  minifiers preserve; set `isRemovable: true` when you'd rather the header be
  strippable during minification. This gives you direct control over whether
  your license or copyright banner survives a production
  build. ([#142](https://github.com/allonsy-studio/stylelint-header/pull/142))

## 2.0.3 (2025-01-28)

### Patch Changes

- **Declared the missing `lodash-es` dependency** so fresh installs resolve
  everything the rule needs, instead of failing on a missing module in stricter
  or isolated
  environments. ([#141](https://github.com/allonsy-studio/stylelint-header/pull/141))

## 2.0.2 (2025-01-21)

### Patch Changes

- **Fixed year rollover** so an existing header carrying last year's `YEAR`
  value still matches the rendered template. Your stylesheets no longer get
  flagged or rewritten simply because the calendar year
  changed. ([`bc281bb`](https://github.com/allonsy-studio/stylelint-header/commit/bc281bb27a5f4a99f420fad0c59cc6a0c83ee178))

## 2.0.1 (2024-07-03)

### Patch Changes

- **Added an explicit `exports` map to `package.json`** so bundlers and Node
  resolve the plugin's entry point reliably across ESM and tooling
  setups. ([`b24f252`](https://github.com/allonsy-studio/stylelint-header/commit/b24f252a6ce41bd6738f7eb98da87c913c2febfb)) —
  thanks [@eliashaeussler](https://github.com/eliashaeussler)!

## 2.0.0 (2024-05-06)

### Major Changes

- **Added stylelint 16 support.** The plugin was updated for stylelint 16's new
  API, and the `stylelint` peer dependency moved to the 16.x line, so you could
  adopt stylelint 16 without dropping your header check. Bump `stylelint` to
  `^16` alongside this
  upgrade. ([#45](https://github.com/allonsy-studio/stylelint-header/pull/45))

## 1.0.0 (2023-10-26)

### Major Changes

- **Initial release of the `header/header` rule.** It asserts that every
  stylesheet begins with a configured header comment — typically a copyright or
  license notice — and prepends it automatically on `--fix`.
- **Flexible templating.** Point the rule at an inline template string or a file
  path; built-in variables (`YEAR`, `FILE_NAME`, `FILE_PATH`) and your own
  `templateVariables` are substituted into the header when it's rendered.
- **Forgiving fuzzy matching.** The `nonMatchingTolerance` score lets year bumps
  and small cosmetic edits pass without re-flagging, so the rule enforces the
  header without fighting routine, harmless changes.
