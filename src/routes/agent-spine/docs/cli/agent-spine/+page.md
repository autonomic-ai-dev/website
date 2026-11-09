---
title: agent-spine CLI reference
---

# agent-spine CLI reference

Every command below is printed by the `agent-spine` binary. Each block is the output of `agent-spine COMMAND --help` for release 1.0.0-rc3, including the nested subcommands for `brain`, `event` and `agent`. For a short list and the workflow concepts, see the [CLI overview](/docs/cli) and the [workflows](/docs/workflows) page.

## Common workflows

Scaffold a built-in workflow, check it, and run it:

```bash
agent-spine init --with @bugfix
agent-spine validate bugfix.yaml
agent-spine run bugfix.yaml -p '{"ticket": "BUG-42"}'
```

Read the history of a finished run, and recreate its final state:

```bash
agent-spine inspect <EXECUTION_ID>
agent-spine replay <EXECUTION_ID>
```

Run the same workflow with agent-brain routing and check the connection:

```bash
agent-spine run bugfix.yaml --brain
agent-spine brain health
```

---

### agent-spine init

```text
Initialize agent-spine: config, example workflow, and prerequisites check

Usage: agent-spine init [OPTIONS]

Options:
  -f, --force        Skip prerequisite checks (protoc, bun, agent-brain)
  -d, --dir <DIR>    Target directory for workflow files (default: ~/.autonomic/state/spine)
  -w, --with <WITH>  Generate a specific built-in workflow instead of the generic example. Use `--with list` to see available workflows
  -h, --help         Print help

```

### agent-spine status

```text
Display the capabilities planned for the current scaffold

Usage: agent-spine status

Options:
  -h, --help  Print help

```

### agent-spine doctor

```text
Diagnose common setup issues

Usage: agent-spine doctor

Options:
  -h, --help  Print help

```

### agent-spine log

```text
Display daemon logs

Usage: agent-spine log [OPTIONS] [NAME]

Arguments:
  [NAME]  Daemon name (e.g. spine) or "all"

Options:
  -f, --follow  Follow log output (tail -f)
  -l, --list    List available log files
  -h, --help    Print help

```

### agent-spine validate

```text
Parse and validate a YAML workflow definition

Usage: agent-spine validate <WORKFLOW>

Arguments:
  <WORKFLOW>  Path to a workflow definition file

Options:
  -h, --help  Print help

```

### agent-spine run

```text
Execute a YAML workflow locally

Usage: agent-spine run [OPTIONS] <WORKFLOW>

Arguments:
  <WORKFLOW>  Path to a workflow definition file

Options:
  -p, --payload <PAYLOAD>  Initial JSON payload [default: {}]
  -d, --db <DB>            Path to SQLite database (default: ~/.autonomic/logs/spine/state.db)
  -b, --brain              Enable agent-brain routing and enrichment
  -m, --meta <META>        Enable meta-router: query agent-brain to select the workflow YAML based on this task prompt before execution
  -h, --help               Print help

```

### agent-spine inspect

```text
Inspect the history of a specific execution

Usage: agent-spine inspect [OPTIONS] <EXECUTION_ID>

Arguments:
  <EXECUTION_ID>  Execution ID to inspect

Options:
  -d, --db <DB>  Path to SQLite database
  -h, --help     Print help

```

### agent-spine replay

```text
Replay an execution to recreate its final state

Usage: agent-spine replay [OPTIONS] <EXECUTION_ID>

Arguments:
  <EXECUTION_ID>  Execution ID to replay

Options:
  -d, --db <DB>  Path to SQLite database
  -h, --help     Print help

```

### agent-spine brain

```text
Interact with the agent-brain MCP server

Usage: agent-spine brain <COMMAND>

Commands:
  health  Check if agent-brain is reachable
  route   Send a route_task query and show the response
  status  Show agent-brain index and status info
  help    Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help

```

### agent-spine event

```text
Event bus operations

Usage: agent-spine event <COMMAND>

Commands:
  serve  Start the event bus server
  pub    Publish an event to the bus
  sub    Subscribe to events from the bus (prints to stdout as JSON)
  help   Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help

```

### agent-spine agent

```text
Agent registry operations

Usage: agent-spine agent <COMMAND>

Commands:
  list      List registered agents
  register  Register an agent with the bus
  info      Get info about a specific agent
  help      Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help

```

### agent-spine update

```text
Check for and apply updates

Usage: agent-spine update [OPTIONS]

Options:
  -f, --force  Apply update even if already at latest version
  -h, --help   Print help

```

### agent-spine mcp-serve

```text
Serve the MCP stdio server for workflow management

Usage: agent-spine mcp-serve [OPTIONS]

Options:
  -d, --db <DB>  Path to SQLite database (default: ~/.autonomic/logs/spine/state.db)
  -h, --help     Print help

```

### agent-spine serve

```text
Serve the Live Dashboard API

Usage: agent-spine serve [OPTIONS]

Options:
  -d, --db <DB>
          Path to SQLite database
  -p, --port <PORT>
          Port to listen on [default: 3000]
      --dashboard-port <DASHBOARD_PORT>
          Dashboard HTTP port (defaults to port + 1) [default: 3001]
      --nats-url <NATS_URL>
          NATS URL for JetStream event sourcing (or set AUTONOMIC_NATS_URL)
  -h, --help
          Print help

```

### agent-spine brain health

```text
error: unrecognized subcommand 'brain health'

  tip: a similar subcommand exists: 'brain'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine brain route

```text
error: unrecognized subcommand 'brain route'

  tip: a similar subcommand exists: 'brain'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine brain status

```text
error: unrecognized subcommand 'brain status'

  tip: a similar subcommand exists: 'brain'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine event serve

```text
error: unrecognized subcommand 'event serve'

  tip: a similar subcommand exists: 'event'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine event pub

```text
error: unrecognized subcommand 'event pub'

  tip: a similar subcommand exists: 'event'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine event sub

```text
error: unrecognized subcommand 'event sub'

  tip: a similar subcommand exists: 'event'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine agent list

```text
error: unrecognized subcommand 'agent list'

  tip: a similar subcommand exists: 'agent'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine agent register

```text
error: unrecognized subcommand 'agent register'

  tip: a similar subcommand exists: 'agent'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```

### agent-spine agent info

```text
error: unrecognized subcommand 'agent info'

  tip: a similar subcommand exists: 'agent'

Usage: agent-spine <COMMAND>

For more information, try '--help'.

```
