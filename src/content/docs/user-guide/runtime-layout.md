---
title: Runtime layout
description: Required folder structure, asset locations, system libraries, and runtime environment settings.
---

import { FileTree, Aside } from '@astrojs/starlight/components';

Converted PlayStation 5 applications require a specific directory hierarchy relative to the executable for locating libraries, configuration, and game assets.

## Directory structure

The executable expects the following layout in its working directory:

<FileTree>
- game-root/
  - app.elf (Linux) or app.exe (Windows)
  - libs/
    - *.prx (AnyPS5 host system libraries)
    - libgcc_s_seh-1.dll (Windows only)
    - libstdc++-6.dll (Windows only)
    - libwinpthread-1.dll (Windows only)
    - mimalloc.dll (Windows only, optional)
    - mimalloc-redirect.dll (Windows only, optional)
  - app0/
    - eboot.bin (original binary)
    - sce_sys/
      - param.json
    - sce_module/
      - <converted guest modules>
    - <game data and assets>
  - app0.zar (optional compressed ZArchive)
  - anyps5-fonts/ (optional system font directory)
  - shader_cache/ (generated runtime cache)
</FileTree>

<Aside type="caution">
The `libs/` directory is reserved for AnyPS5 host system libraries. Do not place original unconverted PlayStation 5 `.prx` files in `libs/`. On Windows, the operating system attempts to load them as Win32 DLLs and fails with error 193. Converted title modules belong in `app0/sce_module/`.
</Aside>

## Component descriptions

### The app0/ directory and eboot.bin

PlayStation 5 applications resolve asset paths using the virtual path `/app0/`. At startup, many titles test for the existence of `/app0/eboot.bin` to discover their own installation root. Place the original, unmodified binary as `app0/eboot.bin` to ensure font loaders and asset trees initialize correctly.

### Package metadata: param.json

Applications read title metadata from `app0/sce_sys/param.json`. This file must contain:
- A non-empty `titleId` string.
- A `localizedParameters` object containing a non-empty `titleName`.

At startup, AnyPS5 inspects `param.json` to configure window titles and create directory structures. The presence of `param.json` creates the local `data/` directory. If `downloadDataSize` is non-zero, it also creates `download0/`. If `param.json` is missing or malformed, startup metadata queries will fail.

### Compressed archives: app0.zar

To reduce storage footprint, asset files can be packed into a [ZArchive](https://github.com/Exzap/ZArchive) named `app0.zar` placed beside `app0/`. When `app0.zar` is present:
- Files existing on disk in `app0/` take precedence.
- Files not present in `app0/` are read from `app0.zar`.
- The executable, `sce_sys/param.json`, and `sce_module/` must remain loose on the filesystem inside `app0/`.

### Windows toolchain DLLs

On Windows, compiled PRX libraries link dynamically against the MinGW-w64 C and C++ runtimes. Copy these files from your MinGW `bin/` directory into `libs/`:
- `libgcc_s_seh-1.dll`
- `libstdc++-6.dll`
- `libwinpthread-1.dll`

When launching with `APS5_MIMALLOC=1`, also place `mimalloc.dll` and `mimalloc-redirect.dll` inside `libs/`.

### System fonts

Titles that call `sceFontOpenFontSet` expect system fonts in an `anyps5-fonts/` directory beside the executable (or in the directory configured with `ANYPS5_SYSTEM_FONTS`).

If original console fonts (`SST-Roman.otf`, `SST-Bold.otf`, `SSTJpPro-Regular.otf`) are unavailable, AnyPS5 loads substitute Noto fonts licensed under the SIL Open Font License:
- `NotoSans-Regular.ttf`, `NotoSans-Bold.ttf` (Latin)
- `NotoSansCJK-Regular.ttc` (Japanese, Chinese, Korean)
- `NotoSansArabic-Regular.ttf` (Arabic)
- `NotoSansThai-Regular.ttf` (Thai)

### Shader cache

Compiled Vulkan pipelines and translated SPIR-V shaders are saved in `shader_cache/` beside the executable (or the directory pointed to by `ANYPS5_SHADER_CACHE_DIR`).

- Shaders are stored in subdirectories named after the recompiler source version. Cache entries untouched for 14 days are cleaned automatically.
- The pipeline journal (`pipelines.journal`) records draw and compute pipeline combinations to rebuild them on background threads during subsequent launches.
- Setting `ANYPS5_NO_SHADER_CACHE=1` disables disk caching.

## Direct memory and system limits

PlayStation 5 titles allocate up to 13,824 MiB of direct memory via `sceKernelAllocateDirectMemory`.

- On Windows: Direct memory is committed when the title maps it. The Windows system commit limit (physical RAM plus pagefile) must cover the allocation. If insufficient commit space is available, `sceKernelMapDirectMemory` throws `replace guest placeholder with resident direct memory`.
- On Linux: Direct memory imports through `/dev/udmabuf`. The executing user must belong to the `kvm` group.
