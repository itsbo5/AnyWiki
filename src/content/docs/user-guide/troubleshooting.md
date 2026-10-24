---
title: Troubleshooting
description: Verbatim error messages from the relinker and runtime code, their exact causes, and resolutions.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 enforces a strict failure model. When an unhandled state or missing dependency occurs, the process terminates and prints the error to standard error.

## Relinker errors

### Multiple module directories present

```text
FAIL: Both sce_module and sce_modules exist in the guest module parent directory
```

- **Cause**: The parent directory contains both `sce_module` and `sce_modules` folders.
- **Resolution**: Consolidate guest modules into exactly one directory named `sce_module` or `sce_modules`.

### Module directory missing

```text
FAIL: sce_module was not found in: /path/to/source. Use --skip-sce-module to disable guest module processing.
```

- **Cause**: Neither `sce_module/`, `sce_modules/`, nor `prx/` was found beside the input executable.
- **Resolution**: Place bundled guest modules into `sce_module/`. For standalone homebrew binaries with shared libraries in the root folder, pass `--module-dir .`.

### Output overwrites input

```text
FAIL: Executable output would overwrite the input executable
```

- **Cause**: The destination executable path resolves to the same filesystem location as the input executable.
- **Resolution**: Specify a distinct path or filename for the output binary.

### Output path collision

```text
FAIL: Output paths collide: /path/to/first and /path/to/second
```

- **Cause**: Two generated artifacts (executable, converted guest module, registry file, or desktop entry) resolve to the same filesystem location, including through symbolic or hard links.
- **Resolution**: Ensure input filenames within module directories do not collide with the main executable or other output names.

### Invalid unused-filter option

```text
FAIL: unused-filter must be specified once with a value of 0, 1 or 2
```

- **Cause**: Specifying `--unused-filter` with dashes, providing an out-of-range value, or repeating the parameter.
- **Resolution**: Format the parameter as `unused-filter=0`, `unused-filter=1`, or `unused-filter=2` without leading dashes.

### Flag conflicts

```text
FAIL: --windows conflicts with --macos
FAIL: --to-rosetta conflicts with --windows
FAIL: --trace-imports conflicts with --lazy-binding
```

- **Cause**: Incompatible command-line flags passed together.
- **Resolution**: Pass only flags valid for your target operating system. For Windows, use `--to-intel` rather than `--to-rosetta`.

## Runtime startup errors

### Missing host CPU extensions

```text
[cpu] Host CPU does not support required Zen 2 extensions: AVX2, FMA
```

- **Cause**: The host CPU lacks one or more instruction set extensions present on the PlayStation 5 AMD Zen 2 CPU.
- **Resolution**: Run the application on a processor supporting AVX2, FMA, F16C, BMI1, BMI2, LZCNT, and MOVBE. If running on an Intel CPU, ensure the binary was relinked with `--to-intel`.

### Linux udmabuf permission denied

```text
[gpu] open /dev/udmabuf: Permission denied
```

- **Cause**: The executing user lacks read-write access to `/dev/udmabuf`.
- **Resolution**: Add the user account to the `kvm` group: `sudo usermod -aG kvm $USER`, then log in again.

### Windows error 126: module not found

```text
LoadLibrary failed with error 126
```

- **Cause**: Windows cannot locate the MinGW runtime libraries needed by the AnyPS5 host PRX libraries.
- **Resolution**: Copy `libgcc_s_seh-1.dll`, `libstdc++-6.dll`, and `libwinpthread-1.dll` from your MinGW toolchain `bin/` directory directly into `libs/`.

### Windows error 193: %1 is not a valid Win32 application

```text
LoadLibrary failed with error 193
```

- **Cause**: An unconverted PlayStation 5 ELF module was placed inside `libs/`.
- **Resolution**: Keep only AnyPS5 host runtime libraries in `libs/`. Converted title modules belong in `app0/sce_module/`.

### Direct memory allocation exhausted

```text
FAIL: replace guest placeholder with resident direct memory
```

- **Cause**: Insufficient committed memory available on Windows. Titles allocate up to 13,824 MiB of direct memory at startup.
- **Resolution**: Increase the Windows virtual memory pagefile size in System Properties > Performance Settings to cover the direct memory requirement.

### NVIDIA driver crash in nvgpucomp64.dll

```text
FATAL: unhandled exception 0xc0000005 at rip nvgpucomp64.dll
```

- **Cause**: NVIDIA Windows driver 610.47 crashing during pipeline creation.
- **Resolution**: Update the NVIDIA graphics driver to version 617.42 or newer.

### Auxiliary binary execution failure

```text
sceSystemServiceLoadExec: execv failed: Permission denied
```

- **Cause**: Secondary executable inside `app0/` lacks Linux executable permissions.
- **Resolution**: Run `chmod +x` on every binary in `app0/`.

### PlayGo memory runaway on dumps without metadata

```text
Ran out of memory allocating 5565054976 bytes
```

- **Cause**: The dump lacks `sce_sys/playgo-chunk.dat` and `sce_sys/playgo-scenario.json`, causing titles such as Demon Slayer (PPSA03490) to query sequentially higher chunk IDs indefinitely.
- **Resolution**: Set `APS5_PLAYGO_UNLISTED_CHUNKS=absent` before starting the application.
