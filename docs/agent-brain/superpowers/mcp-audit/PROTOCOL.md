# Local MCP dev audit protocol (PRIVATE — do not commit)

This tooling lives under `docs/superpowers/`, which is **gitignored**. Never add audit scripts, logs, or this protocol to tracked files or push them to GitHub.

## When to run

Run an audit when you:

- Touch `agent-brain/hooks/`, `install.rs`, `mcp/`, or Cursor MCP config
- See hook denials, empty `route_task`, or tools blocked after routing
- Finish any MCP-related implementation session

## Command

```bash
python3 docs/superpowers/mcp-audit/audit.py           # check + auto-fix + log
python3 docs/superpowers/mcp-audit/audit.py --check   # check only, no fixes
python3 docs/superpowers/mcp-audit/audit.py --full    # include cargo test
python3 docs/superpowers/mcp-audit/audit.py --install-rules  # copy gitignored project rule
```

## Where Cursor loads rules

| Kind | Location | Works? |
|------|----------|--------|
| **Project rules** | `.cursor/rules/*.mdc` in workspace | Yes |
| **User rules** | Cursor **Settings → Rules → User Rules** (UI text) | Yes, all projects |
| `~/.cursor/rules/*.mdc` | Home folder | **No** — Cursor does not load these |

`agent-brain install` writes **`agent-brain.mdc`** to the **project** `.cursor/rules/`, not `~/.cursor/rules/`.

For optional global preferences, see `USER-RULES.md` (paste into Settings).

## Agent workflow (every MCP-related task)

1. Call `route_task` at turn start.
2. Run `audit.py` before claiming MCP work is done.
3. For each issue found, the script appends an entry to `../MCP-INTEGRATION-AUDIT.md` with symptom, cause, fix, and status.
4. Apply auto-fixes (`--fix` is default): sync hooks, run `install --global`, re-run tests.
5. Re-run `audit.py` until exit code 0 or only manual items remain (e.g. “restart Cursor”).
6. **Do not commit** anything under `docs/superpowers/` or `~/.cursor/rules/mcp-local-dev-audit.mdc`.

## Manual follow-ups the script cannot do

- Restart Cursor / reload MCP after binary or hook updates
- Approve hook execution if Cursor prompts

## Files (all local / gitignored)

| File | Purpose |
|------|---------|
| `audit.py` | Checker + fixer + audit log writer |
| `templates/local-audit.mdc` | Template copied to `.cursor/rules/local/` |
| `USER-RULES.md` | Text to paste into Cursor Settings → User Rules |
| `last-run.json` | Machine-readable latest run |
| `../MCP-INTEGRATION-AUDIT.md` | Human issue ledger |
| `.cursor/rules/local/` | Private project rules (any name; whole folder gitignored) |
