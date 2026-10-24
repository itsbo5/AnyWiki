---
title: Known technical debt
description: Policies, structure, and tooling for tracking implementation gaps across AnyPS5.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 prohibits explanatory comments, todo markers, and inline notes in C++ source code. All known gaps, unimplemented parameters, console discrepancies, and silent stubs must be documented in dedicated technical debt files under `docs/dev/debt/`.

## The no-comment rule

The coding standards (`docs/dev/CONVENTIONS.md`) enforce a strict rule against source code comments:

- C++ files allow comments only for `#endif` directives and namespace termination (`} // namespace Relinker`).
- Code must be self-explanatory through naming, strong typing, and structure.
- When an export or subsystem cannot implement complete console behavior, developers record the limitation in `docs/dev/debt/<name>.md`.
- Automated CI scripts (`tools/check_conventions.py`) scan pull requests and reject code containing unauthorized comments.

## Technical debt file structure

Technical debt files are organized by subsystem under `docs/dev/debt/`:

- `docs/dev/debt/<library>.md`: Technical debt for `core/libs/prx/<library>/` (for example, `libkernel.md`, `libc.md`, `libSceAgcDriver.md`).
- `docs/dev/debt/relinker.md`: Limitations and gaps in the relinker pipeline.
- `docs/dev/debt/shader.md`: Gaps in shader decoding, operand formats, or instruction variants.
- `docs/dev/TechnicalDebt.md`: Master index containing cross-subsystem items.

### Entry formatting rules

Every technical debt entry follows strict formatting rules:

1. State the gap first: what differs from console hardware, what is unverified, or what inputs throw.
2. Describe implemented behavior only to the extent needed to explain the gap. Do not write promotional text or restate obvious code.
3. Silent stubs (functions that return success without implementing functionality to unblock UI initialization) must be explicitly listed under a `### Silent stubs` heading in that library's debt file.
4. When a pull request resolves a gap, the author removes the entry or shrinks it to cover only what remains open. Do not rewrite resolved debt entries into changelog narratives.

## Technical debt tooling

The repository provides Python tools to manage and split technical debt files during development and rebasing:

- **Splitting debt files**:
  ```sh
  python3 tools/debt_split.py split
  ```
  Moves entries from the central index `docs/dev/TechnicalDebt.md` into their respective files in `docs/dev/debt/`.

- **Resolving rebase conflicts**:
  ```sh
  python3 tools/debt_split.py resolve
  ```
  Runs during a stopped git rebase to reconcile added, edited, and removed technical debt entries cleanly.
