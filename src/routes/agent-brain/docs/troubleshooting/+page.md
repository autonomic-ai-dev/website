---
title: agent-brain troubleshooting
---

# agent-brain troubleshooting

Start with the two checks below. They cover most problems.

```bash
agent-brain doctor
agent-brain log --list
```

`doctor` checks the MCP install, the binary, the hooks and the codesign. `doctor --fix` repairs what it can: it re-signs the binary on macOS, aligns the MCP configuration and refreshes the hooks.

## The MCP server will not start, or reports another instance is running

A previous editor session can leave the lock file behind. Check which process holds it, then let `doctor` repair the install:

```bash
lsof ~/.autonomic/memory/serve.lock
agent-brain doctor --fix
```

## macOS blocks the binary: "developer cannot be verified"

The quarantine flag is set on a downloaded binary. Clear it, then run the repair:

```bash
xattr -d com.apple.quarantine "$(which agent-brain)"
agent-brain doctor --fix
```

## Tools are blocked at the start of a turn

In hosts with hooks, agent-brain's tools stay blocked until the agent calls `route_task` for the current prompt. This is intended. Ask the agent to call `route_task`, or check that the hooks are trusted by the host. Claude Code and Codex do not run new hooks until you trust them.

## Routing is slow, or the context looks stale

Old route logs and unused memory make the database larger. Dry-run the memory cleanup first, then apply it:

```bash
agent-brain memory gc
agent-brain memory gc --apply
agent-brain index
```

`memory gc` is a dry run unless you pass `--apply`. `index` rebuilds the index of skills, rules and memory from the installed packages.

## Read the logs

```bash
agent-brain log --list          # names of the logs under the agent-brain home
agent-brain log <name> --follow # follow one log
agent-brain inspect log --last  # the most recent route_task retrievals
```

## Check the settings in use

```bash
agent-brain config show
```

This prints the active `config.yaml` values, so you can see what a setting is actually set to before you change it.

## A verify run does not show as passed

`agent-brain verify receipt` reports PASSED only for the current commit and code state. Run the check again on the current commit, then read the receipt:

```bash
agent-brain verify -- cargo test
agent-brain verify receipt
```

The receipt command exits 0 only when the result is PASSED.

## Still stuck

Collect the output of `agent-brain doctor` and `agent-brain version`, and the last lines of the relevant log, then open an issue on the agent-brain repository.
