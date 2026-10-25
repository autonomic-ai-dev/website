---
title: agent-muscle CLI Reference
---

> **Out of scope.** This page describes a component from the earlier eleven-organ design. Autonomic AI currently consists of agent-brain and agent-spine only. See [Architecture](/docs/architecture).

# `agent-muscle` CLI Reference

`agent-muscle` is the execution actuator and fine-tuning engine of the Autonomic ecosystem. It provides sandboxed shell execution with Tree-sitter AST validation, stream chunk slicing, Apple Silicon MLX LoRA training, and Kubernetes GPU operator interfaces.

---

## Synopsis

```bash
agent-muscle [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print help and command usage. |
| `--version` | `-V` | Boolean | Print installed `agent-muscle` version. |
| `--progress` | — | `auto\|plain\|quiet` | Output rendering style. |

---

## Commands

### `run`

Execute a command in a sandboxed process, enforce AST safety gates, and stream stdout/stderr chunks.

```bash
agent-muscle run [OPTIONS] <COMMAND_STRING>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `COMMAND_STRING` | String | Shell command string to execute. |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--cwd` | `-c` | Path | Current Directory | Working directory for the process execution. |

#### Examples

```bash
# Execute safe build command in a specific repository directory
agent-muscle run "cargo test --workspace" --cwd /projects/my-app

# Execute with isolated environment variables
agent-muscle run "npm run build" --cwd ./frontend

# Run interactive script in sandboxed subshell
agent-muscle run "python3 -c 'import torch; print(torch.cuda.is_available())'"
```

---

### `train`

Run local LoRA fine-tuning on Apple Silicon (MLX), Linux CUDA (Candle), or auto-detected hardware.

```bash
agent-muscle train [OPTIONS]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--model` | String | `mlx-community/Llama-3.2-3B-Instruct-4bit` | Base Hugging Face model identifier or local checkpoint path. |
| `--data` | Path | `./training_data` | Directory containing formatted JSONL training datasets. |
| `--epochs` | Integer | `3` | Total number of training passes over the dataset. |
| `--learning_rate` | Float | `0.00001` | AdamW optimizer learning rate. |
| `--lora_rank` | Integer | `16` | Rank dimension for LoRA adapter matrices. |
| `--output` | Path | `./lora_adapters` | Output directory for trained adapter weights and metadata. |
| `--backend` | String | `auto` | Training engine backend: `mlx` (Metal), `candle` (CUDA), or `auto`. |
| `--min_entries` | Integer | `1` | Minimum number of valid JSONL examples required before training. |
| `--validate_only` | Boolean | `false` | Validate schema and token lengths without executing backward pass. |

#### Examples

```bash
# Fine-tune a 3B model locally using MLX Metal acceleration
agent-muscle train \
  --model mlx-community/Llama-3.2-3B-Instruct-4bit \
  --data ~/.autonomic/memory/training_data \
  --epochs 5 \
  --lora_rank 32 \
  --output ./adapters/fast-router
```

---

### `validate`

Validate JSONL training data against chat-template schemas without starting training.

```bash
agent-muscle validate [OPTIONS]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--data` | Path | `./training_data` | Path to directory containing `.jsonl` files. |
| `--min_entries` | Integer | `1` | Minimum number of required valid rows. |

---

### `serve`

Start the agent-muscle HTTP daemon and JetStream consumer.

```bash
agent-muscle serve
```

---

### `serve-mcp`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-muscle serve-mcp
```

Exposes `muscle_execute_bash` and `muscle_execute_python` tools with AST parameter guards.

---

### `status`

Query engine status, active processes, and detected GPU acceleration hardware.

```bash
agent-muscle status
```

---

### `operator`

Launch the Kubernetes GPU training operator daemon for multi-node cluster fine-tuning.

```bash
agent-muscle operator <SUBCOMMAND>
```

---

### `k8s`

Kubernetes GPU job helpers and pod template generators.

```bash
agent-muscle k8s <SUBCOMMAND>
```
