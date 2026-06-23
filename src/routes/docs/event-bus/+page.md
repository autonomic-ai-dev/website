---
title: Event Bus
---

# The Event Bus (agent-nerves)

The Autonomic stack uses an **agent mesh** — independent daemons communicate asynchronously via NATS JetStream, not direct HTTP coupling between every pair.

This event bus is managed by the `agent-nerves` daemon, which acts as a bridge to the underlying [NATS server](https://nats.io/) infrastructure.

## Why a Decoupled Pub/Sub Architecture?

Traditional AI agents are monolithic. When an agent wants to run a shell command and parse the output, the entire process happens synchronously within a single context loop. If the terminal command hangs, the agent hangs. If the context window fills up, the agent crashes.

By decoupling the architecture using a Pub/Sub event bus, we achieve:
1. **Resilience:** If the visual QA organ (`agent-eyes`) crashes due to an Out of Memory error, the execution organ (`agent-muscle`) is completely unaffected. `agent-body` will restart `agent-eyes`, which will simply reconnect to the bus and pick up exactly where it left off.
2. **Scalability:** You can run `agent-muscle` on a high-powered GPU rig in the cloud while running `agent-brain` on your local laptop. As long as both machines are connected to the same NATS cluster, they can communicate seamlessly.
3. **Observability:** Because every action is an event traversing the bus, you can easily tail the traffic (e.g., using `agent-nerves stream`) to see exactly what the entire system is doing in real-time.

## How it Works

The communication flow relies heavily on the NATS JetStream persistence engine.

1. **Publishing:** When an organ completes a task, it publishes an event. For example, when `agent-muscle` finishes deploying a frontend application, it publishes a `deploy.frontend.success` event.
2. **Subscribing:** Other organs subscribe to relevant subjects. `agent-eyes` is constantly listening for `deploy.frontend.success` events.
3. **Action:** When `agent-eyes` receives the event, it knows the deployment is ready, so it automatically navigates to the URL and captures a baseline screenshot.
4. **State Management:** The `agent-spine` workflow engine observes *all* events on the bus. It uses these events to advance the state of the active Directed Acyclic Graph (DAG) and trigger the next sequential nodes.

### JetStream Persistence

We rely on NATS JetStream to provide **durable subscriptions**. 

If an organ is temporarily offline (perhaps it is being restarted by `agent-body` or a new version is being deployed), it will not miss any events. When it reconnects to the NATS cluster, JetStream will deliver the backlog of events that occurred while it was down, ensuring zero data loss and guaranteed at-least-once delivery.

## Event Filters (JSON & WASM)

The `agent-nerves` CLI allows you to register sophisticated event filters.

These filters can be written in simple JSON schemas or compiled to WebAssembly (WASM) for high-performance parsing. Filters are pushed directly down to the NATS server, ensuring that organs only receive exactly the events they are programmed to handle, preventing network saturation and CPU waste.
