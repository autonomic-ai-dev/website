---
title: agent-eyes CLI Reference
---

> **Out of scope.** This page describes a component from the earlier eleven-organ design. Autonomic AI currently consists of agent-brain and agent-spine only. See [Architecture](/docs/architecture).

# `agent-eyes` CLI Reference

`agent-eyes` provides spatial DOM indexing, visual regression testing, and multimodal observability for the Autonomic ecosystem. It drives headless Chrome instances to capture screenshots, performs pixel-level and Structural Similarity (SSIM) image diffing, and queries local Vision-Language Models (VLM).

---

## Synopsis

```bash
agent-eyes [OPTIONS] <COMMAND>
```

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Print command help. |
| `--version` | `-V` | Boolean | Print installed `agent-eyes` version. |
| `--progress` | — | `auto\|plain\|quiet` | Output styling mode. |

---

## Commands

### `capture`

Capture a high-resolution screenshot of a target webpage or local development server.

```bash
agent-eyes capture [OPTIONS] <URL>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `URL` | String | Target web URL (e.g., `http://localhost:3000/docs`). |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--output` | `-o` | Path | `screenshot.png` | Output filesystem path for the captured PNG. |

#### Examples

```bash
# Capture homepage screenshot
agent-eyes capture http://localhost:5173/ -o ./docs/preview.png

# Capture full-page screenshot of documentation
agent-eyes capture http://localhost:5173/docs -o ./docs/fullpage.png

# Capture specific UI element or selector preview
agent-eyes capture http://localhost:5173/usage -o ./docs/usage-card.png
```

---

### `diff`

Compare two screenshots using pixel-by-pixel SSIM diffing to highlight visual regressions.

```bash
agent-eyes diff [OPTIONS] <REFERENCE> <COMPARISON>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `REFERENCE` | Path | Golden baseline image path. |
| `COMPARISON` | Path | Newly rendered test image path. |

#### Options

| Flag | Short | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `--output` | `-o` | Path | `diff.png` | Output path for highlighted red-overlay diff image. |

---

### `verify`

Verify a target URL against a stored visual baseline before generating fine-tuning dataset pairs.

```bash
agent-eyes verify [OPTIONS] <TARGET>
```

#### Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `TARGET` | String | Target URL or local server address. |

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--baseline` | Path | `None` | Path to golden baseline image. |
| `--threshold` | Float | `1.0` | Maximum allowable pixel difference percentage before failing. |
| `--update-baseline` | Boolean | `false` | Overwrite stored baseline with current capture if verified. |

---

### `describe`

Extract structural DOM elements, interactive bounding boxes, and accessibility trees from a webpage.

```bash
agent-eyes describe <TARGET>
```

---

### `dom`

Spatial DOM indexing and search over local SQLite database (`~/.autonomic/memory/eyes_dom.db`).

```bash
agent-eyes dom <SUBCOMMAND>
```

#### Subcommands

- `index <url>`: Crawl page and store indexed DOM elements.
- `search <query>`: Semantic search for UI components across stored DOM graphs.
- `dump`: Export indexed DOM nodes as structured JSON.

---

### `serve`

Start the agent-eyes HTTP daemon and MCP server.

```bash
agent-eyes serve
```

---

### `serve-mcp`

Start the Model Context Protocol (MCP) server over standard I/O (stdio).

```bash
agent-eyes serve-mcp
```

Exposes `eyes_describe_dom`, `eyes_diff_screenshots`, and `eyes_vlm_caption` tools to agent supervisors.
