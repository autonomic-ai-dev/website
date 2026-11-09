---
title: agent-brain MCP tools
---

# agent-brain MCP tools

When a host starts `agent-brain serve`, the MCP server advertises the tools below. This list is the server's own `tools/list` response at release 1.0.0-rc8. The descriptions are the server's text, shortened where noted.

Two tools are required by the routing flow: [`route_task`](#routing) at the start of every turn, and [`store_memory`](#memory) when a task ends with a durable decision.

## Routing

| Tool | What it does |
| :--- | :--- |
| `route_task` | Required every turn before planning or edits. Returns ranked agents, skills, rules, and memory under a token budget. Pass `user_message`, `current_working_directory`, and `open_files`. |
| `get_context` | Lower-level flat context retrieval. Requires `route_task` first in the same turn. |
| `get_context_for_node` | Fetches specialised rules and skills for a workflow node, so an agent-spine node can hydrate its prompt with brain context. |
| `explain_last_context` | Explains the last `route_task` retrieval, or a specific `log_id`. |
| `report_context_useful` | Records whether retrieved context items were useful. Feeds back into ranking. |
| `get_autonomic_catalog` | Returns the capability catalog and delegation rules for agent-brain and agent-spine. |
| `skill_search` | Searches the skill registry by keywords. Every word must match. |
| `skill_get` | Fetches the full `SKILL.md` instructions for a skill by its registry name. |
| `recall_procedures` | Recalls proven procedures and workflow steps based on task intent and historical trajectories. |
| `promote_to_skill` | Stages a `SKILL.md` draft from a memory fact. A person approves it with `agent-brain promote approve`. |

## Memory

| Tool | What it does |
| :--- | :--- |
| `store_memory` | Required at task end for durable decisions. One line, 10 to 50 words, no secrets. Say what was decided or learned, why, and where it applies. |
| `list_memory` | Lists stored memory facts. |
| `delete_memory` | Deletes a stored fact by id, or by topic and scope. |
| `export_memory` | Exports memory facts to `~/.agent_brain/export/`. |
| `import_memory` | Imports memory facts from a sync bundle directory. |
| `learn_from_url` | Fetches allowlisted HTTPS documentation, indexes it as skills, and stores a summary memory. The domain must be in `docs.allowed_domains`. |
| `store_trajectory` | Records an orchestrator workflow node outcome for learning loops. Links an optional `route_log_id`. |
| `write_scratchpad` | Writes a note that other agents see in their next `route_task` briefing. Types: `decision`, `insight`, `blocker`. |
| `read_scratchpad` | Reads recent scratchpad entries for this repository, newest first. |

## Files and code

| Tool | What it does |
| :--- | :--- |
| `file_summary` | Bytes, line count and a short sample of a file. Use it before a full read of an unknown file. |
| `read_file_head` | Reads the first N lines of a file. Use it before a full read. |
| `read_file_tail` | Reads the last N lines of a file. Good for logs. |
| `read_file` | Reads a specific line range, 1-indexed. |
| `grep_search` | Searches a file or directory for a pattern, with line output. |
| `find_files` | Finds files by name pattern, glob, or extension. |
| `list_directory` | Lists files and subdirectories with types, sizes and timestamps. |
| `search_symbols` | Searches code symbols by name across the repository, ranked by label similarity. |
| `get_file_outline` | Lists the symbols defined in a file, sorted by start line. |
| `get_symbol_definition` | Returns the full definition of a named symbol, with its docstring. |
| `find_callers` | Finds callers of a named symbol, with source locations. |
| `get_local_graph` | Explores the dependency graph around a symbol, up to five hops. |
| `recent_symbols` | Lists recently indexed symbols, newest first. |
| `query_codebase` | Deep navigation through the graphify graph. Use it for unfamiliar code paths, not every turn. |
| `trigger_deep_analysis` | Queues a graphify rebuild for an unfamiliar or stale codebase. Returns a job ID. |
| `graphify_job_status` | Polls the status of a `trigger_deep_analysis` job. |

## Verify and evidence

| Tool | What it does |
| :--- | :--- |
| `verify_run` | Runs the project's `[verify.default]` step, allowlisted and time-limited, and records it as trusted CLI evidence. Returns the report, and the output tail on failure. |
| `record_verify_outcome` | Records a known exit code without wrapping the command. Agent-asserted, so it is not trusted for learning. Prefer `agent-brain verify`. |
| `record_turn_telemetry` | Records LLM turn telemetry, and calculates prompt and cache costs and savings. |
| `get_cache_savings_summary` | Returns aggregated cache savings and token attribution across recent turns. |

## Git

| Tool | What it does |
| :--- | :--- |
| `brain_git_log` | Commit log for an optional range, with hash, author, date and message. |
| `brain_git_diff` | Diff between two refs, optionally filtered by path, with file and line counts. |
| `brain_git_compare` | Compares two refs: commit list, diff statistics and ahead count. Useful for release diffs. |
| `brain_git_tags` | Lists git tags sorted by version, with an optional pattern. |

## Upstream servers

| Tool | What it does |
| :--- | :--- |
| `mcp_search` | Searches the upstream MCP tools you configured, by keyword. |
| `get_mcp` | Returns the input schema for one upstream tool found with `mcp_search`. |
| `route_to_mcp` | Calls a configured upstream tool, a batch of tools, or inspects a tool schema. The router never calls upstream tools automatically. |

## Operations

| Tool | What it does |
| :--- | :--- |
| `brain_gc` | Runs garbage collection: deduplication, pruning and vacuum. |
