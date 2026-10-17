---
title: agent-spine CLI Reference
---

# `agent-spine` CLI Reference

`agent-spine` is the deterministic DAG workflow execution engine for the Autonomic ecosystem. It compiles declarative YAML workflows into directed acyclic graphs, executes steps in parallel or sequential pipelines, preserves immutable execution checkpoints in SQLite, and bridges with `agent-brain` for dynamic task routing.

---

## Synopsis

```bash
agent-spine [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print help and command usage. |
| `--version` | `-V` | Boolean | Print installed `agent-spine` version. |
| `--progress` | — | `auto\|plain\|quiet` | Progress output rendering mode. |

---

## Commands

### `run`

Execute a YAML workflow locally.

```bash
agent-spine run [OPTIONS] <WORKFLOW>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `WORKFLOW` | Path | Path to YAML workflow definition file (e.g., `workflow.yaml`). |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--payload` | `-p` | String | `{}` | Initial JSON input payload passed to the workflow root. |
| `--db` | `-d` | Path | `~/.autonomic/logs/spine/state.db` | Path to SQLite state database for step snapshot persistence. |
| `--brain` | `-b` | Boolean | `false` | Enable `agent-brain` routing, rule injection, and step enrichment. |
| `--meta` | `-m` | String | `None` | Query `agent-brain` to dynamically select the workflow based on prompt. |

#### Examples

```bash
# Run bugfix workflow with JSON payload
agent-spine run ~/.autonomic/state/spine/bugfix.yaml \
  --payload '{"issue_id": "AUT-402", "branch": "fix/memory-leak"}'

# Execute workflow with agent-brain dynamic routing
agent-spine run ~/.autonomic/state/spine/release.yaml --brain

# Meta-routing: select workflow automatically based on user task
agent-spine run workflow.yaml --meta "Review open PRs and generate changelog"

# Run workflow with offline budget gating disabled
AUTONOMIC_BUDGET_GATE=0 agent-spine run workflow.yaml
```

---

### `validate`

Parse and validate a YAML workflow definition against schema rules, budget preconditions, and cyclic dependency checks.

```bash
agent-spine validate <WORKFLOW>
```

#### Checks Performed

- Validates YAML syntax and structural types.
- Validates `budget` blocks (`max_cost_usd`, `max_tokens`) and node preconditions (`budget_headroom`, `quota_available`).
- Detects cyclic dependencies using Kahn's topological sorting algorithm.
- Verifies that all referenced tool names exist in the organ MCP gateway.
- Validates timeout values and retry policies.

#### Examples

```bash
# Validate workflow DAG and preconditions
agent-spine validate .autonomic/workflows/ci.yaml

# Validate feature release workflow before scheduling
agent-spine validate workflow.yaml
```

---

### `init`

Initialize `agent-spine` configuration, create state directories, and generate built-in workflow templates.

```bash
agent-spine init [OPTIONS]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--force` | `-f` | Boolean | `false` | Skip prerequisite checks (`protoc`, `bun`, `agent-brain`). |
| `--dir` | `-d` | Path | `~/.autonomic/state/spine` | Target directory for generated workflow files. |
| `--with` | `-w` | String | `None` | Generate a specific built-in template (`@bugfix`, `@stacked-pr`, `@release-notes`, `@feature-from-spec`, `@mcp-health-check`, or `list`). |

#### Examples

```bash
# List available built-in workflow templates
agent-spine init --with list

# Scaffold bugfix workflow
agent-spine init --with @bugfix
```

---

### `inspect`

Inspect the complete historical trace and step outcomes of an execution.

```bash
agent-spine inspect [OPTIONS] <EXECUTION_ID>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `EXECUTION_ID` | String | Unique execution UUID. |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--db` | `-d` | Path | `~/.autonomic/logs/spine/state.db` | State database file path. |

---

### `replay`

Replay a past workflow execution from its checkpoints to recreate or verify the final state.

```bash
agent-spine replay [OPTIONS] <EXECUTION_ID>
```

---

### `serve`

Start the agent-spine HTTP API and live web DAG visualizer.

```bash
agent-spine serve [OPTIONS]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--port` | `-p` | Integer | `3000` | Port for the Spine HTTP management API. |
| `--dashboard-port` | — | Integer | `3001` | Port for the web DAG visualization dashboard. |
| `--db` | `-d` | Path | `~/.autonomic/logs/spine/state.db` | State database path. |
| `--nats-url` | — | String | `nats://127.0.0.1:4222` | NATS JetStream broker URL for distributed events. |

---

### `mcp-serve`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-spine mcp-serve [OPTIONS]
```

Provides tool interfaces (`spine_submit_workflow`, `spine_list_workflows`, `spine_check_status`) for agent-body and external agent hosts.

---

### `doctor`

Diagnose common configuration issues, prerequisite tools, SQLite schema integrity, and NATS broker connectivity.

```bash
agent-spine doctor
```

---

### `log`

Display or tail supervisor logs for the spine daemon.

```bash
agent-spine log [OPTIONS] [NAME]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--follow` | `-f` | Boolean | `false` | Follow log output (`tail -f`). |
| `--list` | `-l` | Boolean | `false` | List available log files. |
