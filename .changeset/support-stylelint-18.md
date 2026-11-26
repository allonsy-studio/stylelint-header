---
"@allons-y/stylelint-header": major
---

Require stylelint 18; drops support for stylelint 17. The `stylelint` peer
dependency now requires 18.x, and the CI test matrix no longer runs against
v17.

`--fix` now goes through the `fix` callback of stylelint's `report` utility
instead of `context.fix`, which stylelint 18 removed. The rule also sets
`meta.fixable`. Output is unchanged.
