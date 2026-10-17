# Host integration guide

agent-brain is a **stdio MCP server**. Any editor or CLI that supports MCP can use the same binary — only the config file location and JSON shape differ.

## Quick install

```bash
# Cursor (global + hooks + project rule)
agent-brain install --global

# Claude Desktop
agent-brain install --claude-desktop

# VS Code — workspace `.vscode/mcp.json`
agent-brain install --vscode

# VS Code — user profile (all workspaces)
agent-brain install --vscode --global

# Claude Code — project `.mcp.json`
agent-brain install --claude-code

# Claude Code — all projects (`~/.claude.json`)
agent-brain install --claude-code --global

# OpenCode — project `opencode.json`
agent-brain install --opencode

# OpenCode — user config (`~/.config/opencode/opencode.json`)
agent-brain install --opencode --global

# Codex / Gemini / Antigravity CLI (MCP + route gates)
agent-brain install --codex --global
agent-brain install --gemini --global
agent-brain install --antigravity --global

# Everything at once
agent-brain install --all --global
```

Print JSON without writing files:

```bash
agent-brain install --print-only
agent-brain install --vscode --print-only
agent-brain install --opencode --print-only
```

## Config file locations

| Host | Scope | File |
|------|-------|------|
| **Cursor** | global | `~/.cursor/mcp.json` |
| **Cursor** | workspace | `.cursor/mcp.json` |
| **Claude Desktop** | user | macOS: `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **VS Code** | workspace | `.vscode/mcp.json` |
| **VS Code** | user | macOS: `~/Library/Application Support/Code/User/mcp.json` |
| **Claude Code** | project | `.mcp.json` (repository root) |
| **Claude Code** | user | `~/.claude.json` |
| **OpenCode** | project | `opencode.json` (repository root) |
| **OpenCode** | user | `~/.config/opencode/opencode.json` (macOS/Linux) |
| **Codex** | user | `~/.codex/config.toml` (+ `~/.codex/hooks.json`) |
| **Gemini CLI** | user | `~/.gemini/settings.json` |
| **Antigravity CLI** | user | `~/.gemini/antigravity/mcp_config.json` (+ `~/.gemini/config/mcp_config.json`) |

### JSON shape

**Cursor / Claude Desktop / Claude Code** use `mcpServers`:

```json
{
  "mcpServers": {
    "agent-brain": {
      "command": "/absolute/path/to/agent-brain",
      "args": ["serve"],
      "env": { "RUST_LOG": "agent_brain=info" }
    }
  }
}
```

**VS Code** uses `servers` with `type: "stdio"`:

```json
{
  "servers": {
    "agent-brain": {
      "type": "stdio",
      "command": "/absolute/path/to/agent-brain",
      "args": ["serve"]
    }
  }
}
```

**Claude Code** project/user entries also include `"type": "stdio"`.

**OpenCode** uses a top-level `mcp` object with `type: local` and `command` as an array:

```json
{
  "mcp": {
    "agent-brain": {
      "type": "local",
      "command": ["/absolute/path/to/agent-brain", "serve"],
      "enabled": true,
      "environment": { "RUST_LOG": "agent_brain=info" }
    }
  }
}
```

## Required agent workflow

Every host should call these MCP tools:

1. **`route_task`** — start of each user turn (before planning or edits)
2. **`store_memory`** — end of task when a durable decision was made (max 50 words)

Other tools (`get_context`, `route_to_mcp`, `import_memory`, …) are optional.

Readable route summary: `~/.autonomic/memory/logs/last-route.md` or `agent-brain briefing`.

## Hook parity matrix

| Host | `route_task` gate | How enforced |
|------|-------------------|--------------|
| **Cursor** | Yes | `~/.cursor/hooks.json` → `route_gate.py` (installed by `install --global`) |
| **Claude Code** | Yes (agent-brain MCP) | `.claude/settings.json` → `route_gate.py` on `UserPromptSubmit` + Pre/PostToolUse `matcher: .*` (scope still `brain_mcp`); hard rule `.claude/rules/agent-brain-route.md` |
| **Codex** | Yes (agent-brain MCP) | `~/.codex/hooks.json` → `route_gate.py` (installed by `install --codex --global`) |
| **OpenCode** | Plugin (agent-brain MCP) | `plugin/agent-brain-route-gate.ts` + `rules/agent-brain-route.md` — blocks `agent-brain_*` tools; fail-closed if gate script missing |
| **Gemini / Antigravity CLI** | Yes (agent-brain MCP) | Shared `~/.gemini/settings.json` BeforeAgent/BeforeTool + Antigravity MCP configs + `~/.gemini/antigravity/rules/agent-brain-route.md` |
| **VS Code** | Rule-only | Add Copilot/custom instructions (see below) |
| **Claude Desktop** | Rule-only | Paste rule into project/system instructions |
| **Windsurf / Zed / other** | Manual | Copy `mcpServers` block; add equivalent rule text |

Cursor has the strongest host-tool gate (hooks on Read/Shell). Claude Code, Codex, Gemini/Antigravity, and OpenCode enforce **agent-brain MCP tools** until `route_task` via hooks/plugins. VS Code and Claude Desktop rely on rules/instructions plus operator discipline.

Reinstall all hosts: `agent-brain install --all --global` or `agent-brain doctor --fix`.

### VS Code instructions snippet

Add to `.github/copilot-instructions.md` or your user Copilot instructions:

```markdown
## agent-brain MCP

