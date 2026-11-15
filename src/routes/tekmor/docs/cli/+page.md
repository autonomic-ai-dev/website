---
title: tekmor CLI
---

# tekmor CLI

Every command below is in the 1.0.0 binary.

## Verify

```
tekmor verify -- <cmd>                      Run an allowlisted command and record its outcome
tekmor verify receipt [--markdown|--json]   Show whether the current commit and code passed
tekmor verify summary [--json]              Per check: failed runs out of all runs
tekmor verify init [--force] [--dir <DIR>]  Create .verify/ with an allowlist
```

`verify --repeat N -- <cmd>` runs a command N times on one tree. If the runs disagree, the command is flaky, and flaky runs do not count as proof.

`verify ratchet [--update]` keeps lint counts from rising above their recorded baselines. `--update` lowers baselines and never raises them.

`verify drift` reports feature maps whose code paths or checks no longer exist, or are not in the allowlist.

`verify check-checks` runs each allowlisted check on a broken copy of the project from `.verify/broken/`. A check that still passes there is reported as not caught.

`verify review --verdict pass|fail --reviewer NAME` records a signed review for the current tree. Changes under the paths in `.verify/review.toml` need a passing review.

## Gates

```
tekmor stop-gate       Stop hook: blocks a turn that has no passing proof
tekmor bash-gate       PreToolUse hook: checks a shell command before it runs
tekmor commit-gate     PreToolUse hook: refuses commits that skip git hooks
tekmor install [--global]   Registers the gates in Claude Code settings
```

Run the gates through `tekmor install`. You do not normally call them by hand.

## Extensions

```
tekmor ext list|add|remove
```

Extensions are optional. None are bundled. `ext add` is the only command that opens a network connection.
