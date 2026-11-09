---
title: agent-brain CLI overview
---

# agent-brain CLI overview

agent-brain ships one binary, `agent-brain`. This page lists its main commands. The full reference, with every flag, is on the [agent-brain CLI](/docs/cli/agent-brain) page.

## Install and check

```bash
brew tap autonomic-ai-dev/tap
brew install agent-brain

agent-brain install --global
agent-brain doctor
```

## Core commands

| Command | Role | Description |
| :--- | :--- | :--- |
| **`serve`** | Daemon mode | Start the MCP server over standard input/output (`stdio`). |
| **`route_task`** | Turn gating | Rank skills, rules, and vector memory for a prompt within token limits. |
| **`install`** | Editor setup | Mount MCP and turn-routing hooks across Cursor, VS Code, Claude Code, Antigravity. |
| **`doctor`** | Diagnostics | Check daemon reachability, SQLite graph, HNSW vector count, and codesign. |
| **`verify`** | Evidence | Run a command and record its exit code and commit. `verify receipt` reads the result back. |
| **`package add`** | Skill packages | Install curated packages from registry aliases (e.g., `@agstack`, `@matt-skills`). |
| **`stats`** | Telemetry | Inspect local route latency (p95, p99), cache hit rates, and token headroom. |

## Exit codes

Exit codes let scripts and CI read the outcome of a command:

| Exit Code | Meaning | Typical Scenario |
| :---: | :--- | :--- |
| `0` | **Success** | Command completed cleanly with verified state. |
| `1` | **General Error** | Runtime exception, missing prerequisite, or uncaught failure. |
| `2` | **Syntax Error** | Malformed CLI arguments, unknown subcommand, or invalid flag. |
| `69` | **Unavailable** | Target daemon is offline, refused socket, or failed handshake. |
| `78` | **Config Error** | Malformed YAML schema or precondition contract failure. |
