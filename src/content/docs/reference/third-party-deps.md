---
title: Third-party dependencies
description: Pinned Git submodules, version commit hashes, licenses, and host integration roles in 3rdparty/.
---

AnyPS5 bundles third-party dependencies as pinned Git submodules in `3rdparty/`. By default, all dependencies are compiled from source to guarantee consistent behavior across platforms without relying on system-installed libraries.

## Submodule inventory

The table below details all 21 submodules configured in `.gitmodules`, including their pinned commit hashes, software licenses, and purpose in AnyPS5.

| Submodule | Pinned commit | License | Subsystem and purpose |
| :--- | :--- | :--- | :--- |
| `LibAtrac9` | `946e05a` | MIT | ATRAC9 proprietary audio decoding used in `libSceAjm` and `libSceAt9Enc`. |
| `SDL2` | `4b69833` | zlib | Host windowing, controller input mapping, event handling, and audio streaming. |
| `SPIRV-Headers` | `01e0577` | MIT / Khronos | Specification header definitions for SPIR-V shader bytecode generation. |
| `SPIRV-Tools` | `7f2d9ee` | Apache-2.0 | SPIR-V validation and optimization passes enabled with `ANYPS5_ENABLE_SPIRV_TOOLS`. |
| `Vulkan-Headers` | `2fa2034` | Apache-2.0 | Vulkan 1.4 API declarations for GPU command submission and surface presentation. |
| `VulkanMemoryAllocator` | `a1d4347` | MIT | GPU device memory pooling and buffer allocation in AGC graphics backends. |
| `ZArchive` | `965b66c` | MIT | Compressed read-only package archive reader for title assets. |
| `ffmpeg-core` | `9ac4cfd` | LGPL-2.1+ / GPL-2.0+ | Video stream demuxing and decoding used in `libSceVideodec` and `libSceAvcdec`. |
| `freetype` | `42608f7` | FTL / GPL-2.0 | TrueType and OpenType font rasterization in `libSceFont` and `libSceFontFt`. |
| `glslang` | `ba16404` | BSD-3-Clause | Shader parser frontend and intermediate representation compiler. |
| `libjpeg-turbo` | `c85e6b9` | BSD-3-Clause / IJG | SIMD-accelerated JPEG decompression in `libSceJpegDec`. |
| `libusb-cmake` | `bea6567` | LGPL-2.1 | Host USB device discovery and raw transfer interfaces in `libSceUsbd`. |
| `mbedtls` | `068ff08` | Apache-2.0 | TLS/SSL communication, cryptographic hashing, and cert management in `libSceSsl`. |
| `mimalloc` | `f8401be` | MIT | High-performance memory allocator for direct guest heap allocations. |
| `ogg` | `be05b13` | BSD-3-Clause | Ogg media container bitstream framing and synchronization. |
| `opus` | `22244de` | BSD-3-Clause | Interactive audio and low-latency voice codec decoding in `libSceVoice`. |
| `stb` | `2c980bb` | Public Domain / MIT | Single-header image parsing and string layout utility routines. |
| `tracy` | `30997d5` | BSD-3-Clause | High-resolution telemetry instrumentation enabled with `APS5_ENABLE_TRACY`. |
| `vgmstream` | `7c520e8` | ISC | Multi-format video game audio stream decoding. |
| `vorbis` | `0657aee` | BSD-3-Clause | Ogg Vorbis audio decoding in `libSceVorbisDec`. |
| `zstd` | `f8745da` | BSD-3-Clause | Zstandard compression and fast decompression in `libSceZlib`. |

## Submodule management rules

The project enforces strict guidelines regarding third-party libraries:

- **Source builds required**: Dependencies must be added as submodules and integrated into CMake via `add_subdirectory`. Pull requests must not copy external source code files directly into the repository tree.
- **System dependency option**: On Linux distributions, passing `-DANYPS5_USE_SYSTEM_DEPS=ON` instructs CMake to resolve SDL2, FreeType, Vulkan-Headers, SPIRV-Headers, glslang, and SPIRV-Tools using system package managers via `cmake/SystemDeps.cmake`.
- **Relinker independence**: The relinker-only build (`-DANYPS5_RELINKER_ONLY=ON`) requires none of these third-party submodules. It compiles strictly against standard C++20 standard libraries.
