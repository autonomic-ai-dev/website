---
title: Using agent-spine with agent-brain
---

# Using agent-spine with agent-brain

agent-spine runs a workflow with or without agent-brain. Install agent-brain when you want two things: the agent steps of a workflow to receive routed context, and the workflow file to be chosen from the task you describe.

Both tools stay separate. agent-spine decides the order of steps and records each one. agent-brain returns skills, rules and traps for a task. agent-brain does not run a workflow, and agent-spine does not decide what context an agent sees.

## Enrich agent steps with `--brain`

```bash
agent-spine run bugfix.yaml --brain
```

`--brain` (`-b`) turns on agent-brain routing and enrichment. Before each `agent` node runs, agent-spine asks agent-brain for a routed slice of context for that node. The result is added to the node's payload as `_brain_knapsack`, a token-budgeted set of skills, rules and traps.

If agent-brain cannot be reached, agent-spine falls back to its built-in heuristic router and the run continues.

## Choose the workflow with `--meta`

```bash
agent-spine run workflow.yaml --meta "Review open PRs and generate a changelog"
```

`--meta` sends the task description to agent-brain, which recommends a workflow. agent-spine then runs that workflow file. If agent-brain is unavailable, agent-spine logs a warning and runs the default workflow.

## Set it up

1. Install both tools: `brew install agent-brain agent-spine`.
2. Run `agent-brain install --global` and `agent-brain doctor` so agent-brain is on your `PATH` and its MCP server is registered.
3. Run a workflow with `--brain` and read the run with `agent-spine inspect <EXECUTION_ID>`.

## What to expect

- Routed context is advisory. An agent step that receives `_brain_knapsack` can still ignore it, so check the result with a verify step.
