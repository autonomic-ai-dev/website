# Project constitution

> Copy to `CONSTITUTION.md` at the repo root. This file is **policy**, not a task list.
> agent-brain indexes it as a project rule; spine workflows inject it into every Agent node.

## Purpose

<!-- One paragraph: what this product is and who it serves -->

## Stack (fixed)

- Language / runtime:
- Framework:
- Database:
- Test runner:
- Package manager:

## Quality bar

- All new behavior has automated tests (unit minimum; integration where I/O exists).
- No secrets in git; use env vars / secret manager.
- Public APIs documented; breaking changes need migration notes.
- Prefer minimal diffs; match existing naming and patterns.

## Architecture invariants

- <!-- e.g. handlers → services → repos; no SQL in handlers -->
- <!-- e.g. MCP tools are thin; business logic in library crates -->

## Security & compliance

- <!-- auth model, PII handling, dependency audit policy -->

## Non-goals (project-wide)

- <!-- things we explicitly will not build in this repo -->

## Feature spec location

- Specs live under `docs/features/<kebab-name>.md`.
- One spec = one shippable capability; link related specs, do not merge unrelated work.

## Agent instructions

- Read `CONSTITUTION.md` before planning or editing.
- Read the active feature spec when one is named in the spine payload (`feature_spec`).
- Call `store_memory` at task end for durable decisions (max 50 words, no secrets).
- Do not wire experimental brain routing (rerank, query decompose, L2 cache) without eval gate.
