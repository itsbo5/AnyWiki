---
title: Running tests and checks
description: Test suites, execution limits, and static convention checkers in the AnyPS5 repository.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 provides automated testing through CTest and custom Python verification tools in `tools/`. All tests must pass before pull requests are eligible for merge.

## Running unit and regression tests

When configuring with `-DBUILD_TESTING=ON`, CMake registers all C++ unit tests, Python integration tests, and static convention checks.

Execute the test suite from the build directory:

```sh
ctest --test-dir build --output-on-failure
```

To run a focused subset of tests matching a regular expression:

```sh
ctest --test-dir build -R shader -V
```

### 30-second execution budget

Every test registered in CTest must complete within 30 seconds on CI runners (Vulkan tests included, which run on lavapipe on Linux runners).

Tests that exceed 30 seconds trigger warnings on pull requests. Because CTest executes tests concurrently, slow tests compete for CPU resources and cause intermittent timeouts. If a test approaches 30 seconds, split or shrink the test case rather than increasing timeout properties.

## Coding conventions check

The automated conventions checker verifies that changes conform to the project's formatting and comment policies:

```sh
python3 tools/check_conventions.py --base origin/main
```

The checker enforces:
- Absence of comments in C++ source files (except `#endif` and namespace ends).
- Valid Conventional Commits on commit subjects.
- Proper placement of technical debt entries in `docs/dev/debt/`.
- Valid UTF-8 encoding without byte-order marks (BOM) on source files.

The check runs automatically on every pull request, reading Git objects directly without executing untrusted pull request code.

## Pull request overlap check

Before opening or updating a pull request, check for overlapping edits against other open pull requests:

```sh
python3 tools/pr_overlap.py --branch your-branch-name
```

If another pull request modifies the same export functions or lines of code, the tool reports the collision. Coordinate with the author and declare dependency using `Depends on: #<number>` in your pull request description.

## GPU and Vulkan validation testing

Modifications to the AGC driver (`core/libs/prx/libSceAgcDriver`), the shader recompiler (`core/shader/recompiler`), or VideoOut (`core/libs/prx/libSceVideoOut`) require running Vulkan validation layers:

```sh
env VK_INSTANCE_LAYERS=VK_LAYER_KHRONOS_validation \
    ANYPS5_NO_SHADER_CACHE=1 \
    ANYPS5_REQUIRE_VULKAN=1 \
    ctest --test-dir build -R "agc|shader" -V
```

Confirm that:
1. The log does not report `was not found but was requested by env var VK_INSTANCE_LAYERS`.
2. The run introduces no new `VUID-` validation errors compared to the `main` branch.
