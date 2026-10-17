# agent-muscle: Core Architecture & Concept

agent-muscle executes shell commands on workers and streams results back.

## 1. Command Executor (v0.1.0)

Runs commands via `tokio::process::Command`. Captures stdout, stderr, exit code, and duration. Returns structured JSON output.

```yaml
config:
  worker:
    max_concurrent_jobs: 4
```

## Roadmap

| Feature | Status |
|---------|--------|
| Command execution | ✅ v0.1.0 |
| CLI with run/serve/status | ✅ v0.1.0 |
| NATS queue worker | 🔜 Future |
| Kubernetes ephemeral testing | 🔜 Future |
| MLX/HuggingFace fine-tuning | 🔜 Future |
