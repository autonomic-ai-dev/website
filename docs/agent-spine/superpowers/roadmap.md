# agent-spine Roadmap

## ✅ Completed Features
- **Native Tokio Concurrency & YAML Parsing:** Parallel fan-out workflow execution.
- **Sandboxed Execution:** `bollard` Docker wrappers for untrusted LLM code.
- **Unified Wake-On-Call:** `agent-spine` automatically booting `agent-brain`.

## ⏳ Active Backlog (Pending)

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Store massive execution JSON logs and DAG state graphs exclusively inside `~/.autonomic/logs/`.
- [x] **Universal CLI Compatibility:** Expose endpoints and parsing logic that natively accept remote triggers from the `autonomic` wrapper.

### 3. The Decoupled Evolution (True Asynchrony)
- [x] **JetStream Event Sourcing:** Durable JetStream event bus (when NATS configured), workflow state bridge, and async sandbox dispatch via `autonomic.execute.*`.

### 4. The Autonomous Evolution (Self-Improvement)
- [x] **VS Code Extension:** `vscode-dag/` sidebar + webview for `*.dag.json` execution graphs under `~/.autonomic/logs/spine/executions/`. A visualization layer to natively render the `~/.autonomic/logs/` DAG structure visually for developers.
