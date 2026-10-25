---
title: agent-nerves CLI Reference
---

> **Out of scope.** This page describes a component from the earlier eleven-organ design. Autonomic AI currently consists of agent-brain and agent-spine only. See [Architecture](/docs/architecture).

# `agent-nerves` CLI Reference

`agent-nerves` is the event messaging backbone and inter-organ communication mesh for the Autonomic ecosystem. Built on high-performance **NATS JetStream**, it guarantees at-least-once message delivery, stream persistence, WASM event filters, and multi-node cluster topology.

---

## Synopsis

```bash
agent-nerves [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print command help. |
| `--version` | `-V` | Boolean | Print installed `agent-nerves` version. |
| `--progress` | — | `auto\|plain\|quiet` | Output formatting mode. |

---

## Commands

### `ping`

Send an ultra-low-latency probe to the active NATS broker to verify connection liveness and round-trip time.

```bash
agent-nerves ping
```

---

### `stream`

Inspect, tail, and analyze active NATS JetStream topics and event streams.

```bash
agent-nerves stream <SUBCOMMAND>
```

#### Subcommands

| Subcommand | Description |
| :--- | :--- |
| `list` | Display all initialized JetStream streams (`AUTONOMIC_EVENTS`, `TASK_TRACES`, etc.). |
| `tail [stream_name]` | Tail real-time JSON event packets passing through the broker. |
| `info <stream_name>` | Display message counts, byte storage, consumer lag, and retention policy. |

#### Examples

```bash
# Ping active NATS broker to test round-trip latency
agent-nerves ping

# List all registered streams on the JetStream broker
agent-nerves stream list

# Tail live ecosystem event bus
agent-nerves stream tail

# Tail real-time model usage telemetry stream from agent-heart
agent-nerves stream tail events.heart.usage

# Inspect state of the task traces stream
agent-nerves stream info TASK_TRACES

# Start embedded NATS JetStream server on custom client port
agent-nerves serve --port 4222
```

---

### `cluster`

Multi-node cluster coordination, leader election, and WireGuard peer discovery.

```bash
agent-nerves cluster <SUBCOMMAND>
```

#### Subcommands

| Subcommand | Options | Description |
| :--- | :--- | :--- |
| `init` | — | Initialize local cluster node state and consensus files. |
| `status` | — | Display cluster leader, active peer nodes, and latency. |
| `render-config` | `[--port PORT]` | Render standard `nats.conf` cluster routing file to stdout. |

---

### `filter`

Manage JSON Schema and WebAssembly (WASM) stream event filters.

```bash
agent-nerves filter <list|add|remove|test>
```

Allows intercepting, transforming, or dropping specific message envelopes before they reach downstream consumer organs.

---

### `serve`

Start the NATS broker health monitor daemon and HTTP status API.

```bash
agent-nerves serve
```

---

### `serve-mcp`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-nerves serve-mcp
```

---

### `status`

Show broker connection URL, active consumers, and JetStream memory buffer stats.

```bash
agent-nerves status
```

---

### `log`

View or tail daemon logs for the nerves process.

```bash
agent-nerves log [OPTIONS] [NAME]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--follow` | `-f` | Boolean | `false` | Follow log output (`tail -f`). |
| `--list` | `-l` | Boolean | `false` | List available log files. |
