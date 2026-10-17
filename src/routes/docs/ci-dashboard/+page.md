---
title: Mission Control Dashboard (agent-ci-dashboard)
---

# `agent-ci-dashboard` — Web Mission Control

`agent-ci-dashboard` is the web-based mission control and release orchestration dashboard for the Autonomic AI cluster. Built with **SvelteKit 5 runes**, **Tailwind CSS**, and **Octokit**, it provides real-time situational triage across all 11 ecosystem repositories, interactive CI check inspection, inline terminal log viewing, and one-click batch pull request merging.

```mermaid
flowchart TD
    User["DevOps Engineer / Operator"] --> WebUI["agent-ci-dashboard (SvelteKit 5)"]

    subgraph StateManagement["SvelteKit 5 Reactive Runes"]
        Pulls["$state(pulls)\n(Aggregated PR Matrix)"]
        Checks["$state(checks)\n(Inline Check Pills)"]
        Releases["$derived(releases)\n(Dynamic Tag & Notes)"]
    end

    subgraph GitHubSync["GitHub REST & GraphQL Engine"]
        Octokit["Octokit API Client\n(App Token Authentication)"]
        Actions["GitHub Actions Telemetry\n(/actions/runs/{id}/logs)"]
        PRs["PR Status & Branch Updater\n(/pulls/{num}/update-branch)"]
    end

    WebUI --> StateManagement
    StateManagement <--> GitHubSync
    GitHubSync <--> Repos["11 Organ Repositories\n(autonomic-ai-dev/*)"]

    classDef web fill:#081c2e,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    classDef sync fill:#04211a,stroke:#10b981,stroke-width:1.5px,color:#f8fafc;
    class User,WebUI,StateManagement web;
    class GitHubSync,Repos sync;
```

---

## Architectural Invariants

### 1. Differentiated Check State Machine
Prior to v1.0.0-beta.3, pull requests in a failed state were ambiguously lumped together with running checks under "Merge Blocked", making triage difficult. The dashboard implements a granular 4-state check resolver:
- **`Checks Failed`** (Rose badge): Displays exact failed workflow names (e.g. `Stage test`, `CI`, `Protected paths`). The merge button is rendered as a disabled `Checks Failed` state.
- **`Checks Running`** (Cyan spinner badge): Indicates active GitHub Actions execution. Merge button shows `Checks Running`.
- **`Merge Blocked`** (Amber badge): Checks passed, but merge conflicts or missing approvals remain.
- **`Ready to Merge`** (Emerald badge): All required status checks passed cleanly; enables the 1-click `Squash & Merge` button.

### 2. Inline Check Pill Strip & Terminal Log Modal
Every PR card surfaces an inline check pill strip. Clicking any check badge immediately opens an embedded terminal modal streaming raw GitHub Actions step logs with ANSI color syntax highlighting, allowing developers to diagnose test failures without navigating away to github.com.

### 3. Coordinated Batch Merge Engine
In a microservice ecosystem, synchronizing cross-organ dependency bumps across 11 repositories by clicking PRs individually is tedious. The dashboard enables multi-select batch merging: operators check multiple verified PRs and dispatch a coordinated squash-merge queue with automatic branch deletion.

### 4. Dynamic Ecosystem Version Derivation
The dashboard dynamically derives the ecosystem baseline and active repository release tags from GitHub API release streams rather than static hardcoded strings. If a repository releases `v1.0.0-beta.3`, the mission control header, sidebar, and repository cards update automatically.

---

## Environment Configuration

Configure `agent-ci-dashboard` with standard OAuth and GitHub credentials:

```bash
# .env.local
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
GITHUB_CLIENT_ID=Ov23li...
GITHUB_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:5173
```

---

## Local Development Workflow

```bash
# 1. Clone repository
git clone https://github.com/autonomic-ai-dev/agent-ci-dashboard.git
cd agent-ci-dashboard

# 2. Install dependencies (Node 20+)
npm install

# 3. Launch local development server with Vite
npm run dev

# 4. Run type checks and production build
npm run check
npm run build
```
