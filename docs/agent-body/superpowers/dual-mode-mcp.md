# Dual-Mode MCP

Autonomic AI ships two MCP entry points that work together:

| Mode | Binary | When to use |
|------|--------|-------------|
| **Brain-direct** | `agent-brain serve` | Routing, memory, skills, rules, bounded file tools, `route_to_mcp` upstream |
| **Body gateway** | `agent-body serve-mcp` | Unified organ surface (`muscle_*`, `heart_*`, `spine_*`, …) with fault isolation |

Install both (recommended):

```bash
agent-brain install --all --global   # MCP + hooks + instructions for all supported hosts
agent-brain doctor --mcp             # audit schemas, federation, upstream config
agent-brain doctor --fix             # realign paths, hooks, dual MCP entries
```

Verify tools list with non-empty `inputSchema`:

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n' | agent-body serve-mcp 2>/dev/null | head -c 2000
```

---

## Architecture

```
IDE (Cursor / OpenCode / Claude Code / Codex / Gemini)
  │
  ├── agent-brain serve          ← route_task gate, context, memory
  │
  └── agent-body serve-mcp       ← organ tools (optional second server)
          │
          ├── agent-muscle   muscle_execute_bash, …
          ├── agent-heart    heart_budget_status, heart_gc, …
          ├── agent-spine    spine_submit_workflow, …
          └── … (discovered via config or NATS)
```

**Federation:** `agent-brain route_to_mcp` can call tools on upstream MCP servers (including `agent-body`) configured in `~/.autonomic/config.toml` under `[brain.upstream_mcp]`.

**Standalone → cluster:** Organs can run stdio MCP locally or register on NATS when a broker is present. The IDE config change is usually swapping or adding `agent-body serve-mcp` alongside `agent-brain serve`.

See also: [superpowers spec](./superpowers/specs/dual-mode-mcp.md) for organ rollout phases.

---

## AF4 Builder Blueprint mapping

Marketing narrative vs what is reliably shipped today:

### Step 1 — Automating context (30-day milestone)

| Claim | Organ | Shipped today | Gap |
|-------|-------|---------------|-----|
| Background context daemon | agent-brain | **Partial** — `serve` is stdio MCP per IDE session, not a always-on daemon | No shared background indexer process across hosts |
| Auto-inject code/schemas per turn | agent-brain | **Yes** — `route_task` returns skills, rules, memory, session digests | Quality depends on index freshness (`graphify`, `trigger_deep_analysis`) |
| AST / graph navigation | agent-brain | **Yes** — `query_codebase`, `search_symbols`, bounded reads | Needs graphify job for unfamiliar repos |
| Cross-session memory | agent-brain | **Yes** — `store_memory`, scratchpad, team memory in `route_task` | Operator must call `store_memory` at task end |
| Dual-mode context + organs | agent-body | **Yes** — v0.5.15+ gateway with proper tool schemas; install adds both servers | NATS mesh discovery still config-first |

### Step 2 — 3-agent pipelines (60-day milestone)

| Claim | Organ | Shipped today | Gap |
|-------|-------|---------------|-----|
| YAML DAG workflows | agent-spine | **Yes** — workflows in registry, `spine_submit_workflow` via gateway | CI wiring is manual |
| Sandboxed execution | agent-muscle | **Partial** — `muscle_execute_bash` with timeout; not Firecracker by default | `immune_sandbox_run` is roadmap |
| Human approval gate | agent-mouth | **Partial** — `mouth_request_approval` exists; Slack/webhook setup manual | Not on every destructive path by default |

### Step 3 — CI/CD safety gates (90-day milestone)

| Claim | Organ | Shipped today | Gap |
|-------|-------|---------------|-----|
| Vulnerability / manifest scan | agent-immune | **Partial** — tools exist; GH Action templates not one-click | Org-specific policy YAML |
| Budget / loop guard | agent-heart | **Partial** — `heart_budget_status`, GC tools via MCP | Not wired into every CI pipeline by default |
| Pre-merge agent gate | immune + spine | **Aspirational** — compose via spine workflow + immune tools | No single `af4-pre-merge` product button |

### Interface layer (this repo’s focus)

| Claim | Shipped | Notes |
|-------|---------|-------|
| `agent-body serve-mcp` as single organ entry | **Yes** (v0.5.15+) | `#[tool_router]` schemas; 17 gateway tools |
| Install adds brain + body to Cursor/OpenCode | **Yes** (agent-brain v0.33.3+) | `mcp_federation.rs`, `doctor --mcp` |
| Gateway enforces `route_task` before organ tools | **No** | Enforcement is host-side via agent-brain hooks |
| NATS auto-discovery | **Partial** | Config fallback when broker absent |

