# agent-brain MCP integration audit (Cursor)

Date: 2026-06-15  
Scope: Cursor MCP server, hooks, install path, `route_task` limits/schema.

## Issues found

### 1. Hook did not recognize Cursor MCP tool names (critical)

**Symptom:** `preToolUse` / `beforeMCPExecution` could block `route_task` itself, or never treat a successful route as satisfying the gate.

**Cause:** Cursor exposes agent tools as `mcp_agent-brain_route_task`. The hook only matched `route_task`, `MCP:route_task`, and `*:route_task`.

**Fix:** Expand `is_route_task()` to match `*_route_task` and `mcp_*agent-brain*_route_task` patterns. Allow all route_task-shaped names in `beforeMCPExecution` without requiring `command`/`server` fields.

**Status:** Fixed in `agent-brain/hooks/route_gate.py`.

---

### 2. Gate cleared on empty `route_task` responses (high)

**Symptom:** Agent proceeds with no skills/rules after `tokens_used: 0` and empty recommendation arrays.

**Cause:** `afterMCPExecution` cleared `needs_route` on any successful `route_task` call without inspecting output.

**Fix:** Parse `result_json` / `tool_result` / `tool_output` from `afterMCPExecution`. Only clear the gate when `tokens_used > 0` or at least one recommendation bucket is non-empty.

**Status:** Fixed in `route_gate.py`.

---

### 3. Stale MCP server process after install (high)

**Symptom:** `route_task` without explicit `limits` returns empty results even after upgrading the binary on disk.

**Cause:** Cursor keeps the old `agent-brain serve` process alive until MCP is restarted. An older process may lack `RouteLimits::normalize()` and empty-response cache fixes.

**Fix (operator):** After `agent-brain install --global` or upgrading the binary:

1. Restart Cursor, or disable/re-enable the agent-brain MCP server in Settings.
2. Confirm `route_task` returns non-zero `tokens_used` before other tools.

**Fix (code):** `RouteLimits` now normalizes at serde deserialize time (defense in depth). Install output reminds users to restart MCP.

**Status:** Documented + serde hardening in 0.3.12.

---

### 4. MCP JSON schema advertised zero limits (medium, mitigated)

**Symptom:** Some clients send `"limits": {"agents":0,"skills":0,"rules":0,"memory":0}`.

**Cause:** JSON Schema defaults were historically `0`, so hosts pre-filled zeros.

**Fix:** `RouteLimits::normalize()` treats all-zero as unset; per-field `#[schemars(default)]` now advertises 2/3/5/5. Deserialize hook applies normalize on every parse.

**Status:** Mitigated in server code since 0.3.10; deserialize hardening in 0.3.12.

---

### 5. Installed hook script can lag behind repo (medium)

**Symptom:** `~/.cursor/hooks/agent-brain/route_gate.py` matches an older copy while the repo has fixes.

**Cause:** Hooks are only refreshed when `agent-brain install --global` runs.

**Fix:** Re-run `agent-brain install --global` after upgrades. Install always overwrites `route_gate.py` and merges `hooks.json`.

**Status:** Documented; install now refreshes the Cursor rule as well.

---

### 6. `failClosed: true` on `beforeMCPExecution` (low)

**Symptom:** If `route_gate.py` crashes or returns invalid JSON, all MCP tools are blocked.

**Cause:** Intentional security posture in `agent-brain-hooks.json`.

**Mitigation:** Keep the hook dependency-free (stdlib only). Disable with `AGENT_BRAIN_ROUTE_HOOKS=0` for debugging.

**Status:** Accepted; documented in README env table.

---

### 7. Gate not cleared after Agent MCP `route_task` (critical)

**Symptom:** `route_task` returns skills (`tokens_used > 0`), but `Read` / `Grep` / other tools are still denied with “call route_task before other tools”.

**Cause:** Cursor Agent invokes MCP as native tools (`mcp_agent-brain_route_task`). Those complete via `postToolUse`, not `afterMCPExecution`. The hook only cleared `needs_route` in `afterMCPExecution`, so the gate stayed locked for the rest of the turn.

**Fix:** Register `postToolUse` in `agent-brain-hooks.json` and call shared `try_clear_route_gate()` from both `postToolUse` and `afterMCPExecution`.

**Status:** Fixed in `route_gate.py` + hooks fragment (0.3.12+).

---

### 8. Duplicate version in GitHub release title (cosmetic)

**Symptom:** Release shows `agent-brain v0.3.11 (0.3.11)`.

**Cause:** `stage-release-publish.yml` set `name` from both `github.ref_name` and `inputs.version`.

**Fix:** Use `name: agent-brain ${{ github.ref_name }}` only.

**Status:** Fixed in `.github/workflows/stage-release-publish.yml`.

---

## Ongoing audit policy

During any implementation work on this repo:

