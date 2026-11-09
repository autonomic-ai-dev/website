---
title: agent-spine troubleshooting
---

# agent-spine troubleshooting

Start with the setup check and the log list:

```bash
agent-spine doctor
agent-spine log --list
```

`doctor` checks rustc, protoc, bun, the `agent-brain` binary, the state directory and the example workflow.

## A workflow is waiting at an approval gate

Find the execution, then check which gate it is waiting on:

```bash
agent-spine inspect <EXECUTION_ID>
```

Gates auto-approve unless auto-approve is turned off. When it is off, a node waits until its payload carries `approved: true`. No command in the released binary sets that flag, so a process that writes the payload has to set it after someone has reviewed the change.

## A run stopped at a failed node

Read what the run recorded, fix the cause, then run the workflow again. There is no resume command, so a new run gets its own history:

```bash
agent-spine inspect <EXECUTION_ID>
agent-spine run bugfix.yaml
```

## Replay shows a different result from the original run

`replay` recreates the final state from the snapshots. It does not run any step again, so it cannot show a result the original run did not record. Use `inspect` to read the steps in order.

```bash
agent-spine replay <EXECUTION_ID>
```

## Failed nodes are missing from the dead-letter record

A failed node is written to `system.dlq` when the binary was built with NATS and the broker accepts it. Otherwise it is appended to a local file:

```text
~/.autonomic/state/spine/dlq.jsonl
```

Check the file first. If you use NATS, check that the broker is reachable with the URL in `AUTONOMIC_NATS_URL`.

## Events do not reach NATS

Events go to NATS only when `AUTONOMIC_NATS_URL` is set, or when `serve` is started with `--nats-url`. Confirm the variable is set in the environment of the process that runs the workflow, then check the broker with your NATS tooling.

## agent-brain does not respond to `--brain` or `--meta`

Check that agent-brain is reachable from spine:

```bash
agent-spine brain health
agent-spine brain status
```

If agent-brain is unavailable, `--brain` falls back to spine's built-in router, and `--meta` logs a warning and runs the default workflow. The run still completes. See [using agent-spine with agent-brain](/docs/with-agent-brain).

## Read the daemon logs

```bash
agent-spine log --list
agent-spine log spine --follow
```
