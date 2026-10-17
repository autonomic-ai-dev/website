# agent-eyes: Core Architecture & Concept

agent-eyes provides URL capture and pixel diffing for visual QA.

## 1. URL Capture (v0.1.0)

Downloads a URL to a local file via reqwest. Used for quick page snapshots.

## 2. Pixel Diff (v0.1.0)

Compares two images pixel by pixel using the `image` crate. Highlights differing pixels in red. Reports diff percentage.

## Roadmap

| Feature | Status |
|---------|--------|
| URL capture | ✅ v0.1.0 |
| Pixel diff | ✅ v0.1.0 |
| Playwright headless screenshots | 🔜 Future |
| Telemetry dashboard | 🔜 Future |
| Local VLM integration | 🔜 Future |
