---
title: Introduction
---

# Documentation

Welcome to the **Autonomic AI** documentation.

## What is Autonomic AI?

Autonomic AI is an open-source Rust-based multi-agent system for self-healing autonomous code maintenance and software lifecycle management. It arranges 9 specialized agent processes ("organs") into a coherent, event-driven system that can plan, execute, verify, and repair code without human supervision.

The project lives at [github.com/autonomic-ai-dev](https://github.com/autonomic-ai-dev).

### The Problem

AI coding agents today are monolithic. A single agent context window must hold planning, execution, security, and verification state simultaneously — leading to context thrashing, hallucinated commands, and no recovery mechanism when something goes wrong. There is no structural isolation between "deciding what to do" and "doing it."

### The Solution

The 9-organ architecture decomposes the agent into discrete biological analogies, each with a bounded responsibility, an independent process boundary, and a typed communication contract:

| Organ | Role |
|---|---|
| **agent-body** | Meta-orchestrator — `autonomic start`, `stop`, `init`, health supervision |
| **agent-brain** | Context routing, memory, temporal knowledge graph, skill retrieval |
| **agent-spine** | DAG workflow engine — typed nodes, immutable snapshots, gate conditions |
| **agent-heart** | GC, budget enforcement, circuit breakers, liveness polling |
| **agent-nerves** | NATS JetStream event bus — pub/sub bridge between all organs |
| **agent-muscle** | Execution sandbox — build/test/deploy in seccomp or Firecracker |
| **agent-immune** | Security — OSV scanning, AST validation, sandbox enforcement |
| **agent-eyes** | Visual QA — screenshot diffing, LLaVA-based UI verification |
| **agent-mouth** | Communication — Slack, email, GitHub — with AST command validation |

### Philosophy

**Structure beats intelligence.** Each organ has a small, testable surface area. The system's reliability comes from process isolation and typed contracts, not from prompting a single model to "be careful." Every organ can crash, be restarted by agent-body, and resume from its last snapshot — because no organ holds all the state.

### Getting Started

```
curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/agent-body/master/scripts/install-all-organs.sh | bash
autonomic init
autonomic start
```

See the [Installation](/docs/installation) page for details.

---

> **Note:** Autonomic AI is in active development. Report issues at [github.com/autonomic-ai-dev/agent-body](https://github.com/autonomic-ai-dev/agent-body).
