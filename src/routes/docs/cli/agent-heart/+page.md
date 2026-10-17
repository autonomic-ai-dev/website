---
title: agent-heart CLI Reference
---

# `agent-heart` CLI Reference

`agent-heart` maintains metabolic balance, financial budgets, and knowledge hygiene across the Autonomic ecosystem. It monitors turn-by-turn LLM token consumption, enforces cost ceilings, runs automated garbage collection over SQLite databases, and triggers memory distillation.

---

## Synopsis

```bash
agent-heart [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print command help. |
| `--version` | `-V` | Boolean | Print version information. |
| `--progress` | — | `auto\|plain\|quiet` | Output styling format. |

---

## Commands

### `budget`

Predictive token budget management and expenditure monitoring.

```bash
agent-heart budget <SUBCOMMAND>
```

#### Subcommands

| Subcommand | Description |
| :--- | :--- |
| `status` | Query current daily, weekly, and monthly token expenditure vs limits. |
| `check` | Probe whether a proposed task prompt will breach budget thresholds before sending to LLM. |

#### Examples

```bash
# Display live token consumption
agent-heart budget status

# Check if a 128k prompt is allowed under current quotas
agent-heart budget check
```

---

### `gc`

Execute a single-pass garbage collection cycle across all ecosystem SQLite databases.

```bash
agent-heart gc
```

#### Operations Performed

- Scans `agent-brain`, `agent-spine`, and `agent-eyes` SQLite databases.
- Identifies unreferenced memory embeddings, orphaned workflow steps, and superseded DOM snapshots.
- Executes `VACUUM` and SQLite index defragmentation.

---

### `distill`

Perform semantic clustering and distillation over recent memory nodes.

```bash
agent-heart distill
```

Groups overlapping facts and reduces database bloat by synthesizing redundant memories into consolidated high-confidence recipes.

---

### `learn`

Trigger an offline self-learning cycle over accumulated agent execution trajectories.

```bash
agent-heart learn
```

---

### `finetune`

Assemble the dataset pipeline and trigger MLX local adapter training via `agent-muscle`.

```bash
agent-heart finetune
```

---

### `lint`

Lint a bash script for common shell anti-patterns, missing error checks, and unsafe variable expansions.

```bash
agent-heart lint <SCRIPT_PATH>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `SCRIPT_PATH` | Path | Path to shell script to analyze. |

---

### `serve`

Start the full background maintenance daemon (HTTP API, MCP server, and cron scheduler).

```bash
agent-heart serve
```

---

### `serve-mcp`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-heart serve-mcp
```

Exposes `heart_budget_status`, `heart_memory_distill`, and `heart_gc` tools to agent supervisors.

---

### `status`

Display daemon health, scheduled cron jobs, and memory metrics.

```bash
agent-heart status
```

---

### `log`

View or follow agent-heart daemon logs.

```bash
agent-heart log [OPTIONS] [NAME]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--follow` | Boolean | `false` | Follow log output (`tail -f`). |
| `--list` | Boolean | `false` | List available log files. |
