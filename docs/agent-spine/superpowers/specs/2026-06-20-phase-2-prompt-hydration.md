# Phase 2: Subagent Prompt Hydration + Pre-Flight Verification

**Date:** 2026-06-20
**Bumps:** agent-brain v0.27.0, agent-spine v0.12.0

## Problem

Spine workflow nodes delegate to a model with generic prompts. No access to user's accumulated AGENTS.md rules or SKILL.md bash patterns. Every node runs blind to user expertise.

## New MCP tool: get_context_for_node

### Tool definition (agent-brain mcp/server.rs)

```rust
pub struct GetContextForNodeParams {
    pub node_kind: String,
    pub node_name: String,
    pub node_description: String,
    pub workflow_name: String,
    pub task_description: String,
}
```

### Response

```rust
pub struct ContextBundle {
    pub rules: Vec<ScoredItem>,
    pub skills: Vec<ScoredItem>,
    pub bash_allowed_patterns: Vec<String>,
    pub bash_blocked_patterns: Vec<String>,
    pub agents: Vec<ScoredItem>,
    pub provenance: BrainProvenance,
}
```

## Brain side: new module

`agent-brain/src/node_context.rs`

1. Agent routing: query indexed_items with item_type = Agent + BM25 match against node_name + node_description + workflow_name
2. Skill verification: query indexed_items with item_type = Skill for task domain
3. Bash pattern extraction: parse matched SKILL.md for allowed/blocked patterns
4. Budget: RouteLimits default 3 rules, 2 skills, 1 agent

## Spine side: integration in executor.rs

Before each agent/checkpoint node execution:

```rust
if let Some(brain) = &self.brain_router {
    let ctx = brain.get_context_for_node(params).await;
    payload.merge(ctx.to_payload_entries());
}
```

Payload entries injected: `_brain_rules`, `_brain_skills`, `_bash_blocked_patterns`

Model sees constraints directly in context. Bash executor reads `_bash_blocked_patterns` as pre-check.

## Repo changes

| Repo | Change |
|------|--------|
| agent-body-core | No new types (reuses ContextBundle, ScoredItem, RouteLimits) |
| agent-brain | New mcp tool get_context_for_node; new node_context.rs; new ItemType::Agent queries |
| agent-spine | Before each agent/checkpoint node, call get_context_for_node; inject into payload; bash pre-check |
