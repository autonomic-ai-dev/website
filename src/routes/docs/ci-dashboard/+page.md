---
title: Agent CI Dashboard (Mission Control)
---

# Agent CI Dashboard (`agent-ci-dashboard`)

`agent-ci-dashboard` is the mission control telemetry and release management web application for the Autonomic AI Ecosystem. Built using **SvelteKit 5 runes**, **Tailwind CSS**, and **Octokit**, it provides immediate situational triage across all 11 GitHub repositories.

---

## Key Features

1. **Differentiated CI Check States**:
   - Replaces vague "Checks Blocked" states with explicit **`Checks Failed`** (rose indicator with failed workflow names) and **`Checks Running`** (cyan spinner).
   - Only enables **`Squash & Merge`** when checks pass and all preconditions are satisfied.

2. **Inline Checks Pill Strip**:
   - Every PR card surfaces clickable check badges (e.g. `CI`, `Protected paths`, `Stage test`), allowing developers to click and inspect raw GitHub Actions logs directly within the embedded terminal modal.

3. **Batch Operations**:
   - Select multiple ready-to-merge PRs across different repositories and squash-merge them in one coordinated operation.
   - One-click branch update synchronization for outdated PR branches.

4. **Live Telemetry & Releases**:
   - Real-time GitHub release notes viewer with Markdown rendering and asset download links.
