---
title: agent-brain documentation
---

# agent-brain documentation

agent-brain is a context engine and MCP server for AI coding agents. It picks the skills and rules a task needs, holds other tools until the agent has routed, and writes a receipt for every verify run.

## Start here

- Install with `brew install agent-brain`, then run `agent-brain install --global` and `agent-brain doctor`.
- Read the [installation guide](/docs/installation) for supported platforms and where settings live.
- Learn the routing flow in the [architecture](/docs/architecture) page.

## Concepts

- [Memory](/docs/memory) covers how routed context and stored memories are kept.
- [Verification](/docs/verification) covers verify runs and receipts.
- [Invariants](/docs/invariants) lists the rules the gates enforce.

## Reference

- [agent-brain CLI](/docs/cli/agent-brain) lists every command, flag and exit behaviour.
- [Registry](/registry) lists the skill packages you can add with `agent-brain package add`.
