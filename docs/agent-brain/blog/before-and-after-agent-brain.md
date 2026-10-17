# Before vs after: Cursor agents at 2000-skill scale

Power users hit three walls with static rules and giant skill libraries:

1. **Context bloat** — loading hundreds of skills/rules every turn burns tokens and degrades reasoning.
2. **Soft enforcement** — the model can ignore “always use X first” and grep the repo instead.
3. **Amnesia** — conventions from last week are not surfaced on similar tasks today.

agent-brain treats routing as **infrastructure**: hard-enforced `route_task`, budgeted retrieval, durable memory.

---

## The scenario

You index a large skill library (thousands of skills). A user message arrives: *“optimize React server components and performance.”*

### Before (static `.cursor/rules` + full context)

| What happens | Cost |
|--------------|------|
| 200+ rules/skills loaded or duplicated in project rules | **~240k tokens** (est. 120 tok × 2000 items if naively loaded) |
| Agent may skip rules and run `grep` / `find` | Wrong tool, wasted turns |
| No ranking — everything competes in one blob | Correct skill often missing from top context |
| Session 2 forgets “use Vitest not Jest” unless re-pasted | Repeated mistakes |

### After (agent-brain hooks + `route_task`)

| What happens | Cost |
|--------------|------|
| Hooks block agent-brain MCP until `route_task` succeeds; large native Read steered to brain tools | Hard gate — not optional |
| Hybrid BM25 + embeddings rank **top 3 skills** under **500 token budget** | **~477 routed tokens** typical |
| **~99% fewer tokens** vs naive full-index load (see `agent-brain briefing`) | Faster, cleaner reasoning window |
| `store_memory` persists “Vitest not Jest” for future test-related prompts | Durable conventions |

---

## Numbers (CI fixtures)

| Metric | Fixture | Gate |
|--------|---------|------|
| Isolated skills Recall@3 | proofs fixture | ≥ 0.85 |
| Warm-route p95 | proofs fixture | ≤ 100 ms |
| Hook gate logic | preToolUse deny/allow | CI |

Reproduce with `agent-brain proofs --ci` and `agent-brain briefing` after a routed turn.

---

## One-minute demo script

**Setup:** `agent-brain install --global` + `agent-brain add @starter`

**Before clip:** Show a large `.cursorrules` or 50+ rule files. Ask agent to fix a React perf issue. Watch it grep widely or ignore stack-specific guidance.

**After clip:** Same prompt with hooks on. Show:

1. MCP panel: `route_task` returns `vercel-react-best-practices` in top 3
2. Terminal: `agent-brain briefing` — phase, skills, **saved ~99%**
3. Task completes using loaded skill path

**Closing line:** *“Same model. Same repo. agent-brain chooses 500 tokens of the right context from 2000 skills — and hooks make it mandatory.”*

---

## Who this is for

- Teams with **ECC / skills.sh / custom rule libraries** (100+ items)
- Cursor / Claude Code **Agent mode** + MCP users
- Staff engineers who want **one shared brain** for juniors (`agent-brain add @nextjs`, git sync)

Not for: a handful of project rules that already work, or chat-only memory without skill routing.

---

## Next steps

- [Install](../USAGE.md) · [`add @starter`](../registry/README.md)
- [Team workflow](../TEAM-WORKFLOW.md)
- [Architecture series](../architecture/README.md)
