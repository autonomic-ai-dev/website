---
title: "thesmos Workflows: YAML specification and node kinds"
description: "Authoring deterministic workflows for thesmos (agent-spine). Covers the YAML schema, the node kinds, active verify nodes, and retry policies."
canonical: https://thesmos.autonomic-ai.dev/docs/workflows
product: thesmos
group: Get Started
---

# thesmos Workflows: YAML specification and node kinds

> Authoring deterministic workflows for thesmos (command: agent-spine). Covers the YAML schema, the node kinds, active verify nodes, and retry policies.

A workflow is a version-controlled YAML document defining named nodes, edge transitions, retry policies, and timeout constraints. `thesmos` executes nodes in the topological order described by the edges, appending an immutable snapshot to SQLite after every step.

## Example: `bugfix_pipeline.yaml`

```yaml
name: bugfix_pipeline
version: 1
description: "Reproduce, isolate, fix, and verify a bug with human sign-off"
start_node: reproduce_failure

nodes:
  - name: reproduce_failure
    kind: verify
    command: "cargo test --test reproduce_bug"
    timeout_secs: 60
    continue_on_failure: false
    description: "Run the reproduction test"

  - name: isolate_and_patch
    kind: agent
    description: "Analyze test failure, isolate root cause, and apply minimal patch"
    retry_policy:
      max_attempts: 2
      backoff_ms: 1000

  - name: verify_fix
    kind: verify
    command: "cargo test --all-features"
    timeout_secs: 120
    description: "Confirm all tests pass after the patch"

  - name: human_review
    kind: approval_gate
    auto_approve: false
    description: "Review diff and verification output before committing"

edges:
  - from: reproduce_failure
    to: isolate_and_patch
  - from: isolate_and_patch
    to: verify_fix
  - from: verify_fix
    to: human_review
```

---

## Node kinds

Every node defines exactly one `kind` determining its execution semantics:

| NodeKind | Purpose | Behavior & Guarantees |
| :--- | :--- | :--- |
| **`Agent`** | Agent Task | Runs an agent step with the context in its payload. |
| **`Verify`** | Machine Validation | Actively executes `command` under a timeout. Captures exit code, stdout, and stderr. Halts execution on failure unless `continue_on_failure: true`. |
| **`ApprovalGate`** | Human-in-the-Loop | Pauses workflow until `approved: true` is provided in the node payload. Auto-approves by default unless `auto_approve: false`. |
| **`SpeculativeFork`** | Planned | Passes its payload through unchanged. It does not create worktrees yet. |
| **`Fork` / `Join`** | Concurrency Barrier | Fans out across parallel branches; `Join` continues only after all incoming prerequisite branches resolve. |
| **`Debate`** | Multi-Agent Refinement | Alternates between coder and critic models over iterative rounds until convergence or max rounds reached. |
| **`Vote`** | Consensus Selection | Runs a prompt $N$ times with temperature variance, selecting the best output by consensus. |
| **`Router`** | Dynamic Branching | Evaluates variables in the payload to choose conditional edge transitions. |
| **`Hydrate`** | Context Assembly | Gathers environment diagnostics (diffs, test outputs, file trees) before agent execution. |
| **`Checkpoint`** | State Barrier | Appends an immutable point-in-time state snapshot to SQLite. |

---

## Retry Policies & Exponential Backoff

Nodes can specify automated retry policies to handle transient failures:

```yaml
retry_policy:
  max_attempts: 3
  backoff_ms: 1000
```

If attempts are exhausted, the node fails. Failed executions are routed to the local dead-letter queue at `~/.autonomic/state/spine/dlq.jsonl`.

---

## Validation & Execution Lifecycle

```bash
# 1. Validate YAML syntax and graph topology
agent-spine validate bugfix.yaml

# 2. Execute workflow with initial payload
agent-spine run bugfix.yaml -p '{"ticket": "BUG-42"}'

# 3. Inspect execution steps from SQLite
agent-spine inspect <EXECUTION_ID>

# 4. Replay the final state of an execution (runs no step)
agent-spine replay <EXECUTION_ID>
```

---

## Built-In Templates

`thesmos` ships with pre-configured, tested templates:

```bash
agent-spine init --with list
```

- **`universal-developer`**: Standard plan → implement → verify loop.
- **`engineering-safety`**: 5-gate safety pipeline (Understand, Predict Failure, Minimal Diff, Break It, Verify).
- **`root-cause-analysis`**: Automated diagnostic tree for production incidents.

Scaffold a template with:

```bash
agent-spine init --with universal-developer
```

## Next Step

- Read [agent-spine CLI Reference](cli/agent-spine) for command line options.
