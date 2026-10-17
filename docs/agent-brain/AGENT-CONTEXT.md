# agent-brain for agents

Short contract for AI agents and orchestrators. Operator install details: [USAGE.md](USAGE.md) · host paths: [host-integration.md](host-integration.md) · enforcement design: [architecture/07-enforcement-and-multi-host.md](architecture/07-enforcement-and-multi-host.md).

## Mental model

`agent-brain` is a **local turn router**: each user message, call `route_task` once to get budgeted skills, rules, agents, and memory. It does not replace the model or run workflows.

Hard gates (hooks/plugins) block other agent-brain MCP tools until `route_task` succeeds on Cursor, Claude Code, OpenCode, Codex, and Gemini/Antigravity. VS Code and Claude Desktop are instruction-only.

## Every turn

1. Call **`route_task`** with `user_message`, `current_working_directory`, and `open_files`.
2. Load skills/agents from returned paths; treat `must_apply` as hard constraints.
3. Prefer `grep_search`, `file_summary`, `read_file_head` / `read_file_tail` over host Read/Grep/Cat. Scouting unlocks native Read/StrReplace on that path.
4. At task end, call **`store_memory`** (max 50 words, no secrets). If MCP connection fails, retry or use CLI fallback: `agent-brain memory put` or `memory enqueue` + `memory flush-pending`.

Session digests and team memory surface **only** through `route_task`.

## Prefer agent-body for organ work

Multi-step execute / workflow / budget / sandbox / UI / approval tasks: use **`route_to_mcp` → `agent-body`** (or `autonomic …`) instead of improvising with Shell. `route_task` may return `suggested_tools` for body gateway tools (`muscle_*`, `spine_*`, `heart_*`, …). Enable with `agent-brain doctor --fix`.

## Tool map (common)

| Need | Tool |
|------|------|
| Start of turn | `route_task` |
| Find text | `grep_search` |
| Skim a file | `file_summary`, `read_file_head`, `read_file_tail` |
| Record verification | Prefer Shell/`agent-brain verify -- <cmd>` (trusted). MCP `record_verify_outcome` is agent-asserted and not trusted for learning. |
| Persist a convention | `store_memory` |
| Multi-agent note | `write_scratchpad` / `read_scratchpad` |
| Bounded git | `brain_git_log`, `brain_git_diff`, `brain_git_compare` |
| Upstream MCP / organs | Prefer `route_to_mcp` → **agent-body** when `suggested_tools` lists it |

Code-nav tools (`query_codebase`, `get_symbol_definition`, …) need a build with `--features extras`.

## Host naming notes

- **OpenCode:** tools are `agent-brain_<name>` (e.g. `agent-brain_route_task`). Plugin `agent-brain-route-gate` fail-closes if `route_gate.py` is missing.
- **Claude Code:** hooks use PreToolUse `matcher: .*`; gate scope still `brain_mcp` (Read/Bash allowed). Trust hooks via `/hooks`.
- **Antigravity CLI:** MCP under `~/.gemini/antigravity/`; route gate shares `~/.gemini/settings.json` with Gemini CLI.

## If the gate denies you

- Distinguish valid route-gate `Permission denied` (re-call `route_task`; never set `AGENT_BRAIN_ROUTE_HOOKS=0`) from infrastructure MCP failures (retry, then CLI writes / alternate reads).
- Do not use `python -c` / heredoc / piped stdin on Shell/Bash for ad-hoc inspection or patches; use native tools, scout unlock, or project test runners (`python -m pytest ...`).
- If MCP is down, run `agent-brain doctor` (or `doctor --fix`), then retry.

Readable briefing: `~/.agent_brain/logs/last-route.md` or `agent-brain briefing`.
