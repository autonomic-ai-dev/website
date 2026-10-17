# agent-nerves: Core Architecture & Concept

agent-nerves provides NATS connectivity for the autonomic-ai-dev ecosystem.

## 1. NATS Client (v0.1.0)

Connects to a NATS server via `async-nats`. The `ping` command tests connectivity and returns server ID.

### Configuration (`~/.config/agent-nerves/config.yaml`)

```yaml
nats:
  url: "nats://localhost:4222"
logging:
  level: info
```

## Roadmap

| Feature | Status |
|---------|--------|
| NATS connectivity test | ✅ v0.1.0 |
| CLI with serve/ping/status | ✅ v0.1.0 |
| Embedded NATS broker | 🔜 Future |
| JetStream persistence | 🔜 Future |
| Multi-node clustering | 🔜 Future |
