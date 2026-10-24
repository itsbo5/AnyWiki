---
title: Anatomy of a converted game
description: End-to-end trace of an executable from input ELF decryption through relinking, layout, and runtime execution.
---

import { FileTree } from '@astrojs/starlight/components';

Understanding how PlayStation 5 game files transform into running host applications helps diagnose startup failures, missing modules, and rendering anomalies. This reference traces a title through decryption, relinking, staging, and runtime execution.

## Phase 1: Decryption and input preparation

A PlayStation 5 game dump contains encrypted SELF (Signed ELF) packages. Before AnyPS5 can read them, binaries must be decrypted into standard 64-bit ELF format:

1. **Unwrapping SELF containers**: Use `tools/unwrap_self.py` to strip proprietary encryption headers from `eboot.bin` and bundled `.prx` modules in `sce_module/`.
2. **Directory layout**: Place the decrypted `eboot.elf` beside exactly one module directory (`sce_module/` or `sce_modules/`). Having both or neither causes the relinker to reject the input.
3. **Asset restoration**: Titles previously packaged for `ampr_emu` store assets in `ampr_assets.index` and `ampr_assets-*.pak`. These archives must be unpacked using `ampr_pack.py unpack` back into `app0/` so the game can access raw asset paths.

## Phase 2: Relinker conversion

Run the relinker against the clean ELF:

```bash
# On Windows PowerShell
relinker.exe --windows --registry src\eboot.elf game\app.exe

# On Linux
relinker --registry src/eboot.elf game/app.elf
```

During this step, the relinker executes the conversion pipeline:

- **Segment scanning**: Reads `PT_LOAD` segments and maps function boundaries using `.eh_frame` DWARF exception tables.
- **Syscall verification**: Inspects machine instructions for `syscall`, `sysenter`, or `int 0x80`. If homebrew SDK stubs are present, passing `--trap-sdk-syscall-stubs` rewrites them to safe `UD2` traps.
- **Import registry generation**: Emits `app.registry.json` recording every imported NID, relocation type, and code call-site address.
- **Dynamic table synthesis**: Synthesizes host `DT_NEEDED` records pointing to system `.prx` libraries, constructs PLT jump tables, and sets runtime rpath ($ORIGIN/libs).
- **Guest module relinking**: Iterates through `sce_module/`, converting each game-bundled module into a host-loadable dynamic library.

## Phase 3: Runtime staging

The converted game files and runtime libraries are staged into the execution directory:

<FileTree>
- game/
  - app.exe                  # Converted executable
  - app.registry.json        # Symbol import audit registry
  - anyps5-input.ini         # Keyboard and mouse bindings
  - libs/                    # Host system PRX libraries
    - libc.prx
    - libkernel.prx
    - libSceAgcDriver.prx
    - libSceAudioOut.prx
    - libScePad.prx
    - libSceVideoOut.prx
    - libgcc_s_seh-1.dll     # MinGW runtime (Windows only)
    - libstdc++-6.dll        # MinGW runtime (Windows only)
    - libwinpthread-1.dll    # MinGW runtime (Windows only)
  - app0/                    # Title data directory
    - sce_module/            # Converted game-bundled modules
      - cohtml.prx
      - fmod.prx
    - data/                  # Game assets and package files
  - shader_cache/            # On-disk SPIR-V compiled pipeline cache
  - _sd/                     # Title save data directory
</FileTree>

### Staging rules

- Place only AnyPS5 system libraries inside `libs/`. Never place game-specific modules into `libs/`.
- On Windows, copy `libgcc_s_seh-1.dll`, `libstdc++-6.dll`, and `libwinpthread-1.dll` from your MinGW toolchain into `libs/` to avoid Windows DLL load error `126`.
- Keep the title's original asset hierarchy intact under `app0/`.

## Phase 4: Runtime execution

When the converted executable launches, execution proceeds through distinct initialization stages:

### 1. Dynamic linking

The host operating system dynamic loader reads `app.exe` or `app.elf`:

- The loader follows the configured rpath (`$ORIGIN/libs`) and loads `libc.prx`, `libkernel.prx`, and other needed system modules into memory.
- Symbol NIDs are bound to exported functions in the PRX libraries.
- On Windows, calls from the converted executable cross the ABI boundary through `APS5_VABI` (`__attribute__((sysv_abi))`), preserving System V AMD64 register conventions.

### 2. Subsystem initialization

The runtime initializes host subsystems:

- `libkernel` configures virtual memory arenas, thread pools, and POSIX signal handlers.
- `libScePad` queries SDL2 for connected game controllers and reads `anyps5-input.ini` for keyboard mapping.
- `libSceAudioOut` configures SDL audio queues for multi-channel stream mixing.
- `libSceVideoOut` and `libSceAgcDriver` initialize Vulkan instances, enumerate physical GPUs, and create window swapchains.

### 3. Shader recompilation and graphics execution

As the game submits draw packets through `libSceAgcDriver`:

- The command buffer processor extracts AMD RDNA2 GPU shader microcode.
- The shader recompiler checks `shader_cache/`. If a cached SPIR-V module exists, it loads instantly; otherwise, the recompiler compiles the RDNA2 bytecode into SPIR-V and saves it to disk.
- Vulkan pipeline state objects (PSOs) are created on the host GPU driver.

### 4. Frame presentation loop

During active rendering:

- The game presents frames via `sceVideoOutSubmitFlip`.
- When `APS5_PROFILE_DRAW=1` is set in the environment, the runtime logs progress every 10 seconds:
  ```
  [present] 600 presents over 10 s (60.0 fps)
  [gpu] host import budget: 412 MiB live of 8192 MiB
  ```
- Game save data is persisted to `_sd/`, ensuring progress is retained across sessions.
