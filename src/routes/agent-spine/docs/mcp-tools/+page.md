---
title: agent-spine MCP tools
---

# agent-spine MCP tools

`agent-spine mcp-serve` runs a stdio MCP server that exposes workflow orchestration to an IDE or any MCP host. The table lists the tools the server advertises at release 1.0.0-rc3. The descriptions are the server's own text.

| Tool | Parameters | What it does |
| :--- | :--- | :--- |
| `spine_submit_workflow` | `yaml`, `name` | Submits a YAML workflow DAG definition for execution and returns a workflow ID. |
| `spine_check_status` | `workflow_id` | Checks the status of a workflow execution by ID. |
| `spine_list_workflows` | `limit` | Lists recent workflow executions with their IDs, names, statuses and timestamps. |

## Start the server

```bash
agent-spine mcp-serve
```

Register it in your host the same way you register any stdio MCP server. The server reads and writes the same execution database as `agent-spine run`, so a run started from a host shows up in `agent-spine inspect`.

## Using it with agent-brain

agent-spine calls agent-brain only when you ask it to. See [using agent-spine with agent-brain](/docs/with-agent-brain) for the `--brain` and `--meta` flags.