At the start of every user turn, call the `route_task` MCP tool on server `agent-brain`
with `user_message`, `current_working_directory`, and `open_files`. Apply returned
skills, rules, and memory. At task end, call `store_memory` for durable outcomes.
```

### OpenCode gotchas

- Tool names are `agent-brain_<tool>` (not `mcp_agent-brain_*`). The route gate plugin and `route_gate.py` recognize both forms.
- If the plugin cannot find `route_gate.py`, **agent-brain tools are denied** until you run `agent-brain install --opencode --global`.
- Ensure `plugin` array in `opencode.json` includes `agent-brain-route-gate`.
- Restart OpenCode after install so the plugin reloads.

## Claude Code gotchas

- **Do not** put `mcpServers` in `~/.claude/settings.json` — Claude Code **silently ignores** it.
- User-scoped servers belong in **`~/.claude.json`** (top-level `mcpServers`).
- Project-scoped servers belong in **`.mcp.json`** at the repo root (not inside `.claude/`).
- After editing, start a new session and run `/mcp` to verify connection.
- Run `/hooks` and trust agent-brain route gate hooks if prompted.
- PreToolUse matcher is `.*` (every tool hits the gate); `AGENT_BRAIN_ROUTE_GATE_SCOPE=brain_mcp` still allows Read/Bash while blocking other agent-brain MCP tools.
- Doctor reports `stale (reinstall)` if settings still use the old `mcp__agent-brain__.*` matcher — run `doctor --fix`.
- Reinstall hooks: `agent-brain install --claude-code --global` or `agent-brain doctor --fix`.

## Antigravity CLI gotchas

- MCP lives in `~/.gemini/antigravity/mcp_config.json` (plus `~/.gemini/config/mcp_config.json` for Antigravity 2.0).
- Route gate hooks are **shared** with Gemini CLI in `~/.gemini/settings.json` — trust them in the `/hooks` panel.
- Hard rule: `~/.gemini/antigravity/rules/agent-brain-route.md`.
- Refresh: `agent-brain install --antigravity --global` or `agent-brain doctor --fix`.

## macOS codesign

Cursor launches MCP via taskgated. Use a **Developer ID–signed** binary (CI release or `make release-macos`). Install only clears quarantine and verifies the signature.

```bash
# Prefer the GitHub release, or:
make release-macos
agent-brain doctor --fix    # clear quarantine + align mcp.json (never re-signs)
```

## Index paths (already wired)

agent-brain indexes skills/agents/rules from:

- `~/.cursor/`, `~/.claude/`, `~/.codex/`
- `~/.agent_brain/packages/*`
- Project `.cursor/rules`, `.claude/agents`, etc.

No extra index configuration is required per host — installers only register the MCP server.

## Verification checklist

| Host | Verify |
|------|--------|
| Cursor | Settings → MCP shows agent-brain; hooks enabled; `route_task` in MCP log |
| Claude Desktop | Hammer icon; Developer → MCP logs |
| VS Code | Command Palette → “MCP: List Servers” → agent-brain connected |
| Claude Code | `/mcp` lists agent-brain; `/hooks` shows route gate; other MCP tools blocked until `route_task` |
| OpenCode | `opencode mcp list` shows agent-brain; restart session if needed |
