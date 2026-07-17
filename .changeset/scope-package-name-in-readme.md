---
"@allons-y/stylelint-header": patch
---

Use the scoped package name `@allons-y/stylelint-header` in the README install commands and stylelint `plugins` config examples. The bare `stylelint-header` name would fail to install and leave stylelint unable to resolve the plugin now that the package lives under the allons-y org.