1. Call `route_task` at turn start; note empty responses or hook denials immediately.
2. Append new findings to this file (issue number, symptom, cause, fix, status).
3. Prefer fixing hook/MCP/install issues in the same session — do not only document.
4. Re-run `python3 agent-brain/hooks/test_route_gate.py` after hook edits.
5. Re-run `agent-brain install --global` so `~/.cursor` picks up hook changes.

---

## Verification checklist

1. `python3 agent-brain/hooks/test_route_gate.py` — hook unit tests pass.
2. `cargo test -p agent-brain` — routing + limits tests pass.
3. `agent-brain install --global` — refreshes MCP config, hooks, and Cursor rule.
4. Restart Cursor MCP.
5. First tool each turn: `route_task` → `tokens_used > 0`.
6. Settings → Hooks shows `route_gate.py` loaded without errors.
7. After `route_task`, non-MCP tools (`Read`, `Shell`) are allowed in the same turn.

## Recommended operator workflow

```bash
cd agent-brain
cargo build --release
cargo install --path . --force   # or copy target/release/agent-brain to ~/.local/bin
agent-brain install --global
# Restart Cursor
```

If `route_task` is still empty, pass explicit limits until MCP restarts:

```json
"limits": { "agents": 2, "skills": 3, "rules": 5, "memory": 5 }
```

### 9. Local MCP audit project rule not installed (low)

**Symptom:** Dev audit protocol not attached to agent-brain edits.

**Cause:** No `.mdc` under `.cursor/rules/local/` (gitignored directory).

**Fix:** Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.

**Status:** open

_Auto-audit 2026-06-15 15:06 UTC_

---

### 10. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-15 15:06 UTC_

---

### 11. Local MCP audit project rule not installed (low)

**Symptom:** Dev audit protocol not attached to agent-brain edits.

**Cause:** No `.mdc` under `.cursor/rules/local/` (gitignored directory).

**Fix:** Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.

**Status:** open

_Auto-audit 2026-06-15 15:37 UTC_

---

### 12. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-15 15:37 UTC_

---

### 13. Local MCP audit project rule not installed (low)

**Symptom:** Dev audit protocol not attached to agent-brain edits.

**Cause:** No `.mdc` under `.cursor/rules/local/` (gitignored directory).

**Fix:** Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.

**Status:** open

_Auto-audit 2026-06-15 15:38 UTC_

---

### 14. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-15 15:38 UTC_

---

### 15. Local MCP audit project rule not installed (low)

**Symptom:** Dev audit protocol not attached to agent-brain edits.

**Cause:** No `.mdc` under `.cursor/rules/local/` (gitignored directory).

**Fix:** Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.

**Status:** open

_Auto-audit 2026-06-15 15:44 UTC_

---

### 16. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-15 15:44 UTC_

---

### 17. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-15 15:45 UTC_

---

### 18. Local MCP audit project rule not installed (low)

**Symptom:** Dev audit protocol not attached to agent-brain edits.

**Cause:** No `.mdc` under `.cursor/rules/local/` (gitignored directory).

**Fix:** Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.

**Status:** open

_Auto-audit 2026-06-16 00:20 UTC_

---

### 19. Local MCP audit project rule not installed (low)

**Symptom:** Dev audit protocol not attached to agent-brain edits.

**Cause:** No `.mdc` under `.cursor/rules/local/` (gitignored directory).

**Fix:** Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-16 13:50 UTC_

---

### 20. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-17 14:30 UTC_

---

### 21. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-17 14:46 UTC_

---

### 22. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-17 14:46 UTC_

---

### 23. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-17 15:37 UTC_

---

### 24. Stale rule in ~/.cursor/rules/ (not loaded by Cursor) (low)

**Symptom:** Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.

**Cause:** Cursor only loads project `.cursor/rules` and Settings → User Rules.

**Fix:** Use project `.cursor/rules/agent-brain.mdc` or paste USER-RULES.md into Settings. Safe to delete ~/.cursor/rules/*.mdc.

**Status:** accepted

_Auto-audit 2026-06-17 15:38 UTC_

---

### 25. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-17 15:38 UTC_

---

### 26. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-17 15:52 UTC_

---

### 27. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-17 16:41 UTC_

---

### 28. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-18 00:13 UTC_

---

### 29. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-18 05:36 UTC_

---

### 30. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-18 05:52 UTC_

---

### 31. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-18 07:10 UTC_

---

### 32. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-18 07:15 UTC_

---

### 33. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-19 05:32 UTC_

---

### 34. Installed hook out of sync with repo (medium)

**Symptom:** ~/.cursor hook behaves differently than repo copy.

**Cause:** `agent-brain install --global` not run after hook edits.

**Fix:** Sync `route_gate.py` to ~/.cursor and merge hooks.json.

**Status:** fixed (auto-fixed this run)

_Auto-audit 2026-06-22 17:31 UTC_

---
