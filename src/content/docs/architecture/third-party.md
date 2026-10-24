---
title: Third-party dependencies
description: External libraries, licensing terms, and integration rules in the AnyPS5 build system.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 maintains a strict submodule policy for external code. All third-party libraries reside under `3rdparty/` as Git submodules and compile directly from source within the project build tree.

## Integration policy

The project enforces these rules regarding external dependencies:

1. New third-party code must be added as a Git submodule under `3rdparty/<name>` with an entry in `.gitmodules`.
2. Third-party libraries must be built from source using CMake targets. Never copy foreign source files directly into `core/`.
3. The default build never searches system package directories.
4. Setting `-DANYPS5_USE_SYSTEM_DEPS=ON` enables distributions to resolve packaged libraries (SDL2, FreeType, Vulkan-Headers, SPIRV-Headers, glslang, and SPIRV-Tools) from host system packages via `cmake/SystemDeps.cmake`.

## Submodule inventory

The repository includes 21 submodules under `3rdparty/`:

| Submodule | Upstream repository | Purpose in AnyPS5 | License |
| :--- | :--- | :--- | :--- |
| `3rdparty/SDL2` | `libsdl-org/SDL` | Window management, event dispatch, game controller input, and audio backends. | zlib |
| `3rdparty/Vulkan-Headers` | `KhronosGroup/Vulkan-Headers` | Vulkan API type definitions, function pointer tables, and extension headers. | Apache-2.0 |
| `3rdparty/SPIRV-Headers` | `KhronosGroup/SPIRV-Headers` | SPIR-V intermediate language opcodes and grammar definitions. | MIT-like |
| `3rdparty/SPIRV-Tools` | `KhronosGroup/SPIRV-Tools` | SPIR-V bytecode assembly, disassembly, validation, and optimization passes. | Apache-2.0 |
| `3rdparty/glslang` | `KhronosGroup/glslang` | Shader compiler and reference SPIR-V generator. | BSD-3-Clause |
| `3rdparty/VulkanMemoryAllocator` | `GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator` | GPU buffer and image allocation management on Vulkan. | MIT |
| `3rdparty/LibAtrac9` | `shadps4-emu/ext-LibAtrac9` | Software decoder for Sony ATRAC9 audio streams in `libSceAt9Enc`. | MIT |
| `3rdparty/ffmpeg-core` | `KytyPS5/ext-ffmpeg-core` | Video and audio stream demuxing and decoding in `libSceVideodec`. | LGPL-2.1+ |
| `3rdparty/opus` | `xiph/opus` | Interactive audio codec decoder for `libSceOpusDec` and `libSceOpusCeltDec`. | BSD-3-Clause |
| `3rdparty/freetype` | `freetype/freetype` | Font glyph rendering and metrics in `libSceFont` and `libSceFontFt`. | FTL / GPL-2.0 |
| `3rdparty/stb` | `nothings/stb` | Header-only image writing (`stb_image_write.h`) for screenshot capture. | MIT / Public domain |
| `3rdparty/tracy` | `wolfpld/tracy` | High-resolution frame and CPU zone profiling client (`APS5_ENABLE_TRACY`). | BSD-3-Clause |
| `3rdparty/mimalloc` | `microsoft/mimalloc` | Performance memory allocator for Windows runtime (`APS5_MIMALLOC`). | MIT |
| `3rdparty/libjpeg-turbo` | `libjpeg-turbo/libjpeg-turbo` | Hardware-accelerated JPEG compression and decompression in `libSceJpegDec`. | IJG / BSD-3-Clause |
| `3rdparty/libusb-cmake` | `libusb/libusb-cmake` | Cross-platform USB device communication in `libSceUsbd`. | LGPL-2.1+ |
| `3rdparty/mbedtls` | `Mbed-TLS/mbedtls` | Cryptographic primitives and TLS communication in `libSceSsl` and `libSceRandom`. | Apache-2.0 |
| `3rdparty/zstd` | `facebook/zstd` | Fast real-time compression algorithms for ZArchive and asset streaming. | BSD-3-Clause |
| `3rdparty/ZArchive` | `Exzap/ZArchive` | Compact read-only archive format for packaging `app0.zar` title assets. | MIT |
| `3rdparty/vgmstream` | `vgmstream/vgmstream` | Audio decoder library for video game audio formats. | MIT |
| `3rdparty/ogg` | `xiph/ogg` | Ogg container format bitstream library. | BSD-3-Clause |
| `3rdparty/vorbis` | `xiph/vorbis` | Ogg Vorbis audio decompression in `libSceVorbisDec`. | BSD-3-Clause |
