---
title: Repository map
description: Architectural layout of directories, modules, and submodules across the AnyPS5 codebase.
---

import { FileTree } from '@astrojs/starlight/components';

The AnyPS5 codebase is organized into core runtime components, third-party submodules, developer tools, documentation, and continuous integration workflows.

## Top-level directory tree

<FileTree>
- AnyPS5/
  - core/
    - relinker/ (offline binary relinker and WebAssembly port)
    - libs/
      - prx/ (reimplemented PS5 system dynamic libraries)
      - allocator/ (runtime heap and allocator integration)
    - shader/
      - recompiler/ (AMD RDNA2 to Vulkan SPIR-V translator)
    - Decoder/ (hardware JPEG and PNG decoding)
  - 3rdparty/ (external dependencies managed as submodules)
  - tools/ (Python verification, progress, and test automation scripts)
  - demo/
    - web/ (in-browser WebAssembly converter frontend and worker)
  - docs/
    - user/ (end-user guides for usage and input mapping)
    - dev/ (developer guides and technical debt logs)
  - .github/
    - workflows/ (GitHub Actions build and validation matrix)
</FileTree>

## Core subsystems

### core/relinker

The offline conversion engine. It reads PlayStation 5 ELF64 executables and translates them into native host formats:

- `cli/`: Command-line interface, argument parsing (`CliArgs.cpp`), module scanning (`NativeModules.cpp`), and autorun supervision (`Autorun.cpp`).
- `parsing/`: ELF64 binary header parsing, program header layout verification, and segment bounds checking (`ElfReader.cpp`).
- `analysis/`: System call scanning (`SyscallScanner.cpp`), PLT/GOT call site resolution (`CallSiteResolver.cpp`), and unused NID filtering (`UnusedNidFilter.cpp`).
- `codegen/`: Translation of AMD Zen-specific instructions into Intel-compatible or Rosetta-compatible sequences (`IAmd64OnlyConverter.cpp`).
- `elfpatcher/`: Operating system format generators:
  - `linux/`: Linux `ET_EXEC` ELF patcher and desktop entry generator.
  - `windows/`: Windows PE32+ patcher with import diagnostics and embedded `icon0.png` resource builder.
  - `macos/`: macOS x86-64 Mach-O patcher.
- `wasm/`: Emscripten bindings exporting `Convert()` to JavaScript for browser-based conversion.

### core/libs/prx

Clean-room C++20 reimplementations of PlayStation 5 system PRX libraries. Contains 368 library directories, including:

- `libkernel/`, `libkernel_sys/`: Memory allocation, direct memory mapping, POSIX thread management, file descriptors, event queues, and system timing.
- `libc/`: C standard library, memory allocators, locale, and Itanium C++ ABI runtime support (`libc.prx`).
- `libSceAgc/`, `libSceAgcDriver/`: Next-generation PlayStation graphics context, command buffer dispatch, resource registration, and Vulkan presentation bridging.
- `libSceVideoOut/`: Display mode enumeration, swapchain flip synchronization, HDR metadata management, and telemetry.
- `libSceAudioOut/`, `libSceAudioIn/`, `libSceAudio3d/`: Audio streams, 3D audio spatialization, and SDL audio driver backends.
- `libScePad/`: Controller device queries, stick deadzone calibration, touchpad state forwarding, and test input injection.

### core/shader/recompiler

The GPU shader translation engine:

- `RdnaDecoder/`: Decodes raw binary AMD RDNA2 GPU opcodes into structured C++ representations.
- `ControlFlow/`: Reconstructs high-level control-flow graphs from unstructured shader branching instructions.
- `IntermediateRepresentation/`: Static single-assignment (SSA) intermediate representation for optimization and register allocation.
- `SpirvEmitter/`: Generates binary SPIR-V modules suitable for consumption by Vulkan graphics and compute pipelines.

### 3rdparty

Third-party dependencies managed as Git submodules and compiled directly from source:

- Windowing and input: `SDL2`
- Graphics API and validation: `Vulkan-Headers`, `SPIRV-Headers`, `SPIRV-Tools`, `glslang`, `VulkanMemoryAllocator`
- Audio and video codecs: `ffmpeg-core`, `opus`, `LibAtrac9`, `vgmstream`, `ogg`, `vorbis`
- Compression and archiving: `zstd`, `ZArchive`
- Memory and utilities: `mimalloc`, `freetype`, `libjpeg-turbo`, `libusb-cmake`, `mbedtls`, `tracy`, `stb`

### tools

Automation and verification scripts:

- `check_conventions.py`: Enforces coding standards, comment bans, and pull request rules.
- `progress.py`: Scans PRX libraries and shader opcodes to generate coverage statistics and badges.
- `import_audit.py`: Validates game NID references against built PRX libraries prior to launch.
- `pr_overlap.py`: Detects conflicting export declarations among open pull requests.
- `pad_input.py` and `pad_timeline.py`: Injects controller commands into running titles.
