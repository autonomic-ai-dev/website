---
title: Memory & Knowledge Graph
---

# Memory & Knowledge Graph

One of the foundational problems with modern AI coding agents is **context bloat**. A typical enterprise codebase has hundreds of specific conventions, rules, and skills. If you load all of these into an LLM's system prompt simultaneously, the model experiences "lost in the middle" syndrome—it burns through tokens and fails to reliably follow the rules.

Furthermore, "soft enforcement" (telling a model "you MUST use this skill first") is notoriously unreliable.

The Autonomic ecosystem solves this using the `agent-brain` local context engine, powered by a temporal SQLite Knowledge Graph.

## The Temporal Knowledge Graph

Instead of storing system instructions in flat markdown files, `agent-brain` maintains a local SQLite database (`brain.db`). This database is modeled as a Knowledge Graph.

### Nodes and Edges

- **Nodes:** Represent discrete pieces of information: a specific codebase rule, a tool definition, a script execution skill, or a generalized fact.
- **Edges:** Represent relationships. For example, a `DEPENDS_ON` edge might link a frontend styling rule to the `React` framework node.

### Temporal Validity

Every fact and rule stored in the Knowledge Graph is **ADD-only** and immutable. When an agent learns a new rule (via the `store_memory` MCP tool), it is written to the database with a `valid_from` timestamp.

If that rule is later overridden or corrected by the user:
1. The old rule is NOT deleted. It is marked with an `invalid_at` timestamp.
2. A new rule is inserted with a new `valid_from` timestamp.

This temporal architecture preserves the *history* of the codebase. It allows the agent to understand *why* older code was written a certain way, preventing it from incorrectly "fixing" legacy code using new conventions without explicit instruction.

## Filterable HNSW Retrieval

When the agent receives a prompt from the user, it is forced to call the `route_task` MCP tool. 

`route_task` uses an embedded **Hierarchical Navigable Small World (HNSW)** vector search algorithm to find the most relevant nodes in the Knowledge Graph. 

Unlike standard vector databases, `agent-brain` implements *filterable* HNSW. It applies hard scope boundaries (e.g., "only search within the `frontend` scope") *during* the graph traversal, rather than doing an expensive post-filtering step. 

This enables `agent-brain` to retrieve the most relevant ~500 tokens of context in under 50 milliseconds, securely injecting it into the agent's context window before it takes any action.

## Distillation & Must-Apply Rules

Over time, as the system executes workflows and the `agent-heart` background daemon observes behavior, it can synthesize common failure patterns into new rules.

If the agent repeatedly fails at a task because it forgot a specific flag, `agent-heart` can propose a `must_apply` rule. Once approved, this rule is flagged in the Knowledge Graph. Any future `route_task` search that matches the context of that rule will unconditionally inject it, ensuring the agent never makes the same mistake twice.
