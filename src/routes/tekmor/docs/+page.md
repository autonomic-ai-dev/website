---
title: tekmor documentation
---

# tekmor documentation

tekmor runs the checks your project allows, records each result against the commit and code it ran on, and writes a receipt. A claim that the code passes needs a PASSED receipt for the current code. tekmor makes no model calls.

## Start here

- Install with `brew install autonomic-ai-dev/tap/tekmor`, then run `tekmor install`.
- Create an allowlist with `tekmor verify init`.
- Run an allowed check with `tekmor verify -- <cmd>` and read the receipt with `tekmor verify receipt`.

## Reference

- [Installation](/docs/installation) covers Homebrew, crates.io and building from source.
- [CLI](/docs/cli) lists every command.
- [Verification and receipts](/docs/verification) explains the verdicts and what counts as proof.
- [Known limits](/docs/limits) lists what tekmor does not do yet.
