---
title: Agent TUI — Terminal Observability HUD (agent-tui)
---

# `agent-tui` — Terminal Observability HUD

`agent-tui` is the terminal-native observability console for the Autonomic AI ecosystem. Built with **Ratatui** and **Crossterm** in Rust, it renders an aerospace-grade avionics HUD inside the developer's terminal, streaming live organ telemetry, memory graph vitals, and DAG execution traces with sub-millisecond refresh rates and zero CPU overhead.

```mermaid
flowchart TD
    Socket["serve.sock / NATS Stream"] --> EventLoop["Tokio Async Event Loop\n(120 FPS Tick Buffer)"]
    EventLoop --> State["Ecosystem Vitals State Model"]
    
    subgraph HUDLayout["Ratatui Terminal Canvas"]
        Header["Avionics Header (Darwin ARM64 / Status / UTC)"]
        Mesh["Organ Mesh Matrix (11 Daemons Health)"]
        DAG["Spine DAG Step Tree Visualizer"]
        Gauges["Memory RSS & Token Budget Gauges"]
        LogViewer["Unified Color-Coded Log Stream"]
    end

    State --> Header
    State --> Mesh
    State --> DAG
    State --> Gauges
    State --> LogViewer

    classDef tui fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef hud fill:#0f172a,stroke:#0ea5e9,stroke-width:2px,color:#f8fafc;
    class Socket,EventLoop,State tui;
    class Header,Mesh,DAG,Gauges,LogViewer hud;
```

---

## Architectural Invariants

### 1. Direct Socket Streaming (Zero Polling Overhead)
Unlike web UIs that rely on periodic HTTP polling intervals, `agent-tui` connects directly to the Unix Domain Socket (`~/.autonomic/memory/serve.sock`) or the NATS JetStream telemetry subject (`autonomic.telemetry.*`). State updates are pushed reactively; idle terminal CPU consumption remains under 0.1%.

### 2. Ratatui Double-Buffered Canvas
The TUI uses double-buffered terminal rendering via `ratatui`. Screen redraws calculate minimal character diffs, eliminating screen flicker even when high-velocity logs and 100+ node DAG executions stream concurrently.

### 3. Integrated Keyboard Command Matrix
Operators can navigate through running DAGs, zoom into failure logs, trigger manual garbage collection pulses, or pause workflows directly from the keyboard without touching a mouse.

---

## Keyboard Navigation & Shortcuts

| Keybinding | Action | Description |
| :--- | :--- | :--- |
| **`Tab` / `Shift+Tab`** | Switch Active Panel | Cycles focus between Organ Mesh, DAG Visualizer, and Logs. |
| **`j` / `k`** or **`↑` / `↓`**| Navigate Items | Scrolls through active nodes, PR lists, or log history. |
| **`Enter`** | Expand Node Details | Opens detailed stdout, stderr, and snapshot metadata for a step. |
| **`g`** | Trigger Manual GC | Sends an immediate garbage collection signal to `agent-heart`. |
| **`r`** | Rerun Step | Prompts `agent-spine` to replay execution from previous snapshot. |
| **`q` / `Esc`** | Detach Console | Gracefully disconnects from socket without stopping background daemons. |

---

## CLI Command Reference

```bash
# 1. Launch terminal HUD connecting to local default socket
agent-tui

# 2. Connect to a custom socket path or remote cluster proxy
agent-tui --socket ~/.autonomic/memory/serve.sock

# 3. Specify terminal refresh rate (Hz)
agent-tui --fps 60

# 4. Filter HUD to a specific organ subsystem
agent-tui --organ spine
```
