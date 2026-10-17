# agent-body Roadmap

## ✅ Completed Features
- **The `autonomic-core` Crate:** Shared type schemas, `nats.rs` message payloads, and execution state structs.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Universal `autonomic` CLI Wrapper:** Routes `autonomic <organ> …` to `agent-{organ}` binaries on PATH.
- [x] **TUI Dashboard:** `autonomic tui` monitors CPU/RAM for agent-* and nats-server processes.

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Enforce `~/.autonomic/` as the standard configuration and logging directory across all peripheral organs.
- [x] **Unified Configs:** Establish `~/.autonomic/config.toml` as the singular source of truth for all API keys and rules.
- [x] **Daemon Supervisor:** `autonomic start|stop|restart|supervise` with ordered lifecycle, HTTP health checks, PID files, and `status.json`.
