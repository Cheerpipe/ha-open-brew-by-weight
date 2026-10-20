# Contributing

Thanks for wanting to help. Bug reports, fixes, translations, and better docs
are all welcome.

## Where things go

This repository holds the Home Assistant side only. The controller firmware,
its Web UI, and the integration API it exposes live in the
[firmware repository](https://github.com/Cheerpipe/Advanced-Shot-Stopper),
which documents that API in `docs/INTEGRATION_API.md`. A change that needs new
data from the controller starts there.

## Set up

You need [uv](https://docs.astral.sh/uv/getting-started/installation/). It
installs the right Python and the exact package versions in `uv.lock`, which
follow the Home Assistant release this integration targets.

```sh
uv python install 3.14
uv sync --locked --group test
```

No Home Assistant instance or controller is needed for the tests.

## Check your change

```sh
uv run --no-sync pytest
uv run --no-sync ruff check .
uv run --no-sync mypy
```

The tests must keep at least 95% coverage. `--no-sync` keeps the commands from
quietly changing your environment; `--locked` refuses a stale lockfile.

GitHub Actions runs the same checks on every push and pull request, plus
Home Assistant's hassfest and the HACS validation.

## Controller fixtures

`tests/fixtures/` holds sample messages and snapshots copied from the firmware
repository's `src/tests/fixtures/`. They pin the wire format this integration
understands, including `wire_contracts_v1.json`, which lists the shot stop
reasons the tests check `const.py` and the translations against. When the
firmware changes its contract, copy the updated fixtures here in the same pull
request that teaches the integration about it.

## Translations

User-facing text lives in `custom_components/open_brew_by_weight/strings.json`.
Keep `translations/en.json` identical to it in content. New languages go in
`translations/<language>.json`.

## Make a release

1. Update `version` in `custom_components/open_brew_by_weight/manifest.json`
   and `pyproject.toml`, then run `uv lock` so the lockfile records it.
2. Add the release notes to `CHANGELOG.md`.
3. Commit, push, and wait for the Validate and Tests workflows to pass.
4. Create a GitHub release (a full release, not just a tag) named `vX.Y.Z`
   from `main`. HACS offers releases to users as updates.
