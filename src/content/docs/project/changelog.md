---
title: Milestones and changelog
description: Historical milestones and recent development progress in AnyPS5 grouped by subsystem.
---

This changelog records technical milestones across the AnyPS5 repository derived from merged pull requests. Pull request links direct to the upstream repository discussions and code reviews.

## Relinker and binary translation

Recent development in the relinker focused on binary rewriting precision, macOS Rosetta compatibility, and section layout validation.

| Pull request | Description |
| :--- | :--- |
| [#7822](https://github.com/boykopovar/AnyPS5/pull/7822) | Refuse truncated branch rewrites when binary relocations overflow target ranges. |
| [#7837](https://github.com/boykopovar/AnyPS5/pull/7837) | Add regression test suite for embedded code data interleaved with executable text. |
| [#7918](https://github.com/boykopovar/AnyPS5/pull/7918) | Correct `xsaveopt` translation semantics on macOS Rosetta environments. |
| [#8142](https://github.com/boykopovar/AnyPS5/pull/8142) | Correct masked memory store translation on macOS Rosetta x86-64 runners. |
| [#9518](https://github.com/boykopovar/AnyPS5/pull/9518) | Support non-ASCII and UTF-8 path handling in relinker integration test runners. |
| [#10241](https://github.com/boykopovar/AnyPS5/pull/10241) | Fix locale-dependent floating-point formatting in registry offset generation. |
| [#10341](https://github.com/boykopovar/AnyPS5/pull/10341) | Validate program header count limits during ELF parsing. |
| [#10342](https://github.com/boykopovar/AnyPS5/pull/10342) | Ensure global offset table alignment adheres to System V ABI requirements. |

## AGC graphics and shader recompiler

Graphics development centers on AMD RDNA2 shader translation to SPIR-V, descriptor management, and Vulkan presentation synchronization.

| Pull request | Description |
| :--- | :--- |
| [#7992](https://github.com/boykopovar/AnyPS5/pull/7992) | Handle GPU idle state result deadlines in command buffer completion callbacks. |
| [#8318](https://github.com/boykopovar/AnyPS5/pull/8318) | Synchronize semaphore memory layouts with PS5 firmware specifications. |
| [#8380](https://github.com/boykopovar/AnyPS5/pull/8380) | Introduce budgeted host imports for graphics memory management. |
| [#8944](https://github.com/boykopovar/AnyPS5/pull/8944) | Declare missing AGC graphics pipeline exports and validation stubs. |
| [#8969](https://github.com/boykopovar/AnyPS5/pull/8969) | Clamp array window view bounds in texture image view descriptors. |
| [#8978](https://github.com/boykopovar/AnyPS5/pull/8978) | Support rectangle list corner coordinates in SPIR-V 1.3 output. |
| [#9212](https://github.com/boykopovar/AnyPS5/pull/9212) | Support Neo shader workload configurations and register allocations. |
| [#9856](https://github.com/boykopovar/AnyPS5/pull/9856) | Execute `MEM_SEMAPHORE` signal and wait packets within the command stream. |

## Audio subsystem

The audio subsystem reimplements `libSceAudioOut` and `libSceNgs2` using SDL audio streams and spatial mixing.

| Pull request | Description |
| :--- | :--- |
| [#8525](https://github.com/boykopovar/AnyPS5/pull/8525) | Implement audio output mastering volume controls and channel downmixing. |
| [#10347](https://github.com/boykopovar/AnyPS5/pull/10347) | Accept reverb voices with differing input and output channel configurations in NGS2. |

## Kernel and standard C library

System library development focuses on POSIX conformance, memory mapping, and thread synchronization.

| Pull request | Description |
| :--- | :--- |
| [#7653](https://github.com/boykopovar/AnyPS5/pull/7653) | Re-add kevent timer descriptors in libkernel event loops. |
| [#7838](https://github.com/boykopovar/AnyPS5/pull/7838) | Allow thread stack reuse on Linux platforms to reduce virtual memory footprint. |
| [#8701](https://github.com/boykopovar/AnyPS5/pull/8701) | Implement `sys_openat` kernel syscall wrapper for directory-relative file access. |
| [#8979](https://github.com/boykopovar/AnyPS5/pull/8979) | Seed pseudorandom number generators using host cryptographic entropy. |
| [#8994](https://github.com/boykopovar/AnyPS5/pull/8994) | Implement libc filesystem path resolution primitives. |
| [#9074](https://github.com/boykopovar/AnyPS5/pull/9074) | Defer POSIX signal delivery during critical section execution in libkernel. |
| [#9845](https://github.com/boykopovar/AnyPS5/pull/9845) | Add wide character `num_put` vtable implementations in libc++. |
| [#10110](https://github.com/boykopovar/AnyPS5/pull/10110) | Implement system extended version queries and trace memory queries in libkernel. |
| [#10230](https://github.com/boykopovar/AnyPS5/pull/10230) | Return accurate module information from address queries based on console measurements. |

## Developer tools and test infrastructure

Tooling improvements automate convention verification, test isolation, and dependency tracking.

| Pull request | Description |
| :--- | :--- |
| [#8377](https://github.com/boykopovar/AnyPS5/pull/8377) | Generate automated system library implementation progress reports. |
| [#8673](https://github.com/boykopovar/AnyPS5/pull/8673) | Enable guarded regression test execution on native Windows runners. |
| [#8970](https://github.com/boykopovar/AnyPS5/pull/8970) | Detect symbol export overlaps against current `main` branch before PR submission. |
| [#9836](https://github.com/boykopovar/AnyPS5/pull/9836) | Eliminate redundant CI runs for documentation-only changes. |
| [#10217](https://github.com/boykopovar/AnyPS5/pull/10217) | Reconfigure standard streams with backslash replacement for UTF-8 resilience. |
