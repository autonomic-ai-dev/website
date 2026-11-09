---
title: agent-brain design decisions
---

# agent-brain design decisions

Each decision below states what agent-brain does, why, and what it costs.

## Local first, no model calls

Routing, memory, verify and the gates run from files on your machine. agent-brain does not call a model, and it has no telemetry SDK in the crate.

**Why:** the context an agent receives, and the record of what it verified, should stay with the team that owns the repository.

**Cost:** the embedding model runs locally, so search quality depends on that model. Features that need a network connection are opt-in and are listed on the [configuration](/docs/configuration) page.

## MCP over stdio as the integration layer

Hosts talk to agent-brain through the Model Context Protocol, over standard input and output. The tools are the same in every host. Each host also gets a small amount of its own setup: the MCP entry, the hooks where the host supports them, and the instruction files.

**Why:** one set of tools works across editors, and only the host-specific setup changes per editor.

**Cost:** MCP carries tools but not hooks, so enforcement depends on the host. Hosts without hooks get the instructions and nothing that blocks a tool.

## One daemon behind many editors

Several editors can run agent-brain at the same time. The stdio server forwards each call to one background daemon that owns the database.

**Why:** two processes writing one database would contend for its lock, and the index would be loaded more than once.

**Cost:** when the daemon has a fault, every editor sees it. The troubleshooting page covers the lock file and the repair command.

## Hybrid retrieval

Routing combines keyword search (BM25, over SQLite FTS5) with vector search over a local embedding. Above 256 indexed items, the vector search uses an approximate nearest-neighbour graph.

**Why:** keyword search finds exact names and rule titles, and vector search finds items that use different words for the same idea.

**Cost:** two indexes to keep up to date, and an approximate search above the threshold can miss a close match.

## Fixed token budgets by task kind

Each route fills a budget set by task kind: 350 tokens for verification, 550 for review, 600 for implementing, 650 for debugging and 700 for architecture, when the caller asks for the default.

**Why:** routed context should stay small enough that it does not crowd out the task itself.

**Cost:** a relevant item that ranks below the cut is left out. Ask for more context in a narrower task, or read the route summary to see what was dropped.

## Gates where the host allows them

Route and bash gates run in hosts that support hooks. In hosts without hooks, agent-brain relies on the instructions and reports which protection applies.

**Why:** a gate that cannot be enforced should not be presented as one.

**Cost:** protection differs between editors. The [architecture](/docs/architecture) page lists the trust level for each source of verify evidence.

## Trust levels for evidence

A verify outcome counts toward learning and receipts only when it was run through a trusted path. An outcome the agent merely reports is kept as advisory.

**Why:** an agent that could claim its own tests passed would teach the system to trust claims.

**Cost:** the agent has to run its checks through `agent-brain verify`, and the command has to be on the project's allowlist.

## Receipts tied to a commit

`verify receipt` reports whether the current commit and code state passed. A pass on an older commit does not count.

**Why:** a receipt that survives a later change would prove nothing about the code that ships.

**Cost:** after each change, the check has to run again before the receipt is current.

## Measured figures, labelled estimates

The dashboard and the weekly summary report counts that were recorded. Figures that are modelled are labelled as estimates and are not used as headlines.

**Why:** an estimate shown as a result misleads the people who read it.

**Cost:** the headline numbers are smaller. They describe what the tool did, not what it saved.

## Auto-update is off by default

The auto-update check is disabled in the built-in settings. It is turned on in `config.yaml`.

**Why:** a tool that installs its own updates should only do so when the user has chosen it.

**Cost:** you have to run `agent-brain update` yourself, or enable the setting, to receive new releases.
