# The MCP Gateway & Dual-Mode Architecture

The Autonomic AI ecosystem is built on a philosophy of **Cloud-Native Composability**. We recognize that forcing a developer to adopt an entire distributed cluster just to use a memory tool is a massive friction point. 

To solve this, Autonomic implements **Dual-Mode Transport** and the **MCP API Gateway**. This allows the ecosystem to effortlessly scale from a single standalone binary to a fully distributed, zero-trust cluster.

---

## 1. Standalone Mode (Graceful Degradation)

When a developer first discovers Autonomic AI, they usually have a specific, isolated pain point. For example, they are using Cursor and their context window is overflowing, so they install `agent-brain`.

**How it works:**
- The developer runs `agent-brain serve-mcp`.
- The binary probes the environment. If it does not detect a running NATS JetStream broker (`agent-nerves`), it gracefully degrades into **Standalone Mode**.
- It exposes its specific tools (e.g., `route_task`, `store_memory`) directly over standard `stdio`.
- Cursor connects to it, and it functions perfectly as an isolated MCP server.

This is the **"Trojan Horse"** adoption strategy. The developer gets immediate, frictionless value without needing to understand or deploy a service mesh. However, behind the scenes, `agent-brain` has initialized `~/.autonomic/config.toml`, preparing the host for the full cluster.

---

## 2. Cluster Mode (The MCP API Gateway)

Eventually, the developer hits the limits of their external orchestrator (e.g., Cursor or LangGraph). They experience hallucinated JSON, endless retries, and unsafe bash executions. They decide they need deterministic DAGs and zero-trust sandboxes, so they install the full stack (`agent-body`, `agent-spine`, `agent-muscle`, `agent-immune`).

At this point, configuring 5 different MCP servers in Claude Desktop or Cursor becomes a management nightmare. This is where the **MCP API Gateway** takes over.

**How it works:**
- The developer configures their external client (Cursor/Opencode) to point to a single command: `autonomic serve-mcp` (or `agent-mouth serve-mcp`).
- This Gateway node acts identically to an Ingress Controller in Kubernetes. 

### Dynamic Tool Discovery
When the external LLM connects to the Gateway and requests `tools/list`:
1. The Gateway broadcasts a discovery event over the NATS JetStream bus (`agent-nerves`).
2. The isolated daemons respond with their tools:
   - `agent-brain` reports: `["route_task", "search_symbols"]`
   - `agent-muscle` reports: `["execute_bash", "run_python"]`
3. The Gateway aggregates these into a single JSON schema and hands the LLM a unified list. The LLM believes it is talking to a massive, monolithic super-server.

### Event-Driven Execution
When the LLM calls `execute_bash`:
1. The Gateway receives the standard MCP request.
2. It packages the request and publishes it to the NATS topic `tools.call.muscle`.
3. `agent-muscle` (running safely in the background) picks up the event, forces it through `agent-immune` for security validation, and executes the command in a sandbox.
4. The output is published back to NATS, read by the Gateway, and streamed back to the LLM.

---

## 3. The Transition (From Standalone to Cluster)

What happens to a standalone MCP binary when the user decides to install the full Autonomic architecture? 

The transition is completely seamless. When the `autonomic` control plane initializes the cluster, it spins up `agent-nerves` (the NATS broker). 

Because the standalone daemons (like `agent-brain` or `agent-muscle`) are built with reactive environment detection, they notice the new local broker socket or `NATS_URL`. 
1. The standalone daemon immediately stops listening on `stdio`.
2. It establishes a connection to the NATS service mesh.
3. The user simply updates their Cursor/Opencode configuration to point to the Gateway (`autonomic serve-mcp`) instead of the individual binary.

The standalone tool effortlessly becomes a background microservice without requiring the user to reinstall or rewrite their tools.

---

## Why This Architecture Wins

1. **Frictionless Onboarding:** Developers can start with a single binary (like `agent-brain`) without deploying a broker.
2. **Zero Configuration Bloat:** When upgrading to the full cluster, the user doesn't have to manage 5 different server configurations in their IDE. They point to the Gateway once.
3. **Fault Isolation:** If an agent tries to compile a massive Rust project and crashes `agent-muscle` out of memory, the MCP connection to the LLM *does not die*. The Gateway survives, catches the daemon timeout, and gracefully returns a standard MCP error to the LLM, allowing the agent to self-correct. 

Autonomic AI gives you the frictionless setup of a simple script, with the fault tolerance of a Kubernetes cluster.
