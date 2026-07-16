# Contributing to Allons-y Studio

First off — thank you! 🎉 _Allons-y_ means "let's go," and we're glad you're
going there with us. This guide explains how to contribute across all of our
repositories. Individual projects may add their own `CONTRIBUTING.md` with
project-specific details; when they do, that file takes precedence.

## Code of Conduct

This project and everyone participating in it is governed by our
[Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to
uphold it. Please report unacceptable behavior to **report@allons-y.studio**.

## Ways to contribute

You don't have to write code to make a difference:

- 🐛 **Report bugs** — open an issue with clear reproduction steps.
- ✨ **Suggest features** — tell us about the problem you're trying to solve.
- 📚 **Improve docs** — typos, clarifications, and examples are always welcome.
- 🧪 **Triage issues** — reproduce reports, confirm bugs, suggest labels.
- 💬 **Help others** — answer questions in Discussions.

## Reporting bugs & requesting features

Please use our [issue templates](https://github.com/allonsy-studio/stylelint-header/issues/new/choose).
Before opening a new issue, search existing ones to avoid duplicates.

## Development workflow

1. **Fork** the repository and clone your fork.
2. **Create a branch** from `main` using a descriptive name:
   - `fix/short-description` for bug fixes
   - `feat/short-description` for features
   - `docs/short-description` for documentation
3. **Make your changes** in small, focused commits.
4. **Test** your changes locally and add tests where appropriate.
5. **Lint and format** before committing (see the project's README for commands).
6. **Open a pull request** against `main` and fill out the PR template.

## Releasing with changesets

Releases are managed by [Changesets](https://github.com/changesets/changesets). When you make a change that affects how the action behaves for consumers, add a changeset:

```bash
yarn changeset
```

Pick the bump type when prompted, write a short summary, and commit the generated file in `.changeset/` alongside your code:

- **patch** — bug fixes
- **minor** — new, backwards-compatible features
- **major** — breaking changes

Changes that don't affect consumers (docs, tests, CI, internal refactors) don't need a changeset.

### Pull request guidelines

- Keep PRs focused — one logical change per PR is easiest to review.
- Reference the issue your PR addresses (`Closes #123`).
- Make sure CI passes and there are no new warnings or accessibility regressions.
- Be responsive to review feedback — we aim to be too.

## Accessibility

Accessibility is a requirement, not a nice-to-have. Changes that affect the UI
should preserve or improve keyboard support, focus management, color contrast,
and screen-reader behavior.

## License

Unless a repository states otherwise, contributions are accepted under that
repository's license. By submitting a contribution, you agree that it may be
distributed under those terms.

## Questions?

Open a [discussion](https://github.com/orgs/allonsy-studio/discussions) or see
[SUPPORT.md](SUPPORT.md). Thanks again for contributing! 💜
