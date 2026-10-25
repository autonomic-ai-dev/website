---
title: autonomic CLI Reference
---

> **Out of scope.** This page describes a component from the earlier eleven-organ design. Autonomic AI currently consists of agent-brain and agent-spine only. See [Architecture](/docs/architecture).

# `autonomic` CLI Reference

The `autonomic` binary is the primary meta-orchestrator and cluster supervisor for the Autonomic AI ecosystem. Provided by **`agent-body`**, it manages daemon lifecycles, health probes, launchd background services, process monitoring, and editor MCP installation.

---

## Synopsis

```bash
autonomic [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | — | Show help and exit |
| `--version` | `-V` | Boolean | — | Show version information and exit |
| `--progress` | — | `auto\|plain\|quiet` | `auto` | Progress output styling (plain is optimized for CI pipelines) |

---

## Commands

### `init`

Initialize an Autonomic workspace with default directories and templates.

```bash
autonomic init [OPTIONS] [NAME]
```

#### Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NAME` | String | `None` | Optional workspace name to initialize. |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--force` | `-f` | Boolean | `false` | Overwrite existing configurations and templates. |
| `--quiet` | `-q` | Boolean | `false` | Suppress non-essential output during initialization. |

#### Examples

```bash
# Initialize standard ~/.autonomic workspace
autonomic init

# Force re-initialize workspace templates
autonomic init --force
```

---

### `start`

Boot the entire multi-organ ecosystem or a specific daemon.

```bash
autonomic start [OPTIONS] [ORGAN_NAME]
```

#### Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ORGAN_NAME` | String | `all` | Specific organ to boot (`nerves`, `heart`, `brain`, `spine`, `muscle`, `immune`, `eyes`, `mouth`). |

#### Description

Daemons boot according to topological dependency ordering:
1. `nats-server` / `agent-nerves` (broker and event backbone)
2. `agent-heart` (budget guard and maintenance scheduler)
3. `agent-brain` (memory database and vector catalog)
4. `agent-spine` (workflow execution engine)
5. `agent-muscle` / `agent-immune` / `agent-mouth` / `agent-eyes`

---

### `stop`

Gracefully stop all supervised daemons or a specific organ.

```bash
autonomic stop [ORGAN_NAME]
```

#### Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ORGAN_NAME` | String | `all` | Specific organ to stop. If omitted, all daemons shut down in reverse topological order. |

---

### `restart`

Stop and restart all supervised daemons or a specific organ.

```bash
autonomic restart [ORGAN_NAME]
```

---

### `status`

Display workspace paths, process IDs (PIDs), and real-time healthcheck statuses across all supervised organs.

```bash
autonomic status
```

#### Output Example

```text
ORGAN           PID     STATUS    HEALTH CHECK           LOG FILE
agent-nerves    48201   RUNNING   OK (HTTP :3102)        ~/.autonomic/logs/supervisor/nerves.log
agent-heart     48205   RUNNING   OK (HTTP :3101)        ~/.autonomic/logs/supervisor/heart.log
agent-brain     48210   RUNNING   OK (Stdio Ready)       ~/.autonomic/logs/supervisor/brain.log
agent-spine     48215   RUNNING   OK (HTTP :3100)        ~/.autonomic/logs/supervisor/spine.log
agent-muscle    48220   RUNNING   OK (HTTP :3103)        ~/.autonomic/logs/supervisor/muscle.log
agent-immune    48225   RUNNING   OK (HTTP :3106)        ~/.autonomic/logs/supervisor/immune.log
agent-mouth     48230   RUNNING   OK (HTTP :3104)        ~/.autonomic/logs/supervisor/mouth.log
agent-eyes      48235   RUNNING   OK (HTTP :3105)        ~/.autonomic/logs/supervisor/eyes.log
```

---

### `supervise`

Run the persistent daemon supervisor process in the foreground.

```bash
autonomic supervise
```

> [!NOTE]
> This command is normally executed automatically in the background via macOS `launchd` or systemd. It actively polls daemon PIDs, handles crash recovery with exponential backoff, and flushes heartbeats to the health mesh.

---

### `doctor`

Audit installed organ binaries, verify PATH resolution, test socket permissions, and scan supervisor logs for fatal crashes.

