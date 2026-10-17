---
title: MCP Gateway Protocol (Dual-Mode Integration)
---

# Model Context Protocol (MCP) Integration

The Autonomic ecosystem integrates seamlessly with modern AI coding environments—including **Cursor**, **Claude Desktop**, **VSCode**, **Claude Code**, and **Antigravity**—via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

Autonomic supports **Dual-Mode MCP Transport**:
1. **Standalone Stdio Mode**: Individual organs (like `agent-brain`) run as independent stdio processes spawned directly by the IDE.
2. **Unified Gateway Mode**: `autonomic serve-mcp` boots as a single master MCP gateway that dynamically aggregates tool definitions across all running daemons over the internal NATS JetStream bus.

```mermaid
flowchart TD
    subgraph Hosts["Host AI Coding Environments"]
        Cursor["Cursor IDE"]
        Claude["Claude Desktop / Code"]
        Anti["Antigravity / Gemini CLI"]
    end

    subgraph DualMode["Dual-Mode MCP Transport Layer"]
        Gateway["Unified Gateway\n(autonomic serve-mcp)"]
        Direct["Standalone Stdio Proxy\n(agent-brain serve)"]
    end

    Hosts -->|stdio / JSON-RPC| Gateway
    Hosts -->|stdio / JSON-RPC| Direct

    Gateway --> Mesh["NATS JetStream Bus (:4222)"]
    Direct --> Sock["serve.sock\n(Lock-Free Background Daemon)"]

    subgraph Organs["11 Distributed Organs"]
        Mesh --> Body["agent-body (Catalog)"]
        Mesh --> Brain["agent-brain (Routing)"]
        Mesh --> Spine["agent-spine (Workflows)"]
        Mesh --> Muscle["agent-muscle (Execution)"]
        Mesh --> Immune["agent-immune (Security)"]
        Mesh --> Heart["agent-heart (Budget)"]
        Mesh --> Eyes["agent-eyes (Vision)"]
        Mesh --> Mouth["agent-mouth (Ingress)"]
    end

    classDef host fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef transport fill:#0ea5e9,stroke:#0284c7,stroke-width:2px,color:#080b10;
    classDef organ fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff;
    class Cursor,Claude,Anti host;
    class Gateway,Direct,Mesh,Sock transport;
    class Body,Brain,Spine,Muscle,Immune,Heart,Eyes,Mouth organ;
```

---

## The `route_task` Enforcement Gate

When an agent executes in your IDE, `agent-brain` intercepts the turn using host shell and MCP hooks:
1. **Interception**: Any attempt to run shell tools or modify files is blocked until `route_task` is called.
2. **Context Synthesis**: `route_task` evaluates the user's intent and returns a token-bounded (~500 tokens) payload of ranked skills, codebase rules, and verified recipes.
3. **Unlocking**: Once context is injected, all other tools are unlocked for the agent's turn.

---

## Editor Configuration & Quick Install

Configure your development environment with one automated command:

```bash
# Global setup: automatically detects and configures Cursor, Claude Desktop, and Claude Code
agent-brain install --global

# Target specific IDEs individually:
agent-brain install --cursor
agent-brain install --claude-desktop
agent-brain install --opencode
```

### Manual Configuration Snippet (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "agent-brain": {
      "command": "agent-brain",
      "args": ["serve"]
    },
    "autonomic-cluster": {
      "command": "autonomic",
      "args": ["serve-mcp", "--all"]
    }
  }
}
```
