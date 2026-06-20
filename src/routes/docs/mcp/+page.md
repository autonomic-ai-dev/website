---
title: MCP Integration
---

# Model Context Protocol (MCP) Integration

The Autonomic ecosystem seamlessly integrates with modern AI coding environments—such as **Cursor**, **Claude Desktop**, **VSCode**, and **Claude Code**—through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

Instead of replacing your favorite editor, Autonomic acts as the local "brain" for the agent running inside it. The `agent-brain` daemon operates as an MCP server, providing your editor's AI with a curated set of tools, rules, and temporal memory.

## Why use agent-brain with MCP?

Most AI coding agents load all available project instructions, documentation, and tools into the context window at once. This leads to three major problems:
1. **Context Bloat:** Stuffing hundreds of rules degrades the model's reasoning capabilities and wastes tokens.
2. **Soft Enforcement:** System prompts that say "always use these skills" are frequently ignored by the model.
3. **Amnesia:** When you correct an agent's behavior, that correction is lost as soon as you start a new chat session.

`agent-brain` solves this by introducing a **local context engine** that sits between your editor and the model.

### The `route_task` Gate

When you ask your AI assistant to perform a task, the `agent-brain` MCP server enforces a strict Hook Gate:
1. The model is *forced* to call the `route_task` MCP tool before it can use any other tools (like file editing or terminal execution).
2. `route_task` takes the user's prompt and queries the local SQLite Knowledge Graph.
3. It retrieves only the *most relevant* ~500 tokens of rules, skills, and past memories for that specific request.
4. Once `route_task` completes, the context is returned, and the rest of the tools are unlocked for the agent to use.

This guarantees that the model receives precisely what it needs to succeed, without overflowing the context window.

## Durable Memory

As you work with the agent in your IDE, you can instruct it to remember specific conventions (e.g., "Always use `Tailwind` for styling in this project").

The agent will call the `store_memory` MCP tool. Instead of saving this to a static markdown file, `agent-brain` stores it in its temporal Knowledge Graph (`brain.db`). 
- Facts are stored immutably with `valid_from` timestamps.
- If a rule changes later, the old rule is marked `invalid_at`, preserving the historical context of *why* older code looks the way it does.

The next time you open a new session in your IDE and ask a related question, `route_task` will automatically inject that stored memory into the context.

## Installation and Configuration

You do not need to start the MCP server manually. Your IDE will spawn it automatically when you start a chat session.

To configure your editor to use `agent-brain`, run:

```bash
agent-brain install --global
```

This command:
1. Locates the configuration files for supported editors (e.g., `~/.cursor/mcp.json`).
2. Injects the `agent-brain` MCP server configuration.
3. Configures the lifecycle hooks that enforce the `route_task` gate.

### Supported Editors

- **Cursor:** Automatically configured via `mcp.json`. You may need to restart the editor or toggle the server in Settings -> MCP.
- **Claude Desktop:** Configured via `claude_desktop_config.json`.
- **VSCode (with relevant extensions):** Configured via the standard MCP extension path.
- **Claude Code (CLI):** Supported out-of-the-box.
- **OpenCode & Codex:** Full integration supported.

You can explicitly target a single editor:
```bash
agent-brain install --cursor
agent-brain install --claude-desktop
```
