---
title: CLI cheat sheet
description: Quick reference cheat sheet for relinker command-line flags, arguments, and environment variables.
---

This cheat sheet provides a quick reference for relinker syntax, conversion flags, and runtime environment variables.

## Relinker command syntax

```bash
relinker [options] <input.elf> <output>
```

The input file must be an unencrypted 64-bit ELF executable. Bundled modules must reside in exactly one of `sce_module/` or `sce_modules/` next to the input file.

## Command-line flags

| Flag | Category | Description |
| :--- | :--- | :--- |
| `--windows` | Format | Generates a Windows Portable Executable (PE `.exe`) instead of a Linux ELF binary. |
| `--windows-gui` | Format | Suppresses the Windows console window and redirects runtime logs to `anyps5.log`. |
| `--windows-diagnostics` | Debugging | Emits detailed crash exception reports and register dumps to standard output. |
| `--registry` | Audit | Generates `<output>.registry.json` recording imported NIDs and code call-site addresses. |
| `--to-intel` | Translation | Analyzes AMD-specific instruction sequences and replaces them with Intel-compatible trampolines. |
| `unused-filter=0` | Optimization | Retains all declared imports in the output dynamic table without pruning (written without dashes). |
| `unused-filter=1` | Optimization | Removes imports that have no references in executable code sections. |
| `unused-filter=2` | Optimization | Removes unreferenced imports and prunes non-essential libraries from `DT_NEEDED`. |
| `--rpath <path>` | Linking | Overrides the dynamic library search path embedded in the executable (defaults to `$ORIGIN/libs`). |
| `--autorun` | Runtime | Injects an autorun hook into the binary for automated test suites. |
| `--game-patch <file>` | Patching | Applies byte-level patches from a TOML configuration file before conversion. |
| `--trap-sdk-syscall-stubs` | Homebrew | Rewrites recognized `ps5-payload-dev` and SDK syscall wrapper stubs to `UD2` traps. |
| `--skip-syscall-check` | Deprecated | Disables system call validation. Retained strictly for relinker diagnostics. |
| `--skip-sce-module` | Deprecated | Skips bundled modules entirely. Causes runtime link failures in commercial games. |
| `--exclude-sce-module <f>` | Deprecated | Excludes a single module file from relinking. |
| `--lazy-binding` | Deprecated | Enables lazy PLT resolution instead of immediate binding. |

## Process exit codes

| Exit code | Status | Explanation |
| :--- | :--- | :--- |
| `0` | Success | The binary was converted successfully and output files were written. |
| `1` | Argument error | Invalid command-line flags, missing required arguments, or syntax errors. |
| `2` | Conversion failure | Fatal conversion error: corrupt input ELF, multiple `sce_module` folders, or untrapped syscalls. |

## Runtime environment variables

Set these variables in your shell environment before launching a converted game:

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `APS5_PROFILE_DRAW=1` | `0` | Prints frame presentation statistics every 10 seconds to standard output. |
| `APS5_PROFILE_GPU=1` | `0` | Logs GPU queue execution times and command buffer synchronization intervals. |
| `APS5_LOG_TIMESTAMPS=1` | `0` | Prepends high-resolution timestamps to every console log line. |
| `APS5_PAD_INPUT_FILE=<path>` | Unset | Reads gamepad button presses and analog axis values from the specified file. |
| `APS5_NO_PAD_INPUT=1` | `0` | Ignores host keyboard and mouse events during automated measurement runs. |
| `ANYPS5_NO_SHADER_CACHE=1` | `0` | Disables reading and writing on-disk SPIR-V shader pipelines in `shader_cache/`. |
| `ANYPS5_SHADER_CACHE_DIR=<p>` | `shader_cache` | Overrides the destination directory for compiled SPIR-V shader bytecode. |
| `ANYPS5_REQUIRE_VULKAN=1` | `0` | Forces immediate process abort if a Vulkan 1.3+ physical device is unavailable. |
| `ANYPS5_GPU=<name>` | Auto | Selects a specific host GPU matching the provided substring name. |
| `APS5_HOST_IMPORT_MIB=<n>` | Auto | Overrides the host memory budget in megabytes for zero-copy CPU-to-GPU buffers. |
| `APS5_TEXTURE_CACHE_MIB=<n>` | Auto | Overrides the texture cache memory allocation limit in megabytes. |
| `APS5_TRACE_FRAMES=<s>:<n>` | Unset | Captures detailed execution traces starting at frame `s` for `n` frames. |
| `APS5_TRACE_SUMMARY_EVERY=10`| Unset | Writes 10-second performance summaries to `aps5-summary.jsonl` without CPU overhead. |
| `APS5_CRASH_INDIRECT_MEMORY=1`| `0` | Dumps 64 bytes of memory surrounding each pointer register in Windows crash logs. |
| `APS5_HANG_DUMP_SECS=<n>` | Unset | Writes a diagnostic memory dump if the game hangs without presenting for `n` seconds. |
