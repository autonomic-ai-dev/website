---
title: agent-immune CLI Reference
---

> **Out of scope.** This page describes a component from the earlier eleven-organ design. Autonomic AI currently consists of agent-brain and agent-spine only. See [Architecture](/docs/architecture).

# `agent-immune` CLI Reference

`agent-immune` provides zero-trust security, admission control, and runtime defense for the Autonomic ecosystem. It audits project dependencies against the Open Source Vulnerabilities (OSV) database, executes untrusted scripts inside network-isolated sandboxes, and verifies memory leak gates before dataset commits.

---

## Synopsis

```bash
agent-immune [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print command help. |
| `--version` | `-V` | Boolean | Print installed `agent-immune` version. |
| `--progress` | — | `auto\|plain\|quiet` | Output formatting mode. |

---

## Commands

### `scan`

Scan a package manifest file against the Open Source Vulnerability (OSV) database.

```bash
agent-immune scan <MANIFEST_PATH>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `MANIFEST_PATH` | Path | Path to `Cargo.toml`, `package.json`, `requirements.txt`, or `go.mod`. |

#### Checks Performed

- Queries the local and upstream OSV API for known CVEs.
- Computes CVSS v3 severity scores.
- Flags deprecated dependencies and compromised packages.

#### Examples

```bash
# Scan a Node.js project manifest
agent-immune scan ./package.json

# Scan a Rust workspace manifest
agent-immune scan ./Cargo.toml

# Scan Python dependencies for known CVEs
agent-immune scan ./requirements.txt

# Scan Go module dependencies
agent-immune scan ./go.mod
```

---

### `sandbox`

Run a shell command or script inside a network-isolated sandbox environment.

```bash
agent-immune sandbox [OPTIONS] <SCRIPT_PATH>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `SCRIPT_PATH` | Path | Path to script or command file to execute safely. |

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--allow-network` | Boolean | `false` | Allow outbound network egress. By default, network namespaces (`unshare -n` on Linux or sandbox profiles on macOS) block all egress. |

#### Examples

```bash
# Run untrusted bash script with network egress blocked
agent-immune sandbox ./untrusted-script.sh
```

---

### `verify-memory`

Execute a script under an RSS memory monitor to ensure it does not exhibit runaway memory growth or memory leaks.

```bash
agent-immune verify-memory [OPTIONS] <SCRIPT_PATH>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `SCRIPT_PATH` | Path | Path to command file or test suite to execute. |

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--threshold-kb` | Integer | `524288` (512 MiB) | Maximum allowed Resident Set Size (RSS) memory delta in KiB before marking the run as failed. |

#### Examples

```bash
# Verify worker loop does not leak more than 64 MB of RAM
agent-immune verify-memory ./worker.sh --threshold-kb 65536
```

---

### `serve`

Start the agent-immune HTTP daemon, MCP server, and JetStream security alert consumer.

```bash
agent-immune serve
```

---

### `serve-mcp`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-immune serve-mcp
```

Exposes `immune_scan_manifest`, `immune_sandbox_run`, and `immune_lint_ast` tools to agent controllers.

---

### `status`

Show active security rules, sandbox profiles, and OSV cache status.

```bash
agent-immune status
```
