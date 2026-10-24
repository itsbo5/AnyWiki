---
title: Tracking compatibility
description: How game compatibility is organized, discussed, and linked to code contributions.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 tracks title-by-title compatibility openly through GitHub Discussions rather than an internal closed database.

## Game bring-up discussions

Compatibility reports, startup logs, and workarounds are documented in the [Game bring-up discussions](https://github.com/boykopovar/AnyPS5/discussions/categories/game-bring-up).

- **One thread per title**: Each PlayStation 5 title has a dedicated discussion thread titled with its Title ID and official game name (for example, `PPSA01325 - Title Name`).
- **Community testing**: Testers post hardware specifications, log outputs, screenshots, and reproducibility steps for observed stops.
- **Pull request linking**: Active bring-up threads list open pull requests that implement required functions or resolve pipeline stops for that title.

## Linking pull requests to titles

When a pull request resolves a stop or missing export for a specific game:

1. The author notes the title ID and discussion number in the pull request checklist:
   ```text
   Unblocks: PPSA01325 #3232
   ```
2. Reviewers verify the implementation against console behavior or hardware oracle tests.
3. Upon review, the pull request receives the `unblocks title` label.
4. When merged, the bring-up discussion is updated with the resolution.

## Performance tracking

When reporting performance regressions or speed improvements, testing relies on deterministic trace summaries rather than subjective impressions.

Run the title with benchmarking enabled:

```sh
APS5_TRACE_SUMMARY_EVERY=30 APS5_TRACE_BENCH=1 ./app.elf
```

Every 30 seconds, the runtime writes an execution summary to `aps5-summary.jsonl` and saves `aps5-bench-<commit>-<pid>.json.gz`. These files record frame presentation deltas, CPU model, GPU vendor, and driver versions without collecting game assets.
