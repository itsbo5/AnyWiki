# Source mapping

This document maps each documentation page in this wiki to the upstream AnyPS5 files, pull requests, and tests from which it was derived.

Verified against upstream commit `5b65588957f8b2020adb1f264a3d9408c997297f`.

## Getting started

- **Overview** (`getting-started/overview.md`): `README.md`, `core/relinker/main.cpp`, `core/libs/prx/libc/include/general/VabiMacros.hpp`, `CMakeLists.txt`
- **How it works** (`getting-started/how-it-works.md`): `core/relinker/relinker/src/pipeline/Conversion.cpp`, `core/relinker/relinker/src/pipeline/RelinkerPipeline.cpp`, `core/shader/recompiler/Recompiler.cpp`, `core/libs/prx/libc/src/GuestArena.cpp`
- **Platform support** (`getting-started/platform-support.md`): `README.md`, `docs/dev/BUILD.md`, `core/relinker/cli/src/CliArgs.cpp`, `.github/workflows/build.yml`
- **Quick start** (`getting-started/quick-start.md`): `docs/user/USAGE.md`, `core/relinker/main.cpp`
- **FAQ** (`getting-started/faq.md`): `README.md`, `docs/user/USAGE.md`, `docs/dev/ARCHITECTURE.md`

## Install and run

- **Windows** (`install/windows.md`): `docs/dev/BUILD.md`, `setup_winlibs.ps1`, `CMakeLists.txt`, `docs/user/USAGE.md`, PR #8909, PR #8619
- **Linux** (`install/linux.md`): `docs/dev/BUILD.md`, `docs/user/USAGE.md`, `.github/workflows/build.yml`
- **macOS** (`install/macos.md`): `docs/dev/BUILD.md`, `core/relinker/cli/src/CliArgs.cpp`, `CMakeLists.txt`, PR #7953, PR #7706
- **Web converter** (`install/web-converter.md`): `demo/web/app.mjs`, `demo/web/worker.mjs`, `demo/web/archive.mjs`, `demo/web/batch.mjs`, `tools/build_web.py`, `.github/workflows/pages.yml`

## User guide

- **Preparing input** (`user-guide/preparing-input.md`): `docs/user/USAGE.md`, `core/relinker/cli/src/NativeModules.cpp`, `tools/unwrap_self.py`
- **Converting with the relinker** (`user-guide/relinker-cli.md`): `core/relinker/cli/src/CliArgs.cpp`, `core/relinker/main.cpp`, `docs/user/USAGE.md`
- **Runtime layout** (`user-guide/runtime-layout.md`): `docs/user/USAGE.md`, `core/relinker/cli/src/RuntimeLayout.cpp`
- **Input mapping** (`user-guide/input-mapping.md`): `docs/user/INPUT_MAPPING.md`, `core/libs/prx/libScePad/src/PadInput.cpp`, `tools/pad_input.py`, `tools/pad_timeline.py`
- **Troubleshooting** (`user-guide/troubleshooting.md`): `docs/user/USAGE.md`, `core/relinker/main.cpp`, `core/libs/prx/libkernel/System/src/HostCpu.cpp`, `core/libs/prx/libkernel/DirectMemory/Jit.cpp`

## Compatibility

- **Tracking compatibility** (`compatibility/tracking.md`): `README.md`, GitHub Discussions "Game bring-up", `CONTRIBUTING.md`
- **Filing bring-up reports** (`compatibility/bring-up-reports.md`): `CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/`
- **Progress metrics** (`compatibility/progress-metrics.md`): `tools/progress.py`, `tools/progress_history.py`, `README.md`, `.github/workflows/pages-progress.yml`

## Architecture

- **Repository map** (`architecture/repository-map.md`): repository root, `CMakeLists.txt`, `core/`, `3rdparty/`, `tools/`
- **Relinker internals** (`architecture/relinker-internals.md`): `core/relinker/relinker/src/pipeline/Conversion.cpp`, `core/relinker/relinker/src/analysis/`, `core/relinker/elfpatcher/`
- **System libraries** (`architecture/system-libraries.md`): `core/libs/prx/`, `core/libs/prx/libc/include/general/VabiMacros.hpp`, `tools/progress.py`, `tools/nid_names.py`
- **Shader recompiler** (`architecture/shader-recompiler.md`): `core/shader/recompiler/Recompiler.cpp`, `core/shader/recompiler/RdnaDecoder/`, `tools/rdna_isa.txt`
- **Third-party dependencies** (`architecture/third-party.md`): `.gitmodules`, `cmake/SystemDeps.cmake`, `3rdparty/`
- **Technical debt** (`architecture/technical-debt.md`): `docs/dev/TechnicalDebt.md`, `docs/dev/debt/`, `CONTRIBUTING.md`

## Development

- **Building from source** (`dev/building.md`): `docs/dev/BUILD.md`, `CMakeLists.txt`
- **Running tests and checks** (`dev/tests-and-checks.md`): `CMakeLists.txt`, `CONTRIBUTING.md`, `tools/check_conventions.py`
- **Code conventions** (`dev/code-conventions.md`): `docs/dev/CONVENTIONS.md`, `AGENTS.md`, `CONTRIBUTING.md`
- **Debugging tips** (`dev/debugging.md`): `docs/user/USAGE.md`, `docs/dev/ENVIRONMENT.md`, `docs/dev/TRACING.md`

## Contributing

- **Workflow** (`contributing/workflow.md`): `CONTRIBUTING.md`, `AGENTS.md`, `tools/pr_overlap.py`
- **Review criteria** (`contributing/review-criteria.md`): `CONTRIBUTING.md`, `AGENTS.md`, merged and closed PR history
- **Pull request checklist** (`contributing/pr-checklist.md`): `.github/pull_request_template.md`, `CONTRIBUTING.md`
- **Contributors** (`contributing/contributors.md`): `git shortlog -sn --no-merges`, GitHub merge commits

## Project

- **Milestones and changelog** (`project/changelog.md`): merged pull requests from Git history, release tags
- **License and legal notice** (`project/license.md`): `LICENSE`, `README.md`
- **Community** (`project/community.md`): `README.md`, `CONTRIBUTING.md`

## Reference

- **Library model** (`reference/library-model.md`): `core/libs/prx/`, `tools/progress.py`, `tools/nid_names.py`, `core/libs/nid/`
- **Library index and pages** (`reference/libraries/`): `src/data/libraries.json`, `src/data/libraries/*.json`
- **System calls** (`reference/syscalls.md`): `core/relinker/relinker/src/analysis/SyscallScanner.cpp`, `docs/dev/debt/libkernel.md`
- **Relinker pipeline** (`reference/relinker-pipeline.md`): `core/relinker/relinker/src/pipeline/Conversion.cpp`
- **CMake options** (`reference/cmake-options.md`): `CMakeLists.txt`, `cmake/`
- **Tools** (`reference/tools.md`): `tools/`
- **Shader recompiler coverage** (`reference/shader-coverage.md`): `tools/progress.py`, `tools/rdna_isa.txt`, `OPCODES`
- **Third-party dependencies** (`reference/third-party-deps.md`): `3rdparty/`, `.gitmodules`
- **Error index** (`reference/error-index.md`): `src/data/errors.json`
- **Anatomy of a converted game** (`reference/anatomy-of-a-converted-game.md`): `docs/user/USAGE.md`, `core/relinker/`
- **Glossary** (`reference/glossary.md`): terms from `docs/` and code
- **CLI cheat sheet** (`reference/cli-cheat-sheet.md`): `core/relinker/cli/src/CliArgs.cpp`
