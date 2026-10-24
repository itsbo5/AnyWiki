---
title: Converting with the relinker
description: Complete command-line reference, options, patch syntax, and exit codes for the AnyPS5 relinker.
---

import { Aside } from '@astrojs/starlight/components';

The relinker converts PlayStation 5 ELF executables into native Linux ELF, Windows PE, or macOS Mach-O binaries.

## Usage syntax

```sh
relinker [options] <input.elf> <output>
```

Verify patches syntax:

```sh
relinker --verify-patches <file> [--verify-output] [module-options] <path>
```

The output format defaults to Linux ELF regardless of the output filename. Specifying a `.exe` extension alone does not produce a Windows executable; pass `--windows` explicitly.

## Command-line options

All switches are disabled by default. The `unused-filter` setting defaults to `0`, and `--rpath` defaults to `$ORIGIN/libs`.

| Option | Argument | Description |
| :--- | :--- | :--- |
| `--help` | None | Prints usage to stdout and exits with code 0. |
| `--windows` | None | Produces a Windows PE32+ executable. Conflicts with `--macos`. |
| `--macos` | None | Produces an x86-64 Mach-O executable. Bundled modules become Mach-O dynamic libraries in `app0/sce_module`. Conflicts with `--windows`. |
| `--windows-diagnostics` | None | Generates `windows-diagnostics-imports.txt` detailing startup imports. Requires `--windows`. |
| `--windows-gui` | None | Sets the Windows PE subsystem to GUI instead of console. Requires `--windows`. |
| `--windows-fixed-base` | `<address>` | Maps the lowest ELF load page at the specified Windows address (decimal or `0x` hex). Requires a 64 KiB-aligned address from `0x20000` through `0x7fffffff0000`. Disables ASLR on the main executable. Requires `--windows`. |
| `--linux-fixed-base` | `<address>` | Loads the Linux executable at this fixed address instead of default `0x400000`. Requires a 64 KiB-aligned address from `0x10000` through `0x7fffffff0000`. Conflicts with `--windows`, `--macos`, and `--lazy-binding`. |
| `--macos-fixed-base` | `<address>` | Maps the lowest ELF load page of the macOS executable at this fixed address (from `0x20000` through `0x7fffffff0000`). Requires `--macos`. |
| `--trace-imports` | None | Routes every imported function through the `libc.prx` call tracer. Compatible with Windows and Linux. Conflicts with `--lazy-binding` and `--macos`. |
| `--to-intel` | None | Translates AMD-specific instructions into standard Intel x86-64 sequences. |
| `--to-rosetta` | None | Translates AMD instructions and lowers instructions unsupported by Rosetta (ANDN, RDSEED, CLWB, XSAVEOPT, RDPID). Implies `--to-intel`. Conflicts with `--windows`. |
| `unused-filter=0` | None | Retains all imported NID references (default). |
| `unused-filter=1` | None | Filters unused non-PLT imports through control-flow and GOT access analysis; preserves PLT imports. |
| `unused-filter=2` | None | Applies strict unused-import analysis and compacts the PLT. |
| `--registry` | None | Writes `<output-stem>.registry.json` and companion `.needed.json` files for the executable and converted guest modules. |
| `--rpath` | `<path>` | Sets the system library search path (default: `$ORIGIN/libs`). On Windows, `$ORIGIN` represents the directory containing the executable. |
| `--autorun` | None | Runs the output binary immediately after conversion and waits for Enter upon exit. Requires matching host operating system and prepared runtime layout. |
| `--sce-module-path` | `<path>` | Specifies the parent directory containing `sce_module/`, `sce_modules/`, or `prx/` (default: directory of input ELF). |
| `--module-dir` | `<dir>` | Relinks ELF modules in a directory under the module parent directory besides standard locations. Repeatable. |
| `--executable` | `<path>` | Converts a secondary title executable started via `sceSystemServiceLoadExec`. Path is relative to module parent directory. Repeatable. |
| `--patches` | `<file>` | Applies binary byte patches from the specified file during conversion. |
| `--no-patches` | None | Ignores `relinker-patches.toml` even if present in the input directory. Conflicts with `--patches`. |
| `--verify-patches` | `<file>` | Validates a patch file against an input or converted binary without writing output. |
| `--verify-output` | None | Treats the path in `--verify-patches` as a converted Linux ELF executable rather than an input ELF. |
| `--skip-sce-module` | None | Deprecated. Disables guest module processing and directory validation. For debugging only. |
| `--exclude-sce-module` | `<file>` | Deprecated. Excludes a module by exact filename. Repeatable. For debugging only. |
| `--skip-syscall-check` | None | Deprecated. Disables system call instruction scanning. For debugging only. |
| `--trap-sdk-syscall-stubs` | None | Replaces ps5-payload-dev syscall wrappers with `UD2` traps rather than halting conversion. If executed, triggers an illegal instruction exception. Debug only. |
| `--lazy-binding` | None | Deprecated. Enables lazy symbol binding. Retains `ET_DYN` position independence on Linux instead of fixed base `0x400000`. Incompatible with bundled guest modules. |

<Aside type="caution">
Specify `unused-filter=0|1|2` without leading dashes. Specifying `--unused-filter` causes an argument parsing error.
</Aside>

## Exit codes

The relinker returns the following exit codes:

- `0`: Conversion succeeded, help text was printed, or patch verification succeeded without mismatches. If `--autorun` was passed, returns the launched application's exit code.
- `1`: Invalid command-line arguments, unknown flags, or patch verification mismatch.
- `2`: Conversion failed. The specific error message is printed to stderr.

## Conversion examples

### Linux conversion with Intel lowering

```sh
relinker --to-intel source/eboot.bin app.elf
```

### Windows conversion with GUI subsystem

```powershell
.\relinker.exe --windows --windows-gui source\eboot.bin app.exe
```

### Conversion with custom module directory and call registry

```sh
relinker --windows --registry --module-dir Media/Plugins source/eboot.bin app.exe
```

## Binary patch file format

AnyPS5 supports applying byte patches before conversion. A file named `relinker-patches.toml` placed in the input executable's directory is loaded automatically unless `--no-patches` is passed.

Patch files use a subset of TOML with UTF-8 encoding:

```toml
format = 1

[[patch]]
name        = "pool_size"
target      = "eboot.elf"
va          = 0x1234
type        = "i32"
expected    = 0x10000000
value       = 0x18000000
max         = 0x7f000000
align       = 0x1000
description = "pool size override"
```

### Patch table keys

- `format = 1`: Required top-level key.
- `name`: Optional unique identifier for the patch.
- `target`: Required. Filename of the target executable or relative path of a bundled module (for example, `sce_module/libc.prx`).
- `va`: Required. Virtual address of the code in the original ELF.
- `type`: Optional data type (`u8`, `u16`, `u32`, `u64`, `i8`, `i16`, `i32`, `i64`). When omitted, `expected` and `value` are treated as hexadecimal byte strings.
- `expected`: Required. Bytes that must be present at `va` before patching.
- `value`: Required. Bytes to write at `va`.
- `min`, `max`, `align`: Optional bounds checks for typed entries.
- `description`: Optional text printed in the patch manifest.

When patches are applied, the relinker writes `<output-stem>.patches.toml` beside the generated binary, recording all applied modifications.
