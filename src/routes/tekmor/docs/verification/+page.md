---
title: Verification and receipts
---

# Verification and receipts

A receipt says whether a command passed for a specific commit and a specific state of the code.

## Verdicts

- **PASSED**: an allowlisted run exited 0 on the current code, and it is not flaky.
- **FAILED**: the most recent relevant run exited non-zero.
- **NOT VERIFIED**: there is no run for the current code, or a review the project requires is missing.

Only PASSED counts as proof.

## What "the current code" means

tekmor hashes every file that counts toward the tree. Documentation files (`.md` and `.rst`) are not counted, and neither are `.verify/artifacts`, `.verify/features`, `.verify/knowledge-base` or `.claude/`. Every other file counts, including `.verify/verify.toml`. Editing any counted file makes an earlier PASSED stale, and the receipt says NOT VERIFIED until you run the check again.

## Flaky commands

If repeated runs of one command on one tree disagree, the command is flaky. tekmor leaves flaky commands out of the receipt and the stop gate, so a flaky pass does not count.

## Claims

The stop gate reads the last assistant message of a turn. If it says tests pass and there is no PASSED receipt for the current code, the turn is blocked. The check is a pattern match on the message text, so it can miss a claim worded differently.
