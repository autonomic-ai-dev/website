---
title: agent-spine CLI
---

# agent-spine CLI

The thesmos command in release 1.0.0-rc3 is `agent-spine`. The commands below are the ones this page checked against the released binary.

## init

```
agent-spine init [--force] [--dir <DIR>] [--with <WITH>]
```

Creates the state directory and writes an example workflow. `--with list` lists the built-in workflows. `--with universal-developer` writes one of them. `--dir` changes where workflow files go, and the default is `~/.autonomic/state/spine`.

`init` also checks for agent-brain and prints a warning when it is missing. You can ignore the warning.

## status

```
agent-spine status
```

Prints the capabilities the current scaffold has.

## doctor

```
agent-spine doctor
```

Checks the setup: rustc, protoc, bun, the state directory and the example workflow.

## validate

```
agent-spine validate <WORKFLOW>
```

Parses the YAML file and checks its node kinds and edges. It prints the workflow's name and start node when the file is valid.

## run

```
agent-spine run [--payload <JSON>] [--db <PATH>] <WORKFLOW>
```

Runs the workflow and writes a snapshot after each step. `--payload` sets the initial JSON payload, which defaults to `{}`. `--db` sets the SQLite file, which defaults to `~/.autonomic/logs/spine/state.db`.

`run` also accepts `--brain` and `--meta`. Both call agent-brain, which has been retired, so do not use them.

## inspect

```
agent-spine inspect [--db <PATH>] <EXECUTION_ID>
```

Prints the steps of one run, from its snapshots, in order.

## replay

```
agent-spine replay [--db <PATH>] <EXECUTION_ID>
```

Rebuilds the final state of one run from its snapshots. It runs no step again.

## Other subcommands

The binary also has `log`, `event`, `agent`, `update`, `serve`, `mcp-serve` and `brain`. This page does not document them. `brain` and `mcp-serve` depend on agent-brain, which has been retired.
