---
"@allons-y/stylelint-header": minor
---

Support stylelint 18. The `stylelint` peer dependency now accepts 17.x or 18.x,
and the CI test matrix runs against both.

`--fix` now goes through the `fix` callback of stylelint's `report` utility
instead of `context.fix`, which stylelint 18 removed. The rule also sets
`meta.fixable`. Output is unchanged.
