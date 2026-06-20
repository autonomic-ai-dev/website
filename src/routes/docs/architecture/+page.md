---
title: Architecture
---

# Architecture

The Autonomic Ecosystem relies on a strict separation of concerns, heavily inspired by the biological nervous system. This ensures that no single failure can take down the entire operation.

## 1. The Nervous System (Agent Nerves)
At the core of the architecture is **Agent Nerves**, a high-speed WebSocket router. Every other agent connects to Nerves. Nerves does not perform heavy computation; it only routes messages.

## 2. Perception (Agent Eyes & Immune)
When a GitHub Webhook is received:
1. **Agent Immune** intercepts it, strips out potential injection attacks, and verifies signatures.
2. **Agent Eyes** extracts the semantic meaning (e.g., "A new PR was opened", "A test failed") and sends this structured data to the Brain.

## 3. Cognition (Agent Brain)
**Agent Brain** holds the LLM logic and context memory. It reads the structured data, forms an execution plan, and emits tasks back to the Nerves.

## 4. Execution (Agent Muscle)
**Agent Muscle** listens for execution tasks. It spins up isolated environments, runs the builds/tests/deployments, and streams the logs back to Nerves in real-time.
