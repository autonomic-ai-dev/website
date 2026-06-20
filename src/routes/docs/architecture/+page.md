---
title: Architecture
---

# Architecture

The Autonomic AI ecosystem is modeled on biological systems — 9 specialized "organs," each an independent Rust process with a single responsibility. Organs communicate over an event bus, share nothing by default, and are supervised by a meta-orchestrator (agent-body). This design ensures that no single organ can corrupt the system's overall state or take down the entire mesh.

## Communication Model

Organs communicate through three channels, chosen by context:

| Channel | Protocol | Use Case |
|---|---|---|
| **Event bus** | NATS JetStream (agent-nerves bridge) | async events, workflow triggers, status updates |
| **HTTP API** | REST / JSON | synchronous queries (config, health, status) |
| **MCP** | Model Context Protocol | agent-brain context routing to sub-agents |

agent-nerves is the default backbone. Every organ publishes events to named subjects (`organ.heartbeat`, `spine.node.completed`, `immune.scan.result`) and subscribes to subjects relevant to its role. NATS JetStream provides at-least-once delivery, persistent streams, and exactly-once semantics for critical workflow events.

## The 9 Organs

### agent-body (Meta-Orchestrator)

The outermost supervisor. agent-body is the entry point for `autonomic init`, `start`, `stop`, and `status`. It reads `~/.autonomic/config.toml`, resolves organ dependencies (nerves → brain → spine → heart → workers), and spawns each organ as a child process with health polling every 5 seconds. If an organ fails health checks, agent-body restarts it with configurable backoff.

### agent-brain (Context & Memory)

The system's contextual memory. agent-brain maintains a temporal knowledge graph of facts, skills, rules, and session state. When agent-spine requests context for a workflow node, agent-brain performs vector + keyword retrieval, ranks results by relevance, and returns a token-budgeted context window. All facts have TTLs and confidence scores; expired or low-confidence facts are pruned automatically by agent-heart.

### agent-spine (Workflow DAG Engine)

The execution planner. agent-spine defines workflows as directed acyclic graphs of typed nodes:

- **Prompt nodes** — LLM call with structured output schema
- **Tool nodes** — shell command or API call with AST validation
- **Gate nodes** — conditional branching based on previous node output
- **Approval nodes** — pause for human sign-off via Slack webhook
- **Event nodes** — emit an event to NATS and wait for a matching response

Each workflow execution produces an **immutable snapshot** — the full input, output, and decision trace of every node. Snapshots are stored in `~/.autonomic/data/spine/` and can be replayed or audited.

### agent-heart (GC, Budget & Liveness)

The system's autonomic nervous system. agent-heart monitors:
- **Budget enforcement** — token usage, execution time, cost across organs
- **Memory GC** — instructs agent-brain to prune expired/knowledge-graph facts
- **Circuit breakers** — if an organ or workflow exceeds error thresholds, agent-heart trips a breaker
- **Liveness polling** — pings every organ and reports status to agent-body

### agent-nerves (NATS Event Bus)

The communication backbone. agent-nerves wraps a NATS JetStream server with an opinionated subject schema and typed envelope format. Every event carries a schema ID, source organ, trace ID, and payload. agent-nerves provides exactly-once delivery for workflow-critical events and persistent stream storage in `~/.autonomic/data/nerves/`.

### agent-muscle (Execution Sandbox)

The hands. agent-muscle receives execution tasks from agent-spine and runs them inside configurable sandboxes:
- **`none`** — direct subprocess on the host (fastest, no isolation)
- **`seccomp`** — restricted syscall filter via Rust's `seccompiler` crate
- **`firecracker`** — full microVM via Firecracker (strongest isolation, ~200ms boot)

agent-muscle captures stdout, stderr, exit codes, and wall time. Results are published back to NATS for agent-spine to consume.

### agent-immune (Security)

The immune system. agent-immune hooks into the event stream and runs:
- **OSV dependency scanning** — checks every dependency tree against the OSV.dev database for known vulnerabilities
- **AST command validation** — parses all generated shell commands with tree-sitter before execution, rejecting malformed or dangerous patterns
- **Seccomp policy generation** — dynamically generates seccomp-bpf profiles for agent-muscle sandboxes based on the detected syscall surface of each task

### agent-eyes (Visual QA)

The eyes. agent-eyes performs visual regression testing using:
- **Screenshot diffing** — pixel-comparison of before/after application screenshots
- **LLaVA-based verification** — local vision model that answers natural-language questions about rendered UI ("Is the submit button enabled?")
- **DOM state capture** — extracts structured DOM snapshots alongside screenshots for combined analysis

### agent-mouth (Communication)

The voice. agent-mouth manages outbound communication channels — Slack messages, email (SMTP), GitHub issue/PR comments. Every outbound message is validated by an embedded AST command checker that ensures no generated text contains shell-injection payloads or malformed markdown.

## Execution Model

A typical workflow:

```
1. GitHub webhook → agent-mouth (ingress)
2. agent-mouth → NATS event "incoming.pr"
3. agent-brain retrieves context (repo, history, related issues)
4. agent-spine resolves workflow DAG for "pr_review"
5. Prompt node → LLM generates review plan
6. Tool node → agent-muscle runs tests in seccomp sandbox
7. Gate node → if tests fail, route to fix workflow
8. Approval node → pause, Slack approval requested
9. Approved → agent-mouth posts PR comment
10. Complete → immutable snapshot written
```

## Standalone vs Integrated

Every organ functions independently — agent-brain can serve context queries without agent-nerves running. The integration layer (NATS + unified config) only adds value when 2+ organs coordinate. For single-organ use, each binary accepts CLI flags for configuration; no event bus is required.

## Configuration

All organs read from `~/.autonomic/config.toml`:

```toml
[body]
log_level = "info"
start_timeout_secs = 30

[brain]
embedding_model = "local"
knowledge_graph_path = "~/.autonomic/data/brain/graph"
max_context_tokens = 8000

[nerves]
nats_port = 4222
nats_http_port = 8222

[muscle]
default_sandbox = "seccomp"
firecracker_kernel = "~/.autonomic/data/vmlinux.bin"

[immune]
osv_scan_enabled = true
sandbox_default = "seccomp"

[eyes]
llava_model = "~/.autonomic/data/models/llava-q4.gguf"

[mouth]
slack_token = "env:SLACK_BOT_TOKEN"
```

Secrets reference environment variables via the `env:` prefix — they are never written to disk.

## Supervision

agent-body uses a three-phase supervision model:

1. **Startup** — starts nerves first, waits for NATS ready signal, then starts remaining organs in dependency order
2. **Runtime** — polls every organ's health endpoint (HTTP `GET /health` on a Unix socket) every 5 seconds
3. **Recovery** — if an organ misses 3 consecutive health checks, agent-body sends SIGTERM, waits 10 seconds, SIGKILLs if necessary, and relaunches with exponential backoff (1s, 2s, 4s, ... max 60s)

This supervision model is why individual organs can be simple — they do not need built-in HA logic. agent-body handles lifecycle for the entire mesh.
