---
title: How agent-brain works
---

# How agent-brain works

This page follows one turn from start to finish, and explains the parts that decide what the agent sees and what counts as evidence.

## The turn

1. **Route first.** In hosts with hooks, a route gate blocks agent-brain's other tools until the agent has called `route_task` for the current prompt. Hosts without hooks rely on the instructions.
2. **Retrieve.** agent-brain embeds the prompt with the local all-MiniLM-L6-v2 model, a 384-dimension vector. It also runs a BM25 keyword match over indexed skills, rules and memory facts. The two rankings are fused into one score.
3. **Pack within a budget.** A greedy packer fills the response up to a token budget set by task kind. The budgets are 350 tokens for verification, 550 for review, 600 for implementing, 650 for debugging and 700 for architecture, when the caller asks for the default of 500.
4. **Adjust from history.** Verify outcomes stored in the database can promote a recipe to a must-apply rule when it has passed, or suppress a suggestion that has been failing.
5. **Scout before reading.** Native full-file reads of a path are held back until the agent has looked at it with a bounded tool such as `file_summary`, `read_file_head` or `grep_search`. Scouting a path opens it for a time window.
6. **Verify.** Commands the agent runs for evidence go through `agent-brain verify`, which records the exit code against the current route.
7. **Remember.** At the end of a task, the agent stores durable decisions with `store_memory`. If the connection drops, the fact is kept in a local queue and not lost.

## What counts as evidence

Not every test run carries the same weight. agent-brain records where each outcome came from:

| Source | How it is recorded | Weight |
| :--- | :--- | :--- |
| `orchestrator` | `agent-brain verify --source orchestrator -- <cmd>`, for CI runs and workflow nodes | Trusted |
| `cli` | `agent-brain verify -- <cmd>`, for a command in the project's allowlist | Trusted when allowlisted |
| `hook` | A shell capture hook | Observational |
| `mcp` | `record_verify_outcome`, a claim the agent makes | Advisory only |

Only trusted outcomes can promote a recipe. An outcome the agent merely asserts cannot.

## Allowlist

Each project lists the commands that may count as verification in `.verify/verify.toml`. `agent-brain verify init` writes a starting file. A command outside the list still runs, but it is not recorded as passing evidence.

## Receipts

`agent-brain verify receipt` reads the latest run for the current commit and code state, and reports PASSED, FAILED or NOT VERIFIED. The receipt is tied to the commit, so a passing run on an older commit does not count for the current one.

## Memory and procedures

- **Facts** are short statements stored with `store_memory` or `remember`. They are searchable and carry a topic.
- **Procedures** are sequences of verified steps. `recall_procedures` returns them ranked by match, by how well they fit the task kind, and by past success rate.
- **Skills** are `SKILL.md` instructions indexed from installed packages. `skill_get` loads one in full.
