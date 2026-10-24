---
title: Developer tools
description: Reference guide for development scripts and utilities located in tools/.
---

The `tools/` directory contains automation scripts for convention enforcement, binary inspection, reverse engineering, and release management. Most scripts are written in Python 3.

## Codebase and quality checks

### `check_conventions.py`

Enforces repository standards on commits, file encodings, and source comments:

- **Purpose**: Verifies that no inline comments exist in `core/` or `tools/` (except `#endif` and namespace closures), validates UTF-8 text encoding, and checks commit subject formatting.
- **CLI syntax**:
  ```bash
  python3 tools/check_conventions.py --base origin/main
  ```
- **Inputs and outputs**: Reads Git objects between `HEAD` and the target base branch. Emits violations to standard output and returns exit code `1` if any check fails.

### `pr_overlap.py`

Detects concurrent pull requests touching the same functions or file lines:

- **Purpose**: Prevents duplicated work and conflicting PR merges by querying open pull requests against local branch modifications.
- **CLI syntax**:
  ```bash
  python3 tools/pr_overlap.py --branch <branch-name>
  ```
- **Inputs and outputs**: Inspects the Git diff of the specified branch against `origin/main`. Emits a list of overlapping PR numbers and symbol collisions.

### `debt_split.py`

Maintains technical debt documentation between the monolithic index and per-library files:

- **Purpose**: Splits entries from `docs/dev/TechnicalDebt.md` into individual library debt files under `docs/dev/debt/<library>.md` or resolves merge conflicts during Git rebases.
- **CLI syntax**:
  ```bash
  python3 tools/debt_split.py split
  python3 tools/debt_split.py resolve
  ```
- **Inputs and outputs**: Modifies markdown files in `docs/dev/debt/`.

## Reverse engineering and binary analysis

### `unwrap_self.py`

Extracts unencrypted ELF executables from PlayStation SELF containers:

- **Purpose**: Strips the proprietary SCE container headers from decrypted `eboot.bin` files to produce standard 64-bit ELF binaries acceptable to the relinker.
- **CLI syntax**:
  ```bash
  python3 tools/unwrap_self.py <input.self> <output.elf>
  ```
- **Inputs and outputs**: Takes an unencrypted SELF file path and writes the raw ELF image to the output path.

### `nid_names.py`

Calculates and resolves 11-character NID hashes:

- **Purpose**: Converts symbol function names into NIDs using the SHA-1 salt algorithm, or looks up known symbol names for observed NIDs.
- **CLI syntax**:
  ```bash
  python3 tools/nid_names.py --name <symbol-name>
  python3 tools/nid_names.py --nid <11-char-nid>
  ```
- **Inputs and outputs**: Accepts symbol strings or NIDs via command-line arguments and outputs corresponding mapped values.

### `import_audit.py`

Audits executable import tables against available host library exports:

- **Purpose**: Scans an ELF binary or module set to report all required imports, categorizing them as implemented, inert, or missing.
- **CLI syntax**:
  ```bash
  python3 tools/import_audit.py --elf <path-to-elf> --libs-dir build/core/libs/libs
  ```
- **Inputs and outputs**: Reads binary headers and outputs a structured summary of unresolved dependencies.

### `stubgen.py`

Generates C++ export boilerplate for system libraries:

- **Purpose**: Creates initial `Export.cpp` stubs for new libraries or missing functions, wiring symbols to `NotImplemented_nid_no_patch(__func__)`.
- **CLI syntax**:
  ```bash
  python3 tools/stubgen.py --library <LibraryName> --symbols <symbols.txt>
  ```
- **Inputs and outputs**: Reads a list of function names and outputs formatted C++ export definitions.

## Performance and metrics

### `trace_digest.py`

Analyzes and summarizes execution traces:

- **Purpose**: Parses runtime event traces captured during game execution, computing frame time distributions and performance statistics.
- **CLI syntax**:
  ```bash
  python3 tools/trace_digest.py <trace-file.json>
  ```
- **Inputs and outputs**: Reads trace data and outputs formatted summary lines suitable for pull request performance claims.

### `progress.py`

Computes project implementation metrics:

- **Purpose**: Scans `core/libs/prx` and `rdna_isa.txt` to calculate the percentage of implemented system library functions and shader opcodes.
- **CLI syntax**:
  ```bash
  python3 tools/progress.py [--json]
  ```
- **Inputs and outputs**: Outputs human-readable tables or JSON data representing current library and shader coverage.

## Packaging and web build

### `build_web.py`

Builds the WebAssembly converter:

- **Purpose**: Invokes Emscripten to compile `relinker_wasm.mjs` and bundles HTML, worker scripts, and asset archives for GitHub Pages deployment.
- **CLI syntax**:
  ```bash
  python3 tools/build_web.py --output-dir demo/web/dist
  ```
- **Inputs and outputs**: Produces distribution-ready static web converter assets.

### `package_release.py`

Bundles standalone binary distribution archives:

- **Purpose**: Packages the relinker executable, compiled `.prx` libraries, and default configuration templates into `.zip` or `.tar.gz` release archives.
- **CLI syntax**:
  ```bash
  python3 tools/package_release.py --build-dir build --os <windows|linux>
  ```
- **Inputs and outputs**: Collects build artifacts and generates packaged release archives.
