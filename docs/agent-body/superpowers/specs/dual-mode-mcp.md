# Dual-Mode MCP Strategy: Ecosystem-Wide Conversion

Autonomic AI's value proposition is **Dual-Mode Architecture**: developers can use individual components as standalone MCP tools in their IDE, or compose them into a full cluster with deterministic orchestration and zero-trust sandboxes.

Currently, only agent-brain supports MCP natively. This plan covers which remaining organs get MCP surfaces, what tools they expose, and the implementation path.

---

## Tool Naming Convention

All MCP tools follow: `{organ}_{verb}_{noun}`.

```
muscle_execute_bash     ← organ=muscle, verb=execute, noun=bash
immune_scan_manifest    ← organ=immune, verb=scan,    noun=manifest
heart_budget_status     ← organ=heart,  verb=budget,  noun=status
```

This prevents collisions in the gateway and makes tool provenance obvious to the LLM.

---

## Phase 0: agent-heart (Partial MCP)

**Why:** Agent-heart runs as a background daemon today — budget tracking, GC, memory distillation. It already has the state the LLM needs. Exposing a few read-only tools directly addresses three feedback items from the agent-brain analysis doc: cost awareness, memory bloat, and auto-distillation.

**Not recommended for MCP:** `heart`'s AST-level bash safety and cron scheduler should remain fully autonomous. The LLM shouldn't manually trigger or tune these.

| Tool | Description |
|------|-------------|
| `heart_budget_status` | Return current token/cost consumption across the session |
| `heart_gc` | Run memory garbage collection (dedup, prune, vacuum) |
| `heart_memory_distill` | Summarize related facts into higher-level concepts |

---

## Phase 1: agent-muscle (Execution Engine)

**Why:** Allows the IDE LLM to dispatch heavy background tasks without blocking. Highest immediate value for everyday development.

**Not recommended:** `muscle_finetune` — LoRA fine-tuning is too niche for an MCP tool. If needed later, it can be added as a second-phase tool.

| Tool | Description |
|------|-------------|
| `muscle_execute_bash` | Execute a shell script/command via `tokio::process::Command`. Returns stdout, stderr, exit code. Timeout enforced. |
| `muscle_execute_python` | Run a Python snippet in an isolated interpreter. Useful for data transformations the LLM can't do inline. |

---

## Phase 2: agent-eyes (Visual QA)

**Why:** Lets the LLM "see" local UI changes without uploading screenshots to third-party APIs. Critical for frontend work.

| Tool | Description |
|------|-------------|
| `eyes_describe_dom` | Parse raw HTML into a token-efficient JSON layout of interactive elements |
| `eyes_diff_screenshots` | Capture a localhost URL screenshot and pixel-diff against a baseline |
| `eyes_vlm_caption` | Run a local Candle LLaVA model to caption an image |

---

## Phase 3: agent-immune + agent-mouth (Security Gates)

**Why:** Enterprise-grade safety for autonomous agent actions. Verify code before running it; ask humans before destroying things.

| Tool | Description |
|------|-------------|
| `immune_scan_manifest` | Fuzz `Cargo.toml`, `package.json`, or `requirements.txt` against OSV.dev for known CVEs |
| `immune_sandbox_run` | Execute an untrusted script in a Firecracker microVM; return output and risk score |
| `immune_lint_ast` | Run tree-sitter AST linting against security policy |
| `mouth_validate_ast` | Pass a bash command through the tree-sitter AST to check if it violates policy |
| `mouth_request_approval` | Fire a Slack/Discord webhook for human approval before destructive ops |

---

## Phase 4: agent-spine (DAG Orchestrator)

**Why:** Complex multi-step workflows (deployments, migrations) need deterministic orchestration outside the LLM's context window.

| Tool | Description |
|------|-------------|
| `spine_submit_workflow` | Upload a YAML DAG definition for execution |
| `spine_check_status` | Poll workflow status by ID |
| `spine_list_workflows` | List recent workflows with their current state |

---

## Organs Excluded from Direct MCP

| Organ | Reason |
|-------|--------|
| **agent-nerves** | Internal NATS mesh layer. The LLM should never inspect stream replicas or re-route subjects. |
| **agent-heart** (cron + AST safety) | Background autonomous functions. The GC and budget tools in Phase 0 are the *only* heart tools exposed. |

---

## Gateway Architecture

`agent-body` becomes the single MCP entry point:

```
LLM (Cursor/OpenCode/Claude Code)
  │
  └── stdio ──► agent-body serve-mcp
                    │
                    ├── NATS discovery ──► agent-brain (route_task, store_memory, ...)
                    ├── NATS discovery ──► agent-muscle (muscle_execute_bash, ...)
                    ├── NATS discovery ──► agent-eyes (eyes_diff_screenshots, ...)
                    └── ... (all other organs with serve-mcp running)
```

### Discovery

Two modes:

1. **NATS-based** (full cluster): Gateway broadcasts a discovery request on `tools.discover`. Each daemon responds with its tool registry.
2. **Config-based** (standalone): Gateway reads `~/.autonomic/config.toml` for static organ paths. Falls back to this when NATS is absent.

### Fault Isolation

If agent-muscle crashes out of memory during a heavy compile, the Gateway catches the timeout and returns a standard MCP error. The LLM connection survives and the agent can self-correct. This is the key architectural win over running separate MCP servers per organ.

---

## Standalone → Cluster Transition

Each binary auto-detects NATS on startup:

1. **Standalone mode** (default): Binary listens on stdio, serves its tools directly. No mesh, no discovery.
2. **Cluster mode**: When binary detects `NATS_URL` or a local broker socket, it switches to mesh mode — connects to NATS, registers tools, stops listening on stdio.

The user only changes one thing in their IDE config: the MCP server command from `agent-brain serve-mcp` to `agent-body serve-mcp`.

---

## Migration: Existing agent-brain Tools

agent-brain already exposes ~15 MCP tools (`route_task`, `search_symbols`, `store_memory`, etc.). In the gateway:

- agent-brain continues to run its own `serve-mcp` subcommand
- The gateway discovers brain's tools via NATS (cluster) or config (standalone)
- No changes needed to brain's tool implementations — they coexist in the aggregated registry

---

## Open Questions

| Question | Position |
|----------|----------|
| Auth model: which tools need HITL? | `mouth_request_approval`, `spine_submit_workflow` (when destructive), `immune_sandbox_run`. Read-only tools (budget status, describe DOM) should not gate. |
| Gateway auth: should the gateway itself require route_task? | Yes — same discipline as brain's route gate. The gateway should reject tools until `route_task` succeeds. |
| agent-heart scope: just budget/gc, or also export safety policy? | Budget + GC only. Safety policy is internal to heart. |
| Naming: `{organ}_{verb}_{noun}` vs `{verb}_{noun}`? | `{organ}_{verb}_{noun}` — prevents collisions and makes provenance clear. |

---

## Implementation Order

```
Phase 0: agent-heart budget + GC MCP  (highest feedback value)
Phase 1: agent-muscle execute MCP      (highest IDE value)
Phase 2: agent-eyes visual MCP         (privacy-sensitive QA)
Phase 3: agent-body gateway            (aggregation layer)
Phase 4: agent-immune + mouth gates    (enterprise safety)
Phase 5: agent-spine workflow MCP      (complex orchestration)
```