```bash
autonomic doctor [OPTIONS]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--quick` | Boolean | `false` | Fast check: audits binary presence and workspace only, skipping log file scans. |
| `--binaries-only` | Boolean | `false` | Alias for `--quick`. |

---

### `log`

Display or follow daemon logs from `~/.autonomic/logs/supervisor/`.

```bash
autonomic log [OPTIONS] [NAME]
```

#### Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NAME` | String | `None` | Daemon log name (e.g., `spine`, `nerves`, `heart`, `body`) or `all`. |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--follow` | `-f` | Boolean | `false` | Tail log stream continuously (`tail -f`). |
| `--list` | `-l` | Boolean | `false` | List all available log files and file sizes. |

#### Examples

```bash
# List all active daemon logs
autonomic log --list

# Tail agent-spine execution log
autonomic log spine --follow
```

---

### `top`

Live real-time CPU and RAM monitor for all running Autonomic processes.

```bash
autonomic top [OPTIONS]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--refresh` | Integer | `2` | Refresh interval in seconds. |

---

### `tui`

Launch the Ratatui-based Terminal Avionics Dashboard (`agent-tui`).

```bash
autonomic tui [OPTIONS]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--force` | `-f` | Boolean | `false` | Force re-download and re-install `agent-tui` binary if corrupted. |

---

### `ui`

Launch the Autonomic Mission Control web dashboard.

```bash
autonomic ui [OPTIONS]
```

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--open-only` | — | Boolean | `false` | Open the hosted web console in browser without spawning local NATS relay. |
| `--force` | `-f` | Boolean | `false` | Pull the latest web assets and reinstall dependencies. |

---

### `serve-mcp`

Start the unified MCP Gateway server over standard I/O (stdio).

```bash
autonomic serve-mcp
```

Aggregates all organ MCP tools (`muscle_execute_bash`, `spine_submit_workflow`, `heart_budget_status`, `eyes_describe_dom`, `immune_scan_manifest`, `mouth_request_approval`) into a single connection for editors.

---

### `serve-health`

Expose an HTTP health mesh endpoint (`GET /organs/health`).

```bash
autonomic serve-health [OPTIONS]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--port` | Integer | `3200` | Port for HTTP healthcheck listener. |

---

### `install`

Configure the `agent-body` MCP Gateway automatically for external code editors and AI agent hosts.

```bash
autonomic install [HOST] [OPTIONS]
```

#### Arguments

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `HOST` | String | `None` | Target editor: `cursor`, `claude-desktop`, `vscode`, `claude-code`, `opencode`, `codex`, `gemini`, `antigravity`, or `all`. |

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--all` | Boolean | `false` | Configure all detected supported agent hosts. |
| `--global` | Boolean | `true` | Install to global user configuration directory. |
| `--cursor` | Boolean | `false` | Configure Cursor (`~/.cursor/mcp.json`). |
| `--claude-desktop` | Boolean | `false` | Configure Claude Desktop (`claude_desktop_config.json`). |
| `--vscode` | Boolean | `false` | Configure VS Code (`.vscode/mcp.json`). |
| `--claude-code` | Boolean | `false` | Configure Claude Code CLI (`.mcp.json`). |
| `--opencode` | Boolean | `false` | Configure OpenCode (`opencode.json`). |
| `--codex` | Boolean | `false` | Configure Codex (`config.toml` + `hooks.json`). |
| `--gemini` | Boolean | `false` | Configure Gemini CLI (`settings.json`). |
| `--antigravity` | Boolean | `false` | Configure Google Antigravity (`mcp_config.json`). |
| `--print-only` | Boolean | `false` | Print generated JSON configuration to stdout without writing to disk. |

#### Examples

```bash
# Configure Cursor and Claude Desktop globally
autonomic install --cursor --claude-desktop --global

# Preview configuration JSON for Antigravity
autonomic install --antigravity --print-only
```

---

### `launchd`

Manage persistent background daemon execution under macOS `launchd`.

```bash
autonomic launchd <SUBCOMMAND>
```

#### Subcommands

| Subcommand | Description |
| :--- | :--- |
| `install` | Register and load `ai.autonomic.supervisor.plist` into user LaunchAgents. |
| `uninstall` | Unload plist and delete daemon configuration from LaunchAgents. |
| `status` | Query `launchctl list` for supervisor process state. |
