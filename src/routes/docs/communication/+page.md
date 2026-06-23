---
title: Notifications & Logging
---

# Communication (agent-mouth)

`agent-mouth` is the **I/O gateway** — AST command validation, webhooks, approvals, and log summarization for the Autonomic stack.

## Webhooks & Integrations

Rather than having every organ implement its own Slack, Discord, or Email API integrations, all outbound communication is routed through `agent-mouth`.

If `agent-immune` detects a critical CVE, or `agent-heart` detects that the token budget is nearly exhausted, they simply publish a semantic event to the `agent-nerves` event bus. `agent-mouth` listens for these high-priority events and translates them into formatted payloads, delivering them to your configured webhooks.

## Log Summarization

When a complex DAG workflow executes via `agent-spine`, it can generate thousands of lines of dense JSON output. `agent-mouth` is capable of subscribing to these raw log streams and using a small, fast LLM to synthesize human-readable summaries.

This allows the system to provide concise, actionable updates to human operators (e.g., "The PR #42 deployment failed because the database migration timed out") rather than forcing the user to manually parse raw trace logs.
