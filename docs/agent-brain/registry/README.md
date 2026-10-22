# Curated Package Registry (`agent-registry`)

One-command skill packs, playbooks, and workflows via **`agent-brain package add @alias`**.

Starting in v1.0.0, the registry is dynamically synchronized from the central [**`autonomic-ai-dev/agent-registry`**](https://github.com/autonomic-ai-dev/agent-registry) repository into `~/.autonomic/memory/registry-cache/repo/`, decoupling package releases and updates from `agent-brain` binary compilations.

---

## Dynamic Registry Synchronization

Synchronize the latest curated skills, workflows, and developer utilities:

```bash
agent-brain registry sync
```

`agent-brain` shallow clones or pulls the canonical `agent-registry` repository, copies `registry.json`, `utilities.json`, and `workflows.json` into cache, and makes all aliases immediately installable.

---

## Available Curated Aliases

| Alias | Description | Origin / Package |
|---|---|---|
| `@agstack` | **Gold Standard** — Full-SDLC engineering operating system, 11 playbooks, strict `.verify/` contracts, immutability, security audits, and zero comment slop | `packages/agstack` |
| `@coding-policy` | Alias for `@agstack` (backward-compatible) | `packages/agstack` |
| `@matt-skills` / `@mattpocock` | **Default** — Matt Pocock skills (boosted in routing) | `mattpocock/skills` |
| `@starter` | Onboarding pack | `mattpocock/skills`, `vercel-labs/agent-skills` |
| `@nextjs` | React / Next.js / React Native agent skills | `vercel-labs/agent-skills` |
| `@ecc` | Full Everything Claude Code (ECC) library | `affaan-m/everything-claude-code` |
| `@rust` | Rust patterns, testing, and review (via ECC) | `affaan-m/everything-claude-code` |
| `@supervisor` | Execution supervisor (bundled) | `bundle:supervisor` |
| `@official` | Official ecosystem skills | `awesome-copilot`, `anthropics/skills`, `azure-skills` |

List available packages, utilities, and workflows at any time:

```bash
agent-brain registry list
```

---

## Installation & Management

```bash
# Sync latest registry from remote
agent-brain registry sync

# Install agstack gold-standard engineering package
agent-brain package add @agstack

# Install community packages
agent-brain package add @starter
agent-brain package add @nextjs

# List active local packages
agent-brain package list

# Update installed packages
agent-brain package update
```

Default packages (`"default": true` in `registry.json`) are cloned and indexed automatically on `agent-brain install` and `agent-brain doctor --fix`. Skills under those install paths receive an additive `recommend_boost` during `route_task` ranking.

---

## Curated Workflows

Workflows (`workflows/*.yaml`) defined in the registry automate multi-step engineering lifecycles. They support **dual-mode execution**:
1. **With Spine:** `agent-spine run workflows/<name>.yaml` or MCP `spine_submit_workflow`.
2. **Without Spine (Autonomous Agent Engine):** Any agent directly self-orchestrates the DAG using the `workflow-engine` skill, or runs `./scripts/run-workflow.sh run workflows/<name>.yaml`.

| Workflow | Alias | Purpose |
|---|---|---|
| `workflows/bugfix.yaml` | `@bugfix` | Reproduce (failing test) -> Isolate -> Fix -> Verify -> QualityGate -> Review |
| `workflows/feature.yaml` | `@feature` | Intent -> ModelDomain -> 4-H2 Contract -> Implement -> Hurl Suites -> SecurityGate -> ReviewGate |
| `workflows/stacked-pr.yaml` | `@stacked-pr` | InspectStack -> AtomicChunking -> VerificationGate -> RichDescription -> ApprovalGate |
| `workflows/release-notes.yaml` | `@release-notes` | CollectDiff -> DraftNotes (Diátaxis) -> ReviewGate -> Publish |
| `workflows/mcp-health-check.yaml` | `@mcp-health-check` | AuditSchemas -> GatewayProbe -> VerifyRouting -> Report |

---

## Adding New Packages or Aliases

Because the registry is decoupled:
1. Open a Pull Request directly against [**`autonomic-ai-dev/agent-registry`**](https://github.com/autonomic-ai-dev/agent-registry).
2. Add your package directory under `packages/<your-pkg>` or register external git sources in `registry.json`.
3. Once merged, users immediately receive the package upon running `agent-brain registry sync`—no binary re-release required.
