# User Rules snippet (Cursor Settings)

Cursor **User Rules** are global text preferences in:

**Cursor Settings → Rules, Commands → User Rules** (or **Settings → General → Rules for AI** in older UI)

They apply to Agent across **all projects**. They are **not** files in `~/.cursor/rules/` — that folder is **not** loaded by Cursor.

## Optional: paste for any repo with agent-brain MCP

```markdown
When the agent-brain MCP server is available, call route_task at the start of every user turn before other tools. At task end, store_memory for durable decisions (max 50 words). If route_task returns tokens_used 0, restart the MCP server and retry with explicit limits.
```

## Optional: MCP repo dev only (this workspace)

Prefer **`.cursor/rules/local/audit.mdc`** (or any file under `local/`) — scoped to `agent-brain/**`, entire `local/` folder is gitignored without naming files in `.gitignore`.

Install it:

```bash
python3 docs/superpowers/mcp-audit/audit.py --install-rules
```

## Rule types (reference)

| Type | Location | Loaded by Cursor? |
|------|----------|-------------------|
| Project rules | `<repo>/.cursor/rules/*.mdc` | Yes |
| User rules | Settings → Rules (UI text) | Yes |
| `~/.cursor/rules/*.mdc` | Home directory | **No** (hooks/MCP config only) |
| Team rules | Cursor dashboard | Yes (team plans) |
