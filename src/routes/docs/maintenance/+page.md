---
title: Maintenance & Budgeting
---

# Maintenance (agent-heart)

A self-healing system requires a heartbeat. The `agent-heart` organ is a specialized background daemon responsible for the long-term health, garbage collection, and financial safety of the ecosystem.

## Garbage Collection (GC)

As the ecosystem runs, `agent-brain` accumulates millions of tokens of context, and `agent-spine` generates gigabytes of snapshot logs. Left unchecked, the system would eventually crash from storage exhaustion.

`agent-heart` runs scheduled GC routines. Using standard CRON expressions, it periodically:
- Scans the `agent-brain` Knowledge Graph to prune facts that have passed their `invalid_at` expiration timestamp.
- Vacuums the SQLite databases and vector indexes to reclaim disk space.
- Archives or deletes old workflow snapshots from `agent-spine`.

## Token Budgeting

Runaway LLM loops are one of the biggest risks of autonomous agents. `agent-heart` acts as the financial governor.

Every prompt node executed by `agent-spine` must request permission from `agent-heart`'s Budget Gate. `agent-heart` tracks the aggregate token usage across the entire ecosystem. If a workflow attempts to exceed the daily configured spending limit, `agent-heart` blocks the execution and throws a `budget.exhausted` event.

This strict enforcement guarantees that you will never wake up to an unexpected cloud API bill caused by a looping autonomous agent.
