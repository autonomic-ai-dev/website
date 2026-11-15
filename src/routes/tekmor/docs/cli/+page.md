---
title: tekmor CLI Reference
---

# tekmor CLI Reference

The complete reference for commands available in `tekmor 1.0.0`.

## Verification Commands

### `tekmor verify -- <command>`
Executes an allowlisted command on your machine, captures stdout and stderr to `.verify/artifacts/`, and writes a receipt if the exit code is valid.

```bash
tekmor verify -- cargo test
tekmor verify -- .verify/run.sh
```

- If the command is not in `.verify/verify.toml`, `tekmor` refuses to execute it and exits with code 1.
- Results are recorded against the active git commit and the computed tree SHA.

### `tekmor verify --repeat <N> -- <command>`
Runs `<command>` $N$ times consecutively on the identical git tree.

```bash
tekmor verify --repeat 3 -- cargo test
```

- If any of the $N$ runs disagrees (e.g., 2 pass and 1 fails), the command is classified as `FLAKY_DISAGREEMENT`.
- Flaky commands **do not** generate a valid receipt and cannot satisfy the Claude Code stop gate.

### `tekmor verify receipt`
Displays the receipt verdict for the current git tree.

```bash
tekmor verify receipt
tekmor verify receipt --markdown    # Formatted for GitHub PR comments / step summaries
tekmor verify receipt --json        # Machine-readable JSON output
```

Example output:

```
Verify receipt: PASSED
  command:   cargo test --all-features
  exit code: 0
  recorded:  2026-11-10T14:22:01Z
  source:    cli
  artifact:  .verify/artifacts/run-a8f3b12.log
  commit:    a8f3b12c4
  tree hash: 4f9a2b8e19c02d7e
```

### `tekmor verify summary`
Prints aggregate statistics for each allowlisted command across past runs.

```bash
tekmor verify summary
tekmor verify summary --json
```

### `tekmor verify ratchet`
Enforces that metrics (such as lint warnings, coverage thresholds, or deprecated usages) do not regress past recorded baselines.

```bash
tekmor verify ratchet             # Checks metrics against .verify/ratchet.toml
tekmor verify ratchet --update    # Lowers baselines when metrics improve; never raises them
```

### `tekmor verify drift`
Audits the repository for drift: detects feature mappings whose file paths no longer exist on disk or checks that are missing from `.verify/verify.toml`.

### `tekmor verify check-checks`
Mutation test for verification suites. Runs each allowlisted check against broken mock copies from `.verify/broken/`. If a check still passes against intentionally broken code, it is reported as an ineffectual check.

---

## Gate & Hook Commands

These commands are registered by `tekmor install` and are invoked automatically by host harnesses.

| Command | Purpose |
| :--- | :--- |
| `tekmor stop-gate` | Stop hook: inspects assistant message claims and blocks turns lacking a `PASSED` receipt for the current tree. |
| `tekmor bash-gate` | PreToolUse hook: checks candidate shell commands against the `.verify/verify.toml` allowlist. |
| `tekmor commit-gate` | Git hook: blocks commits that attempt to bypass verification. |
| `tekmor install` | Registers `stop-gate` and `bash-gate` in `.claude/settings.json`. Supports `--global` for machine-wide enforcement. |
| `tekmor doctor` | Diagnostics check validating hook paths, binary locations, and configuration syntax. |

---

## Extension Commands

```bash
tekmor ext list
tekmor ext add <name>
tekmor ext remove <name>
```

Extensions are optional plugins. `ext add` is the only command in the entire `tekmor` binary that opens a network socket (to fetch the requested plugin binary and checksum).
