# agent-brain usage guide

## Do I need to do anything after install?

**Almost nothing.** One-time:

1. `agent-brain install --global` (binary + Cursor MCP config + enforcement rule)
2. Restart Cursor and enable **agent-brain** under Settings → MCP
3. Optional: `agent-brain add @starter` or `@nextjs`

After that, **you do not run `serve` or `index` daily.** Cursor starts the MCP server; agent-brain indexes on startup.

The **agent** (not you) calls `route_task` every turn and `store_memory` at task end. Agent-facing contract: [AGENT-CONTEXT.md](AGENT-CONTEXT.md).

**Enforcement:** `install --global` (Cursor) and `install --claude-code|--opencode|--codex|--gemini|--antigravity|--all --global` install hooks/plugins that **block other agent-brain MCP tools** until `route_task` succeeds (default scope `brain_mcp`). Native Shell/Read/Grep stay available if MCP is down. VS Code and Claude Desktop are instruction-only — see [host-integration.md](host-integration.md).

> Disable hooks only for debugging: `AGENT_BRAIN_ROUTE_HOOKS=0` in MCP env or shell.

## Other MCP hosts

Same binary works with Claude Desktop, Claude Code, OpenCode, Codex, Gemini, Antigravity, VS Code, or any MCP client:

```bash
agent-brain install --claude-code --global   # also --opencode, --codex, --gemini, --antigravity, --vscode, --all
```

Or point their MCP config at:

```json
{
  "command": "/absolute/path/to/agent-brain",
  "args": ["serve"]
}
```

agent-brain already **indexes** skills/agents from `~/.claude/`, `~/.codex/`, and related paths. Prefer `install --…` so route gates and instruction files are written — see [host-integration.md](host-integration.md).

## Do I need to start the MCP manually?

**No — not for normal Cursor use.**

Once `agent-brain` is in your Cursor MCP config (`~/.cursor/mcp.json`), **Cursor starts it automatically** when you open the editor or when an agent needs MCP tools. You do not need a separate terminal running `agent-brain serve`.

| Scenario | What to run |
|----------|-------------|
| Daily Cursor usage | Nothing — Cursor spawns `agent-brain serve` for you |
| First-time setup | `agent-brain install --global` once |
| Add skills package | `agent-brain add affaan-m/ecc` once |
| Refresh index after changes | `agent-brain index` (optional; `serve` also indexes on startup) |
| Debug MCP protocol | `agent-brain serve` manually in a terminal |

After editing `mcp.json`, **restart Cursor** (or reload MCP in **Settings → MCP**) so it picks up the config.

### When you need to reload MCP (and when you don't)

| Situation | Reload MCP? |
|-----------|-------------|
| Normal chat / new session | **No** — Cursor starts `serve` automatically |
| `route_task` each turn | **No** — that's the hook gate, not a reload |
| First install or `agent-brain install --global` | **Yes** — once, so Cursor picks up binary + env |
| You changed `~/.cursor/mcp.json` by hand | **Yes** — toggle off/on or restart Cursor |
| `agent-brain doctor` shows **mcp path MISMATCH** | **Yes** — run `install --global`, then toggle once |
| GitHub auto-update downloaded a new binary during `serve` | **Usually no** — idle auto-restart `exec`s the new binary; Cursor reconnects |
| Auto-restart failed or MCP stays red after update | **Yes** — toggle agent-brain off/on once |

Check anytime: `agent-brain doctor` and `agent-brain version`.

### See what was routed (without expanding MCP JSON)

Each `route_task` updates:

- **File:** `~/.agent_brain/logs/last-route.md` (readable markdown)
- **Terminal:** `agent-brain briefing`
- **MCP Output panel:** one-line stderr summary per route

The `briefing` field in `route_task` JSON is a short one-liner; use the file or CLI for full detail.

## First-time setup (new laptop)

### 1. Install the binary

```bash
curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/agent-brain/master/scripts/install.sh | bash -s -- --global
```

Or from source:

```bash
cargo install --git https://github.com/autonomic-ai-dev/agent-brain --locked agent-brain
agent-brain install --global
```