**Bottom line:** The AF4 story is directionally correct. Steps 1–2 are usable in IDE sessions today; Step 3 and full autonomous CI orchestration still need explicit workflow wiring.

---

## Host enforcement matrix

`route_task` must run at the start of every user turn. Enforcement strength varies by host API:

| Host | MCP | Hook / plugin | Scope | Strength |
|------|-----|---------------|-------|----------|
| **Cursor** | `~/.cursor/mcp.json` | `hooks.json` → `route_gate.py` | `brain_mcp` default; optional `all` | **Strong** — blocks agent-brain MCP tools; optional Read/Shell steer |
| **OpenCode** | `opencode.json` → `mcp` | `agent-brain-route-gate.ts` plugin | `brain_mcp` | **Medium** — blocks `agent-brain_*` tools; fail-closed if gate missing |
| **Claude Code** | `.mcp.json` / `~/.claude.json` | `.claude/settings.json` hooks | `mcp__agent-brain__.*` | **Medium** — MCP tools only |
| **Codex** | `~/.codex/config.toml` | `~/.codex/hooks.json` | `brain_mcp` | **Medium** — MCP tools only |
| **Gemini CLI** | `~/.gemini/settings.json` | BeforeTool / AfterTool hooks | `brain_mcp` | **Medium** — MCP tools only |
| **VS Code / Copilot** | `mcp.json` | Instructions only | — | **Advisory** |
| **Claude Desktop** | `claude_desktop_config.json` | Instructions only | — | **Advisory** |

### Install commands

```bash
agent-brain install --global              # Cursor
agent-brain install --opencode --global   # OpenCode + plugin + rules
agent-brain install --claude-code --global
agent-brain install --codex --global
agent-brain install --gemini --global
agent-brain install --all --global        # All of the above
```

### Environment knobs

| Variable | Default | Effect |
|----------|---------|--------|
| `AGENT_BRAIN_ROUTE_GATE_SCOPE` | `brain_mcp` | `all` = gate every tool (Cursor legacy strict) |
| `AGENT_BRAIN_ROUTE_HOOKS` | `1` | Set `0` to disable hooks |
| `AGENT_BRAIN_ROUTE_OFFLINE_SECS` | `1800` | Proceed-with-warning after MCP offline |

### Verify enforcement

```bash
agent-brain doctor
agent-brain briefing                      # last route_task summary
cat ~/.agent_brain/logs/last-route.md
```

OpenCode should show: `OK (MCP + instructions + plugin + mode)`. Partial status means re-run `agent-brain install --opencode --global` or `doctor --fix`.

---

## Checklist for teams

1. Install binaries: `autonomic update` or release binaries on PATH.
2. Run `agent-brain install --all --global`.
3. Run `agent-brain doctor --fix` and `agent-brain doctor --mcp`.
4. Restart IDE MCP servers (Cursor: reload; OpenCode: restart; Claude Code: `/mcp`).
5. Confirm `route_task` in `~/.agent_brain/logs/last-route.md` after first turn.
6. Add `[brain.upstream_mcp]` if using `route_to_mcp` to reach `agent-body` without a second IDE server.
7. For CI: add spine workflow + immune scan steps explicitly (not automatic yet).

---

## Related docs

- [agent-brain host integration](https://github.com/autonomic-ai-dev/agent-brain/blob/master/docs/host-integration.md)
- [Autonomic Architecture Hub](https://autonomic-ai.dev/docs/architecture)
- [Organ MCP rollout spec](./superpowers/specs/dual-mode-mcp.md)
