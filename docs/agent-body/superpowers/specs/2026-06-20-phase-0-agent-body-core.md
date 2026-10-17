# Phase 0: agent-body-core + Wake-On-Call

**Date:** 2026-06-20
**Bumps:** agent-brain v0.25.0, agent-spine v0.10.0, agent-body v0.1.0

## Scope

Stand up the agent-body workspace as the shared foundation. Two deliverables in one release.

## Deliverable A: agent-body/core crate

### Layout

```
agent-body/
  Cargo.toml              # [workspace]
  core/
    Cargo.toml            # agent-body-core v0.1.0
    src/
      lib.rs              # Re-exports all public types
      provenance.rs       # BrainProvenance
      execution.rs        # ExecutionId (UUID v7)
      context.rs          # ContextBundle, RouteLimits, TaskKind, ScoredItem
      error.rs            # CoreError enum
```

### Types to consolidate

| Type | agent-brain location | agent-spine location |
|------|---------------------|----------------------|
| BrainProvenance | bridge.rs | brain_router.rs (divergent fields) |
| ExecutionId | — | execution.rs |
| ContextBundle | types.rs (subset) | brain_router.rs (internal) |
| RouteLimits | types.rs | brain_router.rs (internal) |
| TaskKind | types.rs | — |
| ScoredItem | types.rs | — |

### Cargo.toml (core)

```toml
[package]
name = "agent-body-core"
version = "0.1.0"
edition = "2024"

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
uuid = { version = "1", features = ["v7", "serde"] }
thiserror = "2"
```

### Migration

agent-brain Cargo.toml:
```toml
[dependencies]
agent-body-core = { git = "https://github.com/autonomic-ai-dev/agent-body" }
```

agent-spine Cargo.toml:
```toml
[dependencies]
agent-body-core = { git = "https://github.com/autonomic-ai-dev/agent-body" }
```

Dev workflow: push agent-body changes first, update Cargo.lock in brain/spine. CI pins to a git ref.

## Deliverable B: Wake-On-Call

### Location

New file agent-spine `src/wake_on_call.rs`

### Logic in McpBridge::connect()

1. If handshake fails, scan:
   - `$BRAIN_PATH` env var
   - `which agent-brain` / `where agent-brain`
   - Common install paths: `/usr/local/bin/agent-brain`, `~/.cargo/bin/agent-brain`, `~/.local/bin/agent-brain`
2. If found, spawn `Command::new("agent-brain").arg("serve").kill_on_drop(true)`
3. Poll health: retry MCP handshake every 200ms, max 30 attempts (6s)
4. On success, proceed with `_brain_spawned: true` in payload
5. On failure, warn and operate with ConfidenceRouter fallback