### 2. Register with Cursor

`agent-brain install --global` writes `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "agent-brain": {
      "command": "/Users/you/.local/bin/agent-brain",
      "args": ["serve"],
      "env": {
        "RUST_LOG": "agent_brain=warn",
        "AGENT_BRAIN_BOOTSTRAP_BG": "1",
        "AGENT_BRAIN_BOOTSTRAP_DELAY_SEC": "2",
        "AGENT_BRAIN_BOOTSTRAP_INTERVAL_SEC": "3600",
        "AGENT_BRAIN_AUTO_UPDATE_DELAY_SEC": "300",
        "AGENT_BRAIN_SESSION_INGEST_DELAY_SEC": "180"
      }
    }
  }
}
```

Confirm version after install: `agent-brain version`

Restart Cursor.

### 3. Enable the server

1. Open **Cursor Settings → MCP**
2. Confirm `agent-brain` appears
3. Toggle it **on** if prompted

### 4. Install skill packages (optional)

```bash
agent-brain add affaan-m/ecc
```

This clones ECC into `~/.agent_brain/packages/ecc/` and indexes it.

### 5. Verify

In Cursor Agent chat, the model should have access to tools like `route_task`. Ask:

> Use route_task for: "fix a failing rust test"

Check **Settings → MCP** — the server status should be green after the first connection.

## Daily workflow

1. Open Cursor — MCP starts in the background automatically
2. **Agent mode** — the model must call **`route_task`** at the start of every turn (enforced by project rule `.cursor/rules/agent-brain.mdc` and hooks)
3. agent-brain returns recommended agents, skills, rules, and memory under a token budget
4. The agent loads skills from returned `path` values and applies rules/memory
5. At task end, the agent calls **`store_memory`** for durable decisions

You only need `agent-brain index` if you:

- Added new local skills/rules under `~/.agent_brain/`
- Installed or updated a package (`agent-brain package update`)
- Want to force a reindex without restarting Cursor

## Package commands

```bash
# Install Everything Claude Code (ECC)
agent-brain add affaan-m/ecc
agent-brain add https://github.com/affaan-m/ecc

# List installed packages
agent-brain package list

# Update to latest
agent-brain package update ecc

# Remove
agent-brain package remove ecc
```

Packages live at `~/.agent_brain/packages/<name>/`.

## MCP tools reference

| Tool | When to use |
|------|-------------|
| `route_task` | **Every turn** — primary routing with token budget |
| `get_context` | Lower-level flat context retrieval |
| `record_verify_outcome` | Agent-asserted exit only (`mcp`/`playbook`); prefer `agent-brain verify --` (`cli`/`orchestrator`). Hashes `.verify/` |
| `store_memory` | Persist a short fact at task end (max 50 words) |
| `list_memory` | Inspect stored facts |
| `delete_memory` | Remove a fact |
| `export_memory` | Export facts to `~/.agent_brain/export/` |

## Verification and test outcome recording

Verify commands track test suite results, compiler runs, and verification playbooks across turns and sessions. Outcomes are stored in SQLite and correlated with `route_log_id`.

```bash
# Preferred: wrap a command (source=cli). Orchestrators pass --source orchestrator.
agent-brain verify -- cargo test -p agent-brain
agent-brain verify --source orchestrator -- cargo test -p agent-brain

# Record an already-known exit (hooks use --source hook; MCP asserts are not trusted for learning)
agent-brain verify record --exit 0 --source cli -- cargo test -p agent-brain

# View aggregate verification stats (orchestrator|cli strongest; mcp/playbook not trusted for learning)
agent-brain report
```

- **Project playbooks (`.verify/`):** When a `.verify/` folder exists at project root, its scenario files and configs are hashed to track drift against outcomes. Command allowlist: `.verify/verify.toml`.
- **Hook auto-capture:** When enabled in host hooks (`route_gate.py`), matching Shell test commands (`cargo test`, `pytest`, `npm test`, etc.) automatically record verification outcomes into SQLite.

## Durable memory CLI fallback and pending queue

