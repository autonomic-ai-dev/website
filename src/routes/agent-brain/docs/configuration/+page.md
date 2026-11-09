---
title: agent-brain configuration
---

# agent-brain configuration

agent-brain reads its settings from `config.yaml` in its home directory. Keys you leave out use their built-in defaults.

## Where the file is

| Item | Location | Override |
| :--- | :--- | :--- |
| Home directory | `~/.autonomic/memory/` | `AGENT_BRAIN_HOME` |
| Settings file | `config.yaml` in the home directory | `agent-brain config init` writes the defaults |

Run `agent-brain config show` to print the file path and the active values.

## Main sections

The sections below are the ones `config show` prints. Each one is read at startup or when the feature runs.

```yaml
auto_update:
  enabled: false          # built-in default; set true to check for new releases
  interval_hours: 24
  packages:
    enabled: true
    names: []
  mcp:
    enabled: true
    repo: autonomic-ai-dev/agent-brain
sync:
  git:
    remote: ''            # empty: git sync is off
    branch: main
    include_vectors: false
    auto_push: false
  cloud:
    enabled: false        # encrypted cloud sync; off until you enable it
    provider: s3
    encrypt: true
    encryption_key_env: AGENT_BRAIN_SYNC_KEY
```

- **`auto_update`** controls the background release check. The default is `enabled: false`. Turn it on in your own config only if you want agent-brain to fetch updates.
- **`sync.git`** keeps memory in a git repository you choose. `auto_push` is off by default.
- **`sync.cloud`** sends an encrypted bundle to S3-compatible storage or a local folder. It is off until you enable it.

## Network use

agent-brain does not make model calls. The features that use the network are the ones listed above, plus `learn_from_url` and the package and registry commands, which run only when you call them.

## Changing a value

Edit `config.yaml`, then run `agent-brain doctor` to check the install. Keys the binary does not recognise are reported by `doctor`.
