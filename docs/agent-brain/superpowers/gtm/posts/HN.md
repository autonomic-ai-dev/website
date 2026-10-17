# Show HN draft

**Title:** Show HN: agent-brain – route ~500 tokens from thousands of skills, enforced by Cursor hooks

**URL:** https://github.com/aeswibon/agent-brain

---

If you use Cursor Agent with a large skill library (ECC, skills.sh, team rules), you’ve seen this:

1. **Context bloat** — you can’t load hundreds of skills every turn without burning tokens and hurting reasoning.
2. **Soft rules** — “always use skills first” gets ignored; the agent greps anyway.
3. **Amnesia** — “use Vitest not Jest” doesn’t survive the next session.

**agent-brain** is a local Rust MCP server that:

- **`route_task`** — BM25 + embeddings return ~500 tokens of the *right* skills/rules/memory for *this* message
- **Hooks** — block Shell/Read until `route_task` succeeds (hard gate, not a suggestion)
- **`store_memory`** — durable conventions in local SQLite, sync via git or encrypted cloud
- **`agent-brain add @starter`** — curated packs in one command

**Proof (reproducible in repo):**

- Recall@3 **30/30** on a **2000 real skills.sh** index (committed fixture, CI-gated)
- `agent-brain briefing` shows **~90–99% estimated token savings** vs naive full-index load

```bash
curl -fsSL https://raw.githubusercontent.com/aeswibon/agent-brain/master/scripts/install.sh | bash -s -- --global --with-starter
# restart Cursor · enable MCP · agent-brain onboarding
```

Rust MCP server; Cursor spawns it automatically. Not a cloud memory SaaS, not LangGraph — drop-in for the IDE you already use.

Blog with before/after scenario: `docs/blog/before-and-after-agent-brain.md`

Happy to answer questions on hooks, eval methodology, or team sync.
