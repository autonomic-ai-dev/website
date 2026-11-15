---
title: Known limits
---

# Known limits

- A session that can read the review key can sign a review. The macOS Keychain blocks the shell path to the key, not the Read tool.
- The claim check is a pattern match on the last assistant message. It can miss a claim worded differently and can flag a sentence that is true.
- Runs recorded before 1.0.0 are not valid receipts after the upgrade, because the tree hash covers more files. Run the checks again.
- The migration was tested on one real version-29 database and on in-memory databases. Other databases are untested.
- Hooks record the absolute path of the binary. Moving or rebuilding the binary can break them until `tekmor install` runs again.
- The 1.0.0 published binary is for arm64 macOS only.
- The harness pilot showed the stop gate changed the agent's documentation edits and roughly doubled its turns. It did not show a proof benefit. The results cover two toy tasks with three repetitions each.
