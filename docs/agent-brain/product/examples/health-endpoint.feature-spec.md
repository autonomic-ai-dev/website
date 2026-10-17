# Feature spec: Health check endpoint

## Metadata

| Field | Value |
|-------|-------|
| Status | example |
| Owner | platform |
| Target release | next patch |

## Capability

Operators and load balancers can GET `/health` and receive a JSON body with service name, version, and `ok: true` when the process is live.

## User stories

1. As an operator, I want a health endpoint so that orchestrators can probe liveness without auth.

## Acceptance criteria

- [ ] `GET /health` returns 200 and `{"ok":true,"service":"<crate>","version":"<semver>"}`
- [ ] No database or external dependency required for 200 response
- [ ] Unit test covers handler; integration test hits route on test server
- [ ] Documented in README under Operations

## Constraints

- Match existing Axum router patterns in `serve.rs`
- No new dependencies

## Interfaces

| Surface | Input | Output | Notes |
|---------|-------|--------|-------|
| `GET /health` | — | JSON | Public, no auth |

## Test plan

| Layer | What to run | Pass condition |
|-------|-------------|----------------|
| Unit | `cargo test health` | handler returns ok JSON |
| Integration | `cargo test --test health_route` | 200 on test server |

## Non-goals

- Readiness checks against downstream services
- Metrics export

## Open questions

- [ ] None
