---
title: Security
---

# Security

Allowing AI agents to run arbitrary code and execute shell commands is inherently dangerous. The Autonomic Ecosystem is designed with a "Secure by Default" philosophy.

## 1. Perimeter Defense
All external inputs (GitHub Webhooks, manual triggers, UI requests) are intercepted by **Agent Immune**. This agent sanitizes payloads, drops malicious requests, and validates cryptographic signatures before the message ever reaches the internal routing bus.

## 2. Execution Isolation
**Agent Muscle** does not execute commands on the host machine. Every execution task is spun up in an ephemeral, isolated Docker container or Firecracker microVM. 

- Containers have **no network access** by default unless explicitly granted by the Brain.
- Containers are destroyed immediately after execution.
- Disk usage is strictly limited and monitored.

## 3. Secret Management
Agents never hardcode secrets. All secrets are managed through a centralized key vault (Agent Spine) and injected only at runtime as temporary environment variables, which are stripped from logs by the Nerves router before being broadcasted.
