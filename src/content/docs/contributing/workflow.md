---
title: Contributing workflow
description: Step-by-step contribution process from repository fork to merged pull request.
---

import { Steps, Aside } from '@astrojs/starlight/components';

AnyPS5 welcomes community contributions. The project follows an automated, rules-based contribution pipeline.

## Branch and pull request rules

- **One topic per branch**: Create a dedicated topic branch based on current `origin/main`. Do not group unrelated bug fixes or features into a single branch.
- **Open pull request limits**: Open pull requests per author are limited according to merged contribution count:
  - 1 open pull request for authors with 0 merged pull requests.
  - Up to 20 open pull requests for authors with at least 1 merged pull request.
  - Unlimited once 20 pull requests are merged into `main`.
  Pull requests opened in excess of this limit are closed automatically by automation.
- **Rebasing**: Maintain your branch rebased against `origin/main`. If a merge conflict occurs and remains inactive for 7 days, automation marks the pull request as `stale`.

## Pre-submission checks

<Steps>

1. ### Verify overlapping exports

   Run `tools/pr_overlap.py` to ensure another open pull request is not already implementing the same functions or touching identical code blocks:

   ```sh
   python3 tools/pr_overlap.py --branch your-branch-name
   ```

   If overlap exists, coordinate with the author and declare the dependency in your pull request description using `Depends on: #<number>`.

2. ### Check coding conventions

   Run `tools/check_conventions.py` locally before pushing:

   ```sh
   python3 tools/check_conventions.py --base origin/main
   ```

   Ensure no unauthorized comments exist in C++ files and that commit subjects follow Conventional Commits.

3. ### Run tests

   Execute CTest to confirm all registered unit and integration tests pass within the 30-second budget:

   ```sh
   ctest --test-dir build --output-on-failure
   ```

</Steps>

## CI execution model

The continuous integration system uses a tiered execution model to conserve runner capacity:

- **Conventions check**: Runs automatically for every pull request, including first-time contributors. It inspects Git objects without compiling or running code.
- **Relinker matrix**: Runs automatically on Linux, Windows, and macOS when a pull request touches files affecting the relinker, provided the author has at least one previous commit merged in `main`.
- **Full runtime builds**: Full builds and Vulkan tests run on Linux and Windows runners only when a repository collaborator triggers the build workflow:
  ```sh
  gh workflow run build.yml --repo boykopovar/AnyPS5 --ref main --field pr=1234
  ```

## AI-assisted contributions policy

Contributors must declare whether AI assistance was used during development:

- Fill out the `AI-assisted` field in the pull request template with `yes` or `no`.
- The human author remains responsible for every line of code submitted.
- Submissions must adhere strictly to the no-comment rule, Conventional Commits, and accurate exception throwing. Fabricated return values or hallucinated API parameters will result in immediate rejection.
