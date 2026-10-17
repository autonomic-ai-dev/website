---
title: Agent TUI (Terminal Observability HUD)
---

# Agent TUI (`agent-tui`)

`agent-tui` is the terminal-native observability console for the Autonomic AI Ecosystem. Built with **Ratatui**, it renders an aerospace-grade HUD inside the developer's terminal, streaming live organ telemetry, memory graph vitals, and DAG execution traces with sub-millisecond refresh rates.

```bash
# Launch the terminal observability console
agent-tui

# Connect to a remote or containerized daemon socket
agent-tui --socket ~/.autonomic/memory/serve.sock
```

---

## Key Capabilities

1. **Live Mesh Telemetry**:
   - Streams heartbeat, memory RSS, and latency metrics across all eleven organs.
   - Monitors NATS JetStream buffer saturation and message throughput.

2. **DAG Step Visualizer**:
   - Displays real-time step progressions from `agent-spine` workflows.
   - Highlights running, completed, or failed steps with interactive log expansion.

3. **Memory & Token Gauges**:
   - Visualizes `agent-heart` token budget headroom, active turn consumption, and GC reclamation cycles.

4. **Zero-Overhead ANSI Rendering**:
   - Non-blocking async event loop using Tokio and Crossterm.
