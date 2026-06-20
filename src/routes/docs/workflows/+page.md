---
title: Workflows
---

# Workflows (agent-spine)

`agent-spine` acts as the workflow engine for the Autonomic ecosystem. It manages stateful execution of complex workflows using Directed Acyclic Graphs (DAGs), ensuring that tasks are executed reliably, conditionally, and resiliently.

## Writing a Workflow

Workflows are defined in YAML format. A workflow consists of a sequence of **nodes**, where each node represents an action performed by an organ or an external system. 

### Basic Structure

```yaml
name: "Code Analysis Pipeline"
description: "Scans code for vulnerabilities and then runs visual QA if the frontend changed."

nodes:
  - id: "security_scan"
    action: "agent-immune scan"
    target: "./package.json"
    timeout: "60s"

  - id: "visual_qa"
    depends_on: ["security_scan"]
    action: "agent-eyes capture"
    target: "http://localhost:3000"
    condition: "event.security_scan.status == 'success'"
```

### Key Concepts

1. **Nodes & Actions:** Every node must have an `id` and an `action`. Actions typically map directly to an organ's CLI command (e.g., `agent-immune scan`, `agent-muscle run`).
2. **Dependencies (`depends_on`):** Define the DAG structure. A node will not begin execution until all of its dependencies have successfully completed.
3. **Conditions (`condition`):** Optional JavaScript-like expressions evaluated against the state of previous nodes. This allows for branching logic (e.g., only run visual QA if the security scan was successful and it was a frontend deployment).
4. **Timeouts (`timeout`):** Prevent infinite hangs by enforcing strict execution limits on every node.

## Running Workflows

You can execute a workflow locally using the `agent-spine run` command:

```bash
agent-spine run ./workflows/ci-pipeline.yaml
```

During execution, `agent-spine` dispatches events to the NATS event bus (`agent-nerves`). The relevant organs pick up these events, perform their tasks, and publish the results back to the bus.

## Immutability & Replays

One of the core features of `agent-spine` is its focus on immutable snapshots. 

Every time a node executes, its output and the overall workflow state are recorded as a snapshot. Because state transitions are purely driven by events, you can inspect or replay any past workflow exactly as it happened:

```bash
# Inspect a past run
agent-spine inspect run-uuid-1234

# Replay an execution to recreate its final state
agent-spine replay run-uuid-1234
```

## The Live Dashboard

To visualize workflows as they execute, `agent-spine` provides a live HTTP dashboard.

```bash
agent-spine serve --port 3000
```

Once running, navigate to `http://localhost:3000` in your browser. The dashboard connects to the event bus and renders active DAGs, showing node statuses (pending, running, success, failed) in real-time.