If `store_memory` fails due to an MCP transport disconnect (`Connection closed`, `Broken pipe`), durable facts must not be dropped. Use the CLI fallback:

```bash
# Write directly to the SQLite store and index
agent-brain memory put --topic "architecture" --fact "Auth tokens refresh via JWT rotation" --scope project

# Alternatively, enqueue to ~/.autonomic/memory/pending/
agent-brain memory enqueue --topic "conventions" --fact "Always use snake_case for SQLite migrations"

# Flush enqueued pending facts with retry backoff
agent-brain memory flush-pending

# Watch mode for continuous background flushing
agent-brain memory flush-pending --watch --interval-secs 5
```

## Portable sync and bootstrap

Synchronize memory and event outboxes across development machines:

```bash
# Bootstrap this device into an existing git sync repository
agent-brain bootstrap --remote git@github.com:your-org/agent-brain-sync.git

# Normal git sync commands
agent-brain sync git status
agent-brain sync git pull
agent-brain sync git push
```

## Troubleshooting

### MCP server shows red / failed to start

1. Confirm binary exists: `which agent-brain` and `agent-brain version`
2. Use an **absolute path** in `mcp.json` (run `agent-brain install --global` again)
3. Check logs: **View → Output → MCP** (select `agent-brain`)
4. First start downloads the embedding model (~90MB) — can take 1–2 minutes

### `route_task` not appearing

- Ensure Agent mode (not Ask-only) in chat
- Confirm MCP server is enabled in settings
- Restart Cursor after config changes

### Slow first query

- First run downloads `AllMiniLML6V2` and builds the index
- Run `agent-brain index` once to warm the index before using Cursor

### Package install fails

- Requires `git` on PATH
- Check network access to GitHub
- Try explicit ref: `agent-brain add affaan-m/ecc --ref main`

## Verification and Scaffolding

```bash
# Scaffold .verify/verify.toml, executable run.sh, and README.md
agent-brain verify init

# Run verified check and record trusted outcome
agent-brain verify -- cargo test

# View aggregated verification results
agent-brain verify report
```

When `.verify/` exists in the repository, `agent-brain verify` matches against allowlists and records outcomes directly into `brain.db`. Historical successes and failures from these runs adaptively adjust tool recommendation rankings in `route_task`.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `AGENT_BRAIN_HOME` | `~/.autonomic/memory` | Brain data dir (legacy `~/.agent_brain` migrated on first run) |
| `AGENT_BRAIN_SESSION_INGEST` | `1` (on) | Set `0` or `false` to disable legacy session import |
| `AGENT_BRAIN_ROUTE_HOOKS` | `1` (on) | Set `0` to disable Cursor route_task gate hooks |
| `AGENT_BRAIN_ROUTE_GATE_SCOPE` | `brain_mcp` | `brain_mcp` = gate agent-brain MCP only; `all` = legacy strict |
| `AGENT_BRAIN_READ_GATE` | `hard` | `hard` = deny large/blocked native Read; `steer` = warn only; `off` = disable |
| `AGENT_BRAIN_SCOUT_UNLOCK_SECS` | `3600` | After MCP `file_summary` / `read_file_head` / `grep_search` on a path, native Read/StrReplace is unlocked for this duration |
| `AGENT_BRAIN_ALLOW_MULTI_SERVE` | `0` | Set `1` to allow multiple concurrent `serve` processes on the same home (exclusive `serve.lock` by default) |
| `AGENT_BRAIN_ALLOW_PYTHON_SHELL` | `0` | Set `1` to override Python Shell deny policy (`python -c` / heredoc / piped stdin) |
| `AGENT_BRAIN_AUTO_UPDATE_DELAY_SEC` | `300` | Delay before background auto-update checks |
| `AGENT_BRAIN_AUTO_UPDATE_DEFER_SECS` | `60` | Defer applying updates while MCP server is actively handling requests |
| `AUTONOMIC_SELF_LEARNING` | `0` | Set `1` to activate background trajectory critic loop in agent-heart |
| `RUST_LOG` | `agent_brain=info` | Log level (stderr only) |

## Route gate (enforcement)

