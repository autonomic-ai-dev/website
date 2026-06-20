---
title: Supervision & Daemonization
---

# Supervision (agent-body)

The entire Autonomic ecosystem runs on a foundation of reliability and daemonization provided by `agent-body`. Rather than manually starting individual servers in separate terminal tabs, `agent-body` acts as the master supervisor process.

## The Process Tree

When you run `autonomic start`, `agent-body` launches as the root of the process tree. It reads the local environment and begins daemonizing the 8 other organs according to a strict boot sequence:

1. **NATS Server (`agent-nerves` foundation):** Booted first to establish the event bus.
2. **agent-brain:** Booted second to provide memory and context routing.
3. **agent-spine, agent-heart, agent-muscle, etc.:** Booted concurrently once the bus and brain are healthy.

## Health Checks & Self-Healing

The core concept of `agent-body` is **resilience through isolation**. Because each organ is a completely isolated binary, a failure in one does not cascade.

`agent-body` continuously monitors the PID and `/health` HTTP endpoint of every organ it supervises. If `agent-eyes` runs out of memory while processing a massive screenshot, the OS will kill it. `agent-body` immediately detects the termination, logs the crash, and spawns a fresh `agent-eyes` instance. The new instance simply reconnects to the `agent-nerves` event bus and picks up the next task from the JetStream queue.

## Standardized Logging

`agent-body` intercepts the stdout and stderr streams of all child organs. It formats them into a unified, color-coded stream that you can tail using `autonomic logs`. This provides a centralized view of the entire distributed system without needing to hunt for individual log files.
