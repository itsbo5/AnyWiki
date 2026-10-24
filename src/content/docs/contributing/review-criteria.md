---
title: Review criteria
description: Standards and review guidelines applied to pull requests in AnyPS5.
---

Reviewers on AnyPS5 maintain strict standards regarding correctness, performance, and codebase hygiene. Every pull request undergoes both automated convention checks and peer inspection before merge. Understanding these standards helps you get your changes reviewed quickly and merged without repeated revisions.

## Core review standards

### General behavior over title-specific hacks

AnyPS5 does not accept hardcoded workarounds for individual games. Functions must implement the general specification expected across the platform:

- Never special-case a title ID, executable hash, specific memory offset, or magic return value seen in a single game trace.
- If the complete behavior of an export or system call is unknown, implement only what can be verified and call `NotImplemented_nid_no_patch(__func__)` for unhandled branches.
- Record any unverified assumptions or partial implementations in the corresponding debt file under `docs/dev/debt/<library>.md`.

### Explicit failures instead of silent fallbacks

The runtime fails fast to prevent hidden corruption:

- Missing imports must fail at process startup. Reviewers reject pull requests that introduce fallback stubs that pretend an unavailable symbol succeeded.
- Silent stubs that return zero or a dummy structure are permitted only when they unblock a game and strictly affect user interface elements (such as trophy notification popups or telemetry uploads).
- Any silent stub must be explicitly cataloged under the Silent stubs section in the technical debt file of that library.

### Clean separation of bundled modules

PlayStation 5 titles bundle their own runtime middleware inside `sce_module/`, including audio middleware, font rendering engines, and game engine helper libraries.

- Do not implement host equivalents for libraries that titles ship themselves. The relinker converts and links the title's bundled ELF module.
- Host implementations in `core/libs/prx` are reserved for system libraries that interact with kernel objects, display hardware, or system services.

## Automated convention checks

The continuous integration pipeline runs `tools/check_conventions.py` against every pull request. A pull request that breaks convention checks cannot be merged.

### The comment rule

Source files in `core/` and `tools/` must contain no inline comments. The only allowed comments in C++ source files are:

- `#endif` annotations indicating the corresponding preprocessor conditional.
- Closing namespace annotations (for example, `} // namespace AnyPS5::Relinker`).

All explanations of architecture, reverse engineering findings, and known limitations must be recorded in the documentation directory (`docs/dev/debt/`) rather than inline comments.

### Commit and title format

All commit messages and pull request titles must follow the Conventional Commits specification:

- `feat(<component>): <imperative summary>`
- `fix(<component>): <imperative summary>`
- `test(<component>): <imperative summary>`
- `docs(<component>): <imperative summary>`

Capitalized descriptions, vague messages, or missing component scopes trigger an immediate review block.

## Specialized domain requirements

### Shader recompiler and graphics changes

Pull requests that touch `core/shader/recompiler`, `core/libs/prx/libSceAgcDriver`, or `core/libs/prx/libSceVideoOut` require hardware verification:

1. **Hardware grounding**: State whether instruction semantics were measured directly on AMD hardware (such as RDNA2 or RDNA3 silicon using the hardware oracle) or derived from public compiler sources (such as Mesa ACO, LLVM AMDGPU, or the official AMD ISA manual).
2. **Vulkan validation layer clean run**: Run tests with `VK_INSTANCE_LAYERS=VK_LAYER_KHRONOS_validation`, `ANYPS5_REQUIRE_VULKAN=1`, and `ANYPS5_NO_SHADER_CACHE=1`. The run must produce zero new `VUID-` validation errors compared to the `main` branch.
3. **GPU hardware list**: Fill the `GPUs tested` row in the pull request template with the vendor, model, driver version, and host operating system. CI runs GPU tests only on software lavapipe; reviewers require hardware confirmation before merging.

### Performance claims

Pull requests titled with `perf` or claiming execution speedups must supply reproducible numbers:

- Run `tools/trace_digest.py` on both the tip of `main` and your pull request branch on the same physical machine and test scene.
- Include the summary output lines in the pull request description.
- Attach the captured trace files to the pull request for verification.

### System dependencies and third-party code

All external dependencies must be integrated as Git submodules located under `3rdparty/` and compiled directly from source through CMake.

- Never bundle third-party source files directly into the repository tree.
- Never use `find_package` for core libraries in default builds.
- System dependencies are permitted only when the user explicitly passes `-DANYPS5_USE_SYSTEM_DEPS=ON` during configuration.

## Pull request lifecycle and review etiquette

### Concurrency limits

To maintain review bandwidth, the repository enforces strict limits on concurrent open pull requests per contributor:

- Contributors with zero merged pull requests may have exactly 1 open pull request at a time.
- Contributors with at least 1 merged pull request may have up to 20 open pull requests.
- Additional pull requests opened beyond these limits are automatically closed by the repository bot until earlier ones resolve.

### Overlapping work

Before starting work on a function, check existing pull requests using `tools/pr_overlap.py`. If another contributor has an open pull request modifying the same symbols, coordinate with them and declare the dependency using `Depends on: #<PR>` in your description.
