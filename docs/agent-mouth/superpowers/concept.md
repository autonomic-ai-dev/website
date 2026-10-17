# agent-mouth: Core Architecture & Concept

agent-mouth sends webhook notifications and listens for events.

## 1. Webhook Sender (v0.1.0)

Sends JSON payloads via HTTP POST using reqwest. Payload includes message text, source, and timestamp.

```yaml
config:
  notifications:
    default_webhook: ""  # set your Slack/Discord webhook URL
```

## Roadmap

| Feature | Status |
|---------|--------|
| Webhook sender | ✅ v0.1.0 |
| CLI with send/serve/status | ✅ v0.1.0 |
| Event listener (NATS) | 🔜 Future |
| Local LLM summarization | 🔜 Future |
| Slack/Discord interactive blocks | 🔜 Future |
