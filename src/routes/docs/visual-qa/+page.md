---
title: Visual Observability
---

# Visual QA (agent-eyes)

`agent-eyes` provides **observability for visual state** — DOM indexing, capture, and regression checks for agent-driven UI work.

## DOM Indexing

Pixel diffs alone are notoriously brittle. A 1px shift in padding can cause a massive pixel failure even if the UI is semantically identical. 

`agent-eyes` solves this using **DOM Indexing**. When pointed at a URL, it uses headless Playwright to parse the DOM tree and extract a structured index containing element positions, computed styles, text content, and accessibility roles. This semantic tree is stored in the Knowledge Graph, allowing the agent to reason about the UI logically (e.g., "Did the 'Submit' button move?" rather than "Did the red pixels change?").

## Screenshot Diffs & SSIM

For precise visual regression testing, `agent-eyes` captures full-page or element-level screenshots. It uses the Structural Similarity Index (SSIM) algorithm to compare a new screenshot against a stored baseline. 

If the visual diff exceeds a configurable threshold (e.g., > 1% structural change), `agent-eyes` flags the regression and publishes an event to the bus.

## Local VLM Inference

`agent-eyes` integrates a native, localized Vision-Language Model (LLaVA running via Candle). This allows the agent to pass a screenshot into the local model and ask semantic questions, such as:
- "Are there any overlapping text elements?"
- "Does this layout match the provided mockup?"

By running this inference locally, `agent-eyes` avoids the latency, cost, and privacy concerns of sending proprietary UI screenshots to cloud vision APIs.
