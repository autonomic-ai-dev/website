---
title: Workflows & DAG Engine (agent-spine)
---

# `agent-spine` — Deterministic Workflow Engine

`agent-spine` is the orchestration engine for the Autonomic cluster. Instead of relying on probabilistic Python `while` loops to determine an agent's control flow, `agent-spine` forces multi-step procedures through strict, deterministic Directed Acyclic Graphs (DAGs) with **immutable state snapshots** and **Human-in-the-Loop (HITL) approval gates**.

```mermaid
flowchart TD
    Start([Workflow Trigger]) --> Lint[Node: lint_check]
    Start --> Scan[Node: immune_scan]
    
    Lint --> Build[Node: cargo_build]
    Scan --> Build
    
    Build --> Test[Node: test_suite]
    Test --> Gate{Node: approval_gate\n(Prod Deploy Gate)}
    
    Gate -->|Slack Approved| Deploy[Node: prod_deploy]
    Gate -->|Rejected / Timeout| Rollback[Node: revert_changes]

    Deploy --> Snapshot[Append-Only Snapshot Store]
    Rollback --> Snapshot

    classDef exec fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef gate fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#080b10;
    classDef terminal fill:#10b981,stroke:#34d399,stroke-width:2px,color:#ffffff;
    class Lint,Scan,Build,Test,Deploy,Rollback exec;
    class Gate gate;
    class Snapshot,Start terminal;
```

---

## Architectural Invariants

### 1. Deterministic Execution over Improvisation
Ad-hoc prompts ("run lint, then tests, then build, then review") lack audit trails, concurrency discipline, and retry safety. `agent-spine` treats workflows as **declarative, version-controlled artifacts**. The LLM is invoked only to perform discrete tasks *within* a node; the DAG controls the topology, retries, and data passing.

### 2. Time-Travel Debugging via Immutable Snapshots
Before and after every node execution, `agent-spine` serializes the runtime state, environment variables, and filesystem diffs into an append-only SQLite/JSONL snapshot. If an agent hallucinates on Step 5 and breaks the build, operators can literally "rewind" the execution state to Step 4, tweak the prompt or parameters, and resume without re-running prior nodes.

### 3. Cryptographic Human-in-the-Loop (HITL) Gates
When a DAG reaches an `ApprovalGate`, `agent-spine` pauses execution. It dispatches a webhook event via `agent-mouth` to Slack/Discord containing the proposed diffs and waits for an authorized operator callback before proceeding.

---

## Declarative Workflow Syntax (`workflow.yaml`)

Workflows are authored in structured YAML:

```yaml
version: "1.0"
name: "ci-validation-and-release"
concurrency: 4

nodes:
  - id: "security_scan"
    action: "immune:scan_manifest"
    params:
      manifest: "Cargo.toml"
    timeout_seconds: 60

  - id: "unit_tests"
    action: "muscle:execute_bash"
    depends_on: ["security_scan"]
    params:
      command: "cargo test --release"
    retries: 2
    retry_delay_seconds: 5

  - id: "deploy_gate"
    type: "approval_gate"
    depends_on: ["unit_tests"]
    channel: "slack"
    timeout_minutes: 30

  - id: "release_bottle"
    action: "muscle:execute_bash"
    depends_on: ["deploy_gate"]
    params:
      command: "brew test-bot --only-cleanup-before"
```

---

## CLI Command Reference

| Command | Flags | Description |
| :--- | :--- | :--- |
| **`agent-spine run`** | `<file.yaml>`, `--meta "..."` | Executes a workflow DAG from a local YAML file. |
| **`agent-spine validate`** | `<file.yaml>` | Validates syntax, acyclicity, and schema adherence. |
| **`agent-spine list`** | `--active`, `--limit <N>` | Lists current running and queued workflow executions. |
| **`agent-spine resume`** | `<run-id>`, `--step <id>` | Resumes a paused or failed execution from a snapshot. |
| **`agent-spine init`** | `--with @workflow` | Scaffolds a production-ready workflow template. |
| **`agent-spine serve`** | `--port 3100` | Starts the HTTP API and dashboard relay server. |

---

## MCP Tool Reference

`agent-spine` exposes workflow orchestration to external LLMs via MCP:

- **`spine_submit_workflow`**: Submits a declarative YAML DAG payload and returns a unique `run_id`.
- **`spine_check_status`**: Polls the real-time execution status, node completion states, and error traces.
- **`spine_list_workflows`**: Lists available predefined workflow templates registered in the cluster.
