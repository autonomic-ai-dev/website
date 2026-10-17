# Session feedback — operator opinion (2026-10-09)

**Context:** Cursor agent session while building ELSE (iOS); also a follow-up ask for an opinion on agent-brain itself.  
**Source:** Live `route_task` usage under hard read-gate.

## Verdict

Useful idea, uneven retrieval. Forced `route_task` + memory + skill paths is the right architecture for multi-session continuity. Day-to-day ranking often isn’t.

## What works

- Cross-session digests and `store_memory` close the “new chat, amnesia” gap.
- Token-budgeted routing and the briefing log (`~/.agent_brain/logs/last-route.md` / `agent-brain briefing`) are good observability.
- Hard gate makes the contract real — soft “prefer MCP” never sticks.

## What hurts

- **Retrieval noise.** Example: a turn asking for “opinion on agent-brain” surfaced Angular MCP docs, React list recycling, and an unrelated District/BMS cinema `must_apply` rule. Ranking looked confident; relevance was weak.
- **Latency tax.** Every turn pays an MCP round-trip before work; on a clear single-file polish task that feels like ceremony.
- **Parallel tool friction.** Native Read/Grep are faster for known files; preferring `grep_search` / `file_summary` is fine in theory, painful when schemas/gates fight the host.
- **macOS packaging.** `taskgated` / linker-signed debug vs release remains a sharp edge for something that must be always-on.

## Product implication

Keep the spine: `route_task` → skills/rules/memory → `store_memory`.

Prioritize:

1. Ranking quality (skills/rules/memory relevance).
2. Harder filtering of irrelevant `must_apply` and `applicable_rules`.
3. Otherwise agents learn to call `route_task` for compliance and ignore the payload — which defeats the product.

## Concrete failure mode to fix

| Query | Bad surfaces | Expected |
|-------|----------------|----------|
| “opinion on agent-brain” | Angular MCP, RN list item types, Slip cinema seat rule as `must_apply` | Product/architecture memory, routing-accuracy docs, or empty skill set with no unrelated must_apply |

Related: [12-routing-accuracy.md](../architecture/12-routing-accuracy.md) — “If routing is wrong often, users stop calling `route_task` and the MCP becomes noise.”
