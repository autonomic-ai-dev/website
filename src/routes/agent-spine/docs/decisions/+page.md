---
title: agent-spine design decisions
---

# agent-spine design decisions

Each decision below states what agent-spine does, why, and what it costs. These are the choices a team should know before it relies on the tool.

## A declarative graph instead of a prompt loop

A workflow is a YAML file of named nodes and edges. The order, the checks and the gates are written down before a run starts. The agent does the work inside a node. It does not decide what happens next.

**Why:** a prompt loop can improvise a different series of steps each time, and it leaves no record of what it tried.

**Cost:** a workflow has to be written before it runs. A task that needs a new shape of work means a new file.

## Snapshots are appended, never edited

After each step, agent-spine writes a row to the `snapshots` table in SQLite. Rows are only added.

**Why:** a finished run can be read in the order it happened, and a later step cannot rewrite what an earlier step recorded.

**Cost:** snapshots record the outcome the executor saw. A command that changed something outside the executor's view, such as a file outside the repository, is not captured.

## Replay reads the record, it does not re-run it

`replay` recreates the final state from the snapshots. It runs no agent step and no verify command.

**Why:** a replay that re-ran the steps could repeat side effects, and it could overwrite the record of the first run.

**Cost:** to run a workflow again, start a new execution. There is no resume command. Each execution keeps its own history.

## Approval gates pass by default

An `ApprovalGate` node passes unless auto-approve is turned off. When auto-approve is off, the node waits until its payload carries `approved: true`. The released command line has no command that sets the flag.

**Why:** most runs are started on purpose, by a person, and a gate that always waited would stop every unattended run.

**Cost:** a workflow with a gate in its YAML does not pause for a person by default. Whoever writes the workflow has to turn auto-approve off. A gate records that a flag was set, not who looked at the change.

## Cycles are accepted

`validate` accepts a workflow whose edges loop back to an earlier node. The scheduler treats a loop as adding no extra successor work, rather than rejecting the file.

**Why:** some useful procedures repeat until a check passes.

**Cost:** a loop can run for as long as its condition holds. Put a verify or approval node on the loop, so a check or a person decides when it stops.

## agent-brain is optional and fails open

`--brain` adds routed context to agent nodes, and `--meta` chooses a workflow by task. Neither is required. If agent-brain cannot be reached, `--brain` falls back to spine's built-in router, and `--meta` runs the default workflow.

**Why:** a missing helper should not stop a workflow that can run without it.

**Cost:** a run can finish without the context it was meant to have. Check the node outputs when the result matters.

## Failed nodes go to a dead-letter record

A failed node is written to `system.dlq` when the binary has NATS support and the broker accepts it. Otherwise it is appended to `~/.autonomic/state/spine/dlq.jsonl`.

**Why:** a failure should be kept for review, even when no broker is running.

**Cost:** the local file is not shared between machines. Someone has to read it.

## Events are optional

Events are published to NATS only when `AUTONOMIC_NATS_URL` is set. Without it, agent-spine runs with no broker.

**Why:** a local developer should not need a server to run a workflow.

**Cost:** other tools cannot follow a run live unless the broker is configured.

## Planned, not shipped

`SpeculativeFork` is part of the workflow model. The released executor passes its payload through unchanged. It does not create worktrees or pick a winner.

**Why:** the node kind is reserved so workflows written now keep working when it arrives.

**Cost:** a workflow that depends on parallel exploration cannot use this node yet.
