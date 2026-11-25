---
title: Known Limits
---

# Known Limits

Honest engineering boundaries and explicit non-goals for `tekmor 2.0.0`.

## Known limits (2.0.0)

- A receipt proves that the allowlisted command exited 0 on this exact code. It does not prove the change is correct: on SWE-bench-Live, 2 of 7 sessions that ended with a passing receipt were accepted by the official grader.
- No outcome benefit has been shown yet. Control and tekmor were each accepted in 4 of 14 graded SWE-bench-Live runs, and on the trap tasks the model already ran the tests unprompted.
- Only Bash commands are gated. Write and Edit tool calls are not.
- `.claude/` and Markdown files are not part of the code hash.
- A session that can read the review key can sign a review.
- The test-removal guard compares the uncommitted change with HEAD, by pattern. A test removed in an earlier commit is not caught.
- The claim check is a pattern match on the last assistant message.
- Hooks embed the absolute path of the binary. Run `tekmor install` again after moving or reinstalling it.
- The published binary is arm64 macOS only.

## What has been measured

- **Mutation testing** (cargo-mutants 27.1.0) of `receipt.rs`, `stop_gate.rs` and `verify.rs`: 305 of 308 viable mutants caught.
- **SWE-bench-Live** (7 tasks × 2 arms × 2 runs, claude-haiku-5-5): control accepted 4 of 14, tekmor 4 of 14—no detectable difference. The stop gate blocked the first attempt to finish without a passing run in 10 of 14 tekmor sessions; 7 ended with a passing receipt, and 2 of those 7 were accepted by the official grader.
- **Regression-trap calibration**: control solved 32 of 36 runs with no tooling, so no main run was made.
