---
title: Execution & Actuation
---

# Execution (agent-muscle)

In an AI system, "thinking" is safe, but "acting" is dangerous. The `agent-muscle` organ is the dedicated execution actuator for the Autonomic ecosystem. It is responsible for translating the decisions made by the `agent-brain` and `agent-spine` into real-world state changes on the host machine.

## Structured Contracts

Traditional AI agents often run raw bash commands and attempt to parse the unstructured `stdout` using brittle regular expressions. `agent-muscle` rejects this approach.

Instead, every execution request sent to `agent-muscle` must specify a **JSON schema contract**. When `agent-muscle` runs a command (e.g., `cargo test --message-format=json`), it captures the output and validates it against the requested schema. If the output does not match the expected structure, the execution is marked as a failure, even if the process exit code was 0.

This strict contract ensures that downstream organs (like `agent-spine` workflows or `agent-eyes` visual QA) receive clean, predictable data payloads rather than unstructured text.

## LoRA Fine-Tuning

Beyond executing shell commands, `agent-muscle` serves as the training actuator. It can orchestrate local LoRA fine-tuning jobs on Apple Silicon (via MLX) or CUDA GPUs (via Candle). 

Before a training run begins, `agent-muscle` validates the training dataset against size constraints and formatting rules, ensuring that malformed data does not waste hours of GPU compute time.

## Remote Actuation

Because `agent-muscle` subscribes to execution requests via the central `agent-nerves` event bus, it doesn't have to run on the same machine as the rest of the ecosystem. You can run `agent-brain` locally on your laptop, while `agent-muscle` runs on a high-powered cloud VM, securely receiving encrypted execution payloads over JetStream.
