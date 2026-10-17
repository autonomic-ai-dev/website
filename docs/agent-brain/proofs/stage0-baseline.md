# Stage 0 baseline (transformation roadmap)

Recorded: 2026-10-16

## Checklist

- [x] Orchestrator verify source tag (`cli|hook|mcp|playbook|orchestrator`) in agent-brain
- [x] Project command allowlist via `.verify/verify.toml`
- [x] Composed agent instructions prefer `agent-brain verify --` over `record_verify_outcome`
- [x] Organ CI path filters aligned with agent-brain (skip docs-only PRs)
- [ ] One binary version on every device (`autonomic doctor` / install) — operator
- [ ] `agent-brain proofs --ci` with extras feature when recording numeric baseline

## Versions (dev tree)

Run locally and paste when committing a release baseline:

```bash
agent-brain --version
autonomic doctor
```

## Proofs

Numeric REB/proofs baseline requires `--features extras`. Until then, treat CI green on `cargo test -p agent-brain` as the Stage 0 engineering baseline.
