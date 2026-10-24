---
title: Pull request checklist
description: Complete checklist and explanation of the AnyPS5 pull request template.
---

Every pull request submitted to AnyPS5 must use the standard pull request template. Reviewers use this checklist to verify compliance with architectural standards, testing rigor, and contribution rules.

## Template structure

When opening a pull request on GitHub, the description field is prepopulated with the repository template from `.github/pull_request_template.md`:

```markdown
### What

### Tested

### Checklist
- [ ] Based on current `main`; no other open PR implements the same functions
- [ ] One topic per PR; follow-ups go in a new PR
- [ ] No comments in code except technical debt
- [ ] Unimplemented paths throw (`NotImplemented_nid_no_patch`); silent stubs are listed under Silent stubs in their library's technical debt file
- [ ] No notes, investigation `.md` files or images added to the repository (attach them to this PR)
- [ ] New third-party code is a submodule built from source
- [ ] Generic behaviour, not specific to one title
- [ ] Depends on: <!-- #PR, or none -->
- [ ] Fixes: <!-- issue it closes as Fixes #N, or none -->
- [ ] Unblocks: <!-- title ID and Game bring-up discussion, e.g. PPSA01325 #3232, or none -->
- [ ] GPUs tested: <!-- for AGC, shader recompiler or VideoOut changes: vendor, model, driver and OS of each GPU the GPU tests ran on; otherwise n/a -->
- [ ] AI-assisted: <!-- yes / no -->
```

Do not delete or reorder any lines from the template. Fill in every field before submitting.

## Section explanations

### What

Provide a brief explanation of the technical change. State which functions were added, which bugs were fixed, or which subsystem behavior was updated. Refer to architectural components by their exact names, such as `libSceAgcDriver` or `core/relinker`.

### Tested

Describe how the changes were verified. Valid formats include:

- The operating system, specific title ID, or homebrew sample tested, along with observed runtime output.
- For non-executable or infrastructure changes, `Not tested` is valid if followed by an explanation of why automated tests or compilation were sufficient.
- For performance changes, paste the summary lines of both `main` and your branch from `tools/trace_digest.py` taken on the same machine and test scene, and attach the captured trace archives.

### Checklist items

#### Current branch base

Ensure your topic branch is rebased on top of the latest `main`. Check `tools/pr_overlap.py` to confirm no other open pull request implements or modifies the same function exports.

#### Single topic scope

Keep each pull request focused on one specific goal. Combine related functions within the same library, but keep unrelated subsystem changes in separate pull requests. Follow-up enhancements belong in a new pull request after the current one merges.

#### Code comments

Verify that you added no inline explanatory comments in C++ source files. Reviewers will check this using `tools/check_conventions.py`. Document technical debt and open questions in `docs/dev/debt/` instead.

#### Unimplemented paths

Functions that cannot be fully implemented must call `NotImplemented_nid_no_patch(__func__)`. Never fabricate success return codes (such as returning 0 when underlying state is unhandled). Silent stubs must be documented under the Silent stubs heading in `docs/dev/debt/<library>.md`.

#### Repository cleanliness

Do not commit investigation notes, raw disassembly dumps, log files, or screenshot images into the Git tree. Upload screenshots and logs directly to the GitHub pull request interface.

#### Third-party submodules

Any external dependency must be added as a Git submodule under `3rdparty/` and configured to build from source via CMake.

#### Generic platform behavior

Verify that your logic does not inspect title IDs, check executable hashes, or implement hardcoded branches tailored to a single game title.

#### Metadata fields

- **Depends on**: Specify `#<PR>` if this pull request requires another open pull request to merge first. If there are no prerequisites, write `none`.
- **Fixes**: Reference the issue closed by this change in the format `Fixes #<issue>`. If no issue is being closed, write `none`.
- **Unblocks**: Provide the title ID and link to the relevant Game bring-up discussion if this change unblocks a specific title (for example, `PPSA01325 #3232`). Write `none` if not applicable. Reviewers prioritize reviewing pull requests that unblock tracked titles.
- **GPUs tested**: If changing AGC graphics, shader recompilation, or VideoOut display logic, list each physical GPU tested, including vendor, model, driver version, and host operating system. Write `n/a` for relinker or audio changes.
- **AI-assisted**: Declare `yes` or `no`. You remain fully responsible for the correctness and architectural integrity of every line of code submitted.
