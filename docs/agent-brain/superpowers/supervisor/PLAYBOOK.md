# Execution supervisor playbook (local only)

Gitignored under `docs/superpowers/`. Templates for **`store_memory`** anti-patterns after token mistakes.

## Install

```bash
agent-brain add @supervisor
# restart Cursor · enable MCP
agent-brain doctor
```

## `store_memory` templates (max 50 words, no secrets)

### Never read build output trees

```json
{
  "topic": "no-read-dist",
  "fact": "Never read dist/, build/, or node_modules/. Use rg on src/ only.",
  "polarity": "negative",
  "scope": "project"
}
```

### Grep before cat

```json
{
  "topic": "grep-first",
  "fact": "Always rg -n before reading files. Cap reads at 200 lines unless user approves.",
  "polarity": "negative"
}
```

### Log file trap

```json
{
  "topic": "no-full-logs",
  "fact": "Never cat logs over 500 lines. Use tail -n 100 or rg for errors only.",
  "polarity": "negative"
}
```

## Verify enforcement

1. Run an agent turn → hooks require `route_task`
2. `agent-brain briefing` → **Supervisor: N constraint(s) in must_apply**
3. `agent-brain stats` → routes with must_apply counted

After a mistake, store one template above — next similar task should surface it in **`must_apply`**.
