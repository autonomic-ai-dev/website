---
title: Workflows and node kinds
---

# Workflows and node kinds

A workflow is a YAML file of named nodes and edges. agent-spine runs the nodes in the order the edges describe, records a snapshot after each step, and lets you read the run afterwards.

## A workflow file

This is the `bugfix_pipeline` workflow, abridged. The built-in template has the full version: `agent-spine init --with @bugfix`.

```yaml
name: bugfix_pipeline
version: 1
description: "Reproduce, isolate, fix, and verify a bug with human sign-off"
start_node: reproduce_failure

nodes:
  - name: reproduce_failure
    kind: verify
    command: "cargo test --test reproduce_bug"
    description: "Run the reproduction test"

  - name: isolate_and_patch
    kind: agent
    description: "Analyze the test failure, isolate the root cause, and apply a minimal patch"
    retry_policy:
      max_attempts: 2
      backoff_ms: 1000

  - name: verify_fix
    kind: verify
    command: "cargo test --all-features"
    description: "Confirm all tests pass after the patch"

  - name: human_review
    kind: approval_gate
    description: "Review the diff and the verification output before committing"

edges:
  - from: reproduce_failure
    to: isolate_and_patch
  - from: isolate_and_patch
    to: verify_fix
  - from: verify_fix
    to: human_review
```

## Node kinds

Each node has one `kind`. These are the kinds the released binary defines.

| Kind | What it does |
| :--- | :--- |
| `Agent` | Runs an agent step. With `--brain`, its context comes from agent-brain, added to the payload as `_brain_knapsack`. |
| `Checkpoint` | Writes an explicit, append-only state barrier. |
| `Verify` | Runs a shell command under a timeout and records its output and exit code. |
| `ApprovalGate` | Passes by default. With auto-approve off, waits for `approved: true` in the payload. |
| `Fork` | Splits into one branch per outgoing edge. The branches run in parallel. |
| `Join` | Waits for all the branches of the matching `Fork` before it continues. |
| `Router` | Sets the variables that conditional edges use. |
| `Debate` | Alternates between a coder and a critic over several rounds. It stops after a set number of rounds or when the critic approves. |
| `Vote` | Runs the same prompt several times and selects the best output, by majority or by the lowest validation error. |
| `Hydrate` | Collects static context, such as the git diff, test output or file contents, and adds it to the payload before an agent runs. |
| `SpeculativeFork` | Planned. The released executor passes its payload through unchanged. |

## Retries

A node can retry a failed step with exponential backoff:

```yaml
retry_policy:
  max_attempts: 3
  backoff_ms: 1000
```

When the attempts run out, the node fails. A failed node is recorded in the dead-letter file. See [troubleshooting](/docs/troubleshooting).

## Parallel branches

A node with more than one outgoing edge fans out. A `Join` node waits for every branch before the workflow moves on.

## Validate, run, inspect

```bash
agent-spine validate bugfix.yaml
agent-spine run bugfix.yaml -p '{"ticket": "BUG-42"}'
agent-spine inspect <EXECUTION_ID>
agent-spine replay <EXECUTION_ID>
```

`validate` checks the syntax and the node types. It accepts workflows with loops. `run` executes the file and writes its snapshots. `inspect` prints the steps of one run. `replay` recreates its final state without running any step again.

## Built-in workflows

`agent-spine init --with list` lists the templates. They include `@bugfix`, `@feature`, `@release-notes` and `@stacked-pr`, from the [registry](/registry).

## Read next

- [Using agent-spine with agent-brain](/docs/with-agent-brain)
- [Design decisions](/docs/decisions)
- [MCP tools](/docs/mcp-tools)
