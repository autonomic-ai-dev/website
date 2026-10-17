# CI path-filter pattern (organs)

Mirror of `agent-brain/.github/workflows/ci.yml` for sibling organ repos.

## Behavior

1. **Push to `master`:** only runs when runtime paths change (`<crate>/**`, `Cargo.*`, `Makefile`, `Containerfile`, `scripts/**`, `.github/**`).
2. **Pull requests:** always start the workflow; a `Check runtime change paths` step sets `skip_pipeline=true` when the PR diff is docs/non-runtime only, so `pipeline-compose-run` is skipped.
3. **`workflow_dispatch`:** always allowed (manual full run).

## Applied to

`agent-spine`, `agent-muscle`, `agent-body`, `agent-heart`, `agent-mouth`, `agent-immune`, `agent-nerves`, `agent-eyes`, `agent-tui` (tui uses `src/**` at repo root).

Keep the crate-name regex in the filter step aligned with the `on.push.paths` list.
