---
title: agent-spine documentation
---

# agent-spine documentation

agent-spine runs a multi-step job described as a YAML file. Each step writes a snapshot to SQLite, and you can inspect a finished run afterwards.

## Start here

- Install with `brew install autonomic-ai-dev/tap/agent-spine`.
- Scaffold a built-in workflow with `agent-spine init --with @bugfix`, then check it with `agent-spine validate`.
- Read the [workflows and node kinds](/docs/workflows) to see what each node does.

## Reference

- [agent-spine CLI](/docs/cli/agent-spine) lists every command, flag and exit behaviour.
- [Registry](/registry) lists the built-in workflows.

## Limits to know first

Approval gates auto-approve unless you turn auto-approve off. `replay` reads snapshots and does not run steps again. `SpeculativeFork` passes its payload through and does not create worktrees yet.
