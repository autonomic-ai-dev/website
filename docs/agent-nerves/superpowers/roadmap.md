# agent-nerves Roadmap

## ✅ Completed Features
- **Embedded Broker:** Zero-config local NATS wrapper.
- **Asynchronous Decoupling:** Omnichannel event bus supporting HTTP APIs.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Stream Tailer:** `agent-nerves stream tail` tails the AUTONOMIC JetStream with `--from new|all`, falling back to core NATS subscribe.

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Store NATS JetStream persistence logs securely inside `~/.autonomic/broker/`.

### 3. The Decoupled Evolution (True Asynchrony)
- [x] **Durable State Recovery:** Ensure AUTONOMIC JetStream stream with file storage, explicit ACK consumers, AckWait redelivery, and Msg-Id dedup.

### v1.0.0 Ecosystem Convergence (Parity with `agent-brain`)
- [ ] **Raft Consensus Cluster:** Seamlessly cluster over a Wireguard mesh to survive network partitions.
- [ ] **WASM Message Filtering:** Allow developers to inject WASM plugins directly into the broker to filter/mutate events at 100k msgs/sec.
