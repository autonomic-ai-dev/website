---
title: tekmor CLI Reference
---

# tekmor CLI Reference

The complete reference for commands available in `tekmor 2.0.0`.

## Verification Commands

### `tekmor verify -- <command>`

Runs an allowlisted command from `.verify/verify.toml`, captures its output to `.verify/artifacts/`, and records the outcome against the HEAD commit and the code hash of the uncommitted changes.

```bash
tekmor verify -- cargo test
tekmor verify -- .verify/run.sh
```

- If the command is not in `.verify/verify.toml`, `tekmor` refuses to run it and exits 1:
  ```
  Error: `cargo test --no-run` is not in the verify allowlist; add it to .verify/verify.toml
  ```
- A string entry matches the whole command exactly: `cargo test` does not match `cargo test --no-run`. A trailing ` ...` allows extra arguments (`"cargo test ..."`)—note that the wildcard also admits flags such as `--no-run` that run no tests, so prefer exact entries for proof commands.
- An entry written as a shell command line (quotes, `$`, `VAR=value`, pipes) is the command `sh -c '<entry>'`; run it as `tekmor verify -- sh -c '<entry>'`.
- With no allowlist, only built-in test runners and programs inside `.verify/` run; `.verify/../x` and symlinks that leave `.verify/` are refused.

### `tekmor verify --repeat <N> -- <command>`

Runs `<command>` $N$ times consecutively against the same commit and code state.

```bash
tekmor verify --repeat 3 -- cargo test
```

- If the $N$ runs disagree (e.g., 2 pass and 1 fails), the command is flaky and does not count as proof: the receipt reads `NOT VERIFIED`.

### `tekmor verify receipt`

Shows whether the current commit and code passed. Exits 0 only on `PASSED`.

```bash
tekmor verify receipt
tekmor verify receipt --markdown    # Formatted for GitHub PR comments / step summaries
tekmor verify receipt --json        # Machine-readable JSON output
```

Example output:

```
Verify receipt: PASSED
  command:   sh -c true
  exit code: 0
  recorded:  2026-11-25T05:33:22Z
  source:    cli
  artifact:  .verify/artifacts/4b021624-7012-4e46-be36-7266dc289fa1.log
  commit:    2a424911d701
  code hash: e3b0c44298fc
```

### `tekmor verify summary`

Per check: failed runs out of all runs. `--json` is available.

```bash
tekmor verify summary
tekmor verify summary --json
```

### `tekmor verify init`

Creates `.verify/` with an allowlist. `--force` overwrites; `--dir <DIR>` chooses the directory.

```bash
tekmor verify init
```

### `tekmor verify ratchet`

Keeps lint counts from rising above their recorded baselines.

```bash
tekmor verify ratchet             # Checks metrics against recorded baselines
tekmor verify ratchet --update    # Lowers baselines when metrics improve; never raises them
```

### `tekmor verify drift`

Reports feature maps that point at missing code or checks: file paths that no longer exist on disk or commands that are not in `.verify/verify.toml`.

### `tekmor verify check-checks`

Confirms each allowlisted check fails on a broken copy in `.verify/broken/`. A check that still passes is reported as not caught.

### `tekmor verify review`

Records a signed pass or fail review for the current tree. Changes under the paths in `.verify/review.toml` need a passing review.

---

## Gate & Hook Commands

These commands are registered by `tekmor install` and are invoked automatically by Claude Code.

| Command              | Purpose                                                                                                                                               |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tekmor stop-gate`   | Stop hook: blocks a turn that changed code or claims a pass without a `PASSED` receipt for the current code.                                          |
| `tekmor bash-gate`   | PreToolUse hook for Bash: blocks or warns on risky commands.                                                                                          |
| `tekmor commit-gate` | PreToolUse hook: refuses commits that skip git hooks. It is not a git hook.                                                                           |
| `tekmor install`     | Registers the `stop-gate` and `bash-gate` hooks in `.claude/settings.json`; `--global` writes `~/.claude/settings.json`.                              |
| `tekmor doctor`      | Checks the setup the gates depend on: hooks, git, the allowlist, scripts, the store and feature-map drift. Output is `ok\|warn\|fail` lines per area. |
