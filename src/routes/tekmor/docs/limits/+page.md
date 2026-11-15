---
title: Known Limits
---

# Known Limits

Honest engineering boundaries and explicit non-goals for `tekmor 1.0.0`.

## 1. Scope of Proof

A receipt proves that the recorded command ran and returned exit code 0 for the exact commit and code tree on disk. It does **not** prove that the test suite provides complete semantic coverage of your changes.

If your project test command only runs unit tests, and your change introduces a break in an untested subsystem, `tekmor` will faithfully report `PASSED` because the executed command exited 0. Teams must ensure their allowlisted verification command covers their required validation surface.

## 2. Claim Detection Mechanism

`tekmor stop-gate` parses the text of the final assistant turn to determine if the agent is claiming that tests pass or work is completed.
- The claim check relies on deterministic regex pattern matching against natural language completions.
- It is possible for an agent to phrase a claim in a novel way that evades the pattern matcher, though standard completions ("All tests pass", "Task complete", "Verified working") are strictly caught.

## 3. Platform Architecture

The official Homebrew tap provides pre-built binaries for **macOS Apple Silicon (arm64)**. Linux and Intel macOS users must build from source using `cargo install tekmor`.

## 4. Keychain & Review Security

When code reviews are recorded with `tekmor verify review`, the review signature is protected via macOS Keychain credentials. The Keychain protects the key from arbitrary shell processes, but a tool call with raw filesystem read access inside the user's home directory could potentially access local configuration.

## 5. Backward Compatibility of Historical Hashes

Receipts recorded prior to version `1.0.0` may not validate under `1.0.0` due to tree hash algorithm refinements. Run `tekmor verify -- <cmd>` on updated repositories to generate fresh, version-compatible receipts.
