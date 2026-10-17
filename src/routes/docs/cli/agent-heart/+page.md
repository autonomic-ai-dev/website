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

Predictive token budgeting, multi-dimensional governance, and expenditure monitoring.

```bash
agent-heart budget <SUBCOMMAND>
```

#### Subcommands

| Subcommand | Description |
| :--- | :--- |
| `status` | Query current token consumption, WASM fuel metrics, and latency percentiles. |
| `check` | Probe whether a proposed task phase will breach the multi-dimensional budget vector (`tokens`, `wasm_fuel`, `latency_ms`). |

#### Multi-Dimensional Budget Vector
`agent-heart` governs resource allocations using a normalized 3-dimensional vector:
- **Tokens**: Predicted $p95$ and average token consumption against phase ceilings.
- **WASM Fuel**: Peak memory and fuel consumed by sandboxed execution workers.
- **Latency (ms)**: Turn response thresholds to prevent runaway synchronous execution.

#### Adaptive PID Throttling
When consumption approaches threshold limits, `agent-heart` calculates an adaptive `throttle_factor` ($0.1 \le \text{factor} \le 1.0$) using a Proportional-Integral-Derivative (PID) controller, smoothly pacing background task scheduling without hard pipeline halts.

#### MCP Governance Tool
- `heart_budget_status`: Returns structured JSON containing phase token statistics, global averages, and WASM fuel metrics for connected agent hosts.

#### Examples

```bash
# Display live token consumption and WASM fuel
agent-heart budget status

# Display budget status formatted as JSON for automation scripts
agent-heart budget status --json

# Check if a task phase complies with budget vector ceilings
agent-heart budget check

# Test whether a 15,000 token execution is allowed under current spend limits
agent-heart budget check --tokens 15000

# Start background maintenance daemon on custom port
agent-heart serve --port 3101
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
