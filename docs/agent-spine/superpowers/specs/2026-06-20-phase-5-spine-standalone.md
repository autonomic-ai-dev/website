# Phase 5: agent-spine Standalone Gaps

**Date:** 2026-06-20
**Bumps:** agent-spine v0.14.0

**Status (2026-10-20 audit):** Not implemented. The `agent-spine` source has no `readonly_rootfs`, `network_disabled` or Docker sandbox code. Treat this document as a proposal until that code exists.

## v0.14.0 — Docker Sandbox Execution

### Problem

NodeKind::Sandbox is a pass-through delegate. SandboxConfig exists but no actual Docker isolation. LLM-generated bash scripts can access host filesystem.

### New module

`agent-spine/src/sandbox.rs`

### Dependency

```toml
bollard = "0.18"
```

### Execution flow

1. Pre-flight: verify Docker daemon is reachable via bollard::Docker::connect_with_local_defaults()
2. Image pull: sandbox_config.image or default `docker.io/library/ubuntu:latest`
3. Container creation:

```rust
CreateContainerOptions {
    name: Some(format!("agent-spine-{}-{}", execution_id, node_name)),
},
Config {
    image: Some(image),
    cmd: Some(vec!["/bin/bash", "-c", &bash_command]),
    network_disabled: Some(true),
    readonly_rootfs: Some(true),
    ..Default::default()
}
```

### Security constraints

- network_disabled: true — no egress
- readonly_rootfs: true — container filesystem read-only
- Workspace bind-mounted read-only
- /tmp/agent-spine-output bind-mounted writable for results
- Memory and CPU limits from sandbox_config
- Hard kill via Docker API on timeout

### Output capture

Stream stdout/stderr via attach_container, collect into payload.

### Cleanup

Always remove_container with force: true in Drop guard.

### Graceful degradation

- Docker unavailable: warn and refuse
- `--unsafe` flag on `agent-spine run` bypasses sandbox
- `agent-spine doctor` checks Docker availability

### YAML usage

```yaml
- name: ReproduceVulnerability
  kind: sandbox
  description: "Reproduce in isolated environment"
  sandbox_config:
    image: "python:3.12-slim"
    timeout_secs: 120
    memory_mb: 512
    cpu_shares: 512
```