Shared script: `route_gate.py` (requires `python3` on PATH). Default scope `brain_mcp` — only other agent-brain MCP tools are denied until `route_task`; set `AGENT_BRAIN_ROUTE_GATE_SCOPE=all` for legacy strict mode.

### Enforcement features (v0.40.0+)

- **Large-file edit & scout unlock:** When an agent inspects a file via `file_summary`, `read_file_head`, `read_file_tail`, or `grep_search`, native Read and StrReplace tools are unlocked for that path for 1 hour (`AGENT_BRAIN_SCOUT_UNLOCK_SECS`). Edit tools are never blocked by the read gate.
- **Python Shell execution policy:** Shared `route_gate.py` denies ad-hoc `python -c`, heredocs, and piped stdin on Shell/Bash across hosts. Standard test runs (e.g. `python -m pytest`) and dedicated `.py` files remain permitted. Set `AGENT_BRAIN_ALLOW_PYTHON_SHELL=1` with operator approval to override.
- **Single-serve advisory lock (`serve.lock`):** Prevents multiple stdio MCP servers on the same home directory from corrupting SQLite and hook state. Override with `AGENT_BRAIN_ALLOW_MULTI_SERVE=1`.
- **Idle-gated auto-update:** Updates download to staging and apply only when the MCP server is completely idle, preventing mid-turn connection drops.

| Host | Install | Gate |
|------|---------|------|
| Cursor | `install --global` | `~/.cursor/hooks.json` |
| Claude Code | `install --claude-code --global` | `.claude/settings.json` + `rules/agent-brain-route.md` |
| OpenCode | `install --opencode --global` | plugin `agent-brain-route-gate.ts` + rules |
| Codex | `install --codex --global` | `~/.codex/hooks.json` |
| Gemini / Antigravity | `install --gemini\|--antigravity --global` | shared `~/.gemini/settings.json` |
| VS Code / Claude Desktop | MCP + instructions | no deny hooks |

Verify with `agent-brain doctor` (use `--fix` to reinstall stale gates). Full matrix: [host-integration.md](host-integration.md).

## Legacy session import (0.3.2 bridge → digests in 0.4+)

On startup, agent-brain scans recent session transcripts and stores **one digest per conversation** (v0.7.3+: Cursor, Codex, Gemini, OpenCode).

```bash
agent-brain sessions status          # discoverable vs stored counts
agent-brain sessions ingest          # manual ingest all sources
agent-brain sessions ingest --source gemini,opencode
```

- Skips unchanged sessions (content hash in `brain.db` meta)
- Topics: `session-digest-{source}-{slug}` (one fact per session, not one global topic)
- Disable with `AGENT_BRAIN_SESSION_INGEST=0` or `AGENT_BRAIN_SESSION_DIGEST=0`
- Override scan root: `AGENT_BRAIN_SESSION_HOME`, OpenCode DB: `AGENT_BRAIN_OPENCODE_DB`

## Closed-Loop Self-Correction & Verification Recipes (v1.0.0-beta.3)

`agent-brain` bridges the gap between advisory suggestions and operational execution adherence:

1. **Adherence Gating (`must_apply`)**:
   - High-confidence verified recipes (`exit 0`) from trusted runners (`orchestrator`, `cli`, `hook`) are promoted into `must_apply` constraints in `route_task`.
   - Host instructions require agents to treat `must_apply` as mandatory pre-execution conditions rather than optional suggestions.

2. **Automated Outcome Attribution**:
   - `agent-brain verify -- <cmd>` and shell post-tool hooks record process exit codes and automatically correlate them with the active turn's `route_log_id`.
   - **On Success (`exit 0`)**: Automatically calls `record_context_feedback(&item_ids, true)`, increasing context weights by `+0.05`.
   - **On Failure (`exit != 0`)**: Automatically calls `record_context_feedback(&item_ids, false)`, reducing context weights by `-0.05` and increasing `useless_count`.

3. **Instant Squelching**:
   - If a command's most recent execution in `verify_outcomes` returned a non-zero exit code, it is immediately excluded from `suggest_verified_recipes`, preventing broken commands from recurring in suggestions.

