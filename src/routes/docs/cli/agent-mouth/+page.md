---
title: agent-mouth CLI Reference
---

> **Out of scope.** This page describes a component from the earlier eleven-organ design. Autonomic AI currently consists of agent-brain and agent-spine only. See [Architecture](/docs/architecture).

# `agent-mouth` CLI Reference

`agent-mouth` is the ingress gateway, AST validation guard, and external communication bridge for the Autonomic ecosystem. It manages outbound operator notifications (Slack, Discord, webhooks), evaluates commands against human-in-the-loop approval policies, and validates bash scripts using AST parsing.

---

## Synopsis

```bash
agent-mouth [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print command help. |
| `--version` | `-V` | Boolean | Print installed `agent-mouth` version. |
| `--progress` | — | `auto\|plain\|quiet` | Output styling mode. |

---

## Commands

### `validate`

Validate a shell command string or script against safety AST policies before execution.

```bash
agent-mouth validate [OPTIONS]
```

#### Options

| Flag | Type | Description |
| :--- | :--- | :--- |
| `--command` | String | Inline shell command string to evaluate. |
| `--script` | Path | Path to bash/sh script file to parse and evaluate. |

#### Policy Rules Evaluated

- Blocks destructive filesystem commands (`rm -rf /`, `mkfs`, raw block device writes).
- Detects unquoted environment variables and prompt-injection risks.
- Enforces human approval requirements for network-modifying commands.

#### Examples

```bash
# Validate inline command
agent-mouth validate --command "git push origin master --force"

# Validate shell script
agent-mouth validate --script ./deploy.sh

# Validate safe readonly shell command
agent-mouth validate --command "cargo test -- -D warnings"
```

---

### `send`

Send a notification or alert payload through configured webhook endpoints.

```bash
agent-mouth send [OPTIONS] <MESSAGE>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `MESSAGE` | String | Plaintext or markdown message body to broadcast. |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--url` | `-u` | String | Config default | Destination webhook URL (e.g., Slack incoming webhook). |

#### Examples

```bash
# Send deployment notification to configured Slack channel
agent-mouth send "Release v1.2.0 deployed successfully to staging"
```

---

### `summarize`

Read log streams from standard input (`stdin`) and produce a concise error summary.

```bash
cat build.log | agent-mouth summarize
```

---

### `mcp`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-mouth mcp
```

Exposes `mouth_validate_ast` and `mouth_request_approval` tools for agent workflows.

---

### `serve`

Start the webhook ingress daemon and SSE notification server.

```bash
agent-mouth serve
```

---

### `status`

Display active communication channels, Slack webhook configurations, and approval queue depths.

```bash
agent-mouth status
```

---

### `log`

View or follow supervisor logs for the mouth daemon.

```bash
agent-mouth log [OPTIONS] [NAME]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--follow` | `-f` | Boolean | `false` | Follow log output (`tail -f`). |
| `--list` | — | Boolean | `false` | List available log files. |
