---
title: CMake options
description: Complete reference of CMake configuration options, default values, and platform compatibility.
---

This reference documents the configuration options available when building AnyPS5 with CMake. Specify options using `-D<OPTION>=<ON|OFF>` during the CMake configuration step.

## Build configuration options

The table below lists all top-level and subsystem configuration options declared in `CMakeLists.txt`.

| Option | Default | Platform | Description |
| :--- | :--- | :--- | :--- |
| `BUILD_TESTING` | `OFF` | All | Builds the CTest regression test suites and registers integration test cases. |
| `ANYPS5_RELINKER_ONLY` | `OFF` | All | Builds only the `relinker` binary, omitting system PRX libraries and third-party dependencies. Required on macOS. |
| `ANYPS5_BUILD_WASM` | `OFF` | Emscripten | Compiles the WebAssembly relinker module (`relinker_wasm.mjs`) used in the web converter. Requires the Emscripten SDK. |
| `ANYPS5_ENABLE_SPIRV_TOOLS` | `OFF` | Windows, Linux | Enables SPIRV-Tools shader validation and optimization passes on recompiled graphics shaders. |
| `ANYPS5_ENABLE_ASAN` | `OFF` | Linux | Compiles with AddressSanitizer and configures an ASan-compatible guest virtual memory arena range. |
| `APS5_ENABLE_TIMING_LOG` | `OFF` | Windows, Linux | Enables asynchronous frame timing logging to `frame-timing.log` for frame pacing analysis. |
| `APS5_ENABLE_TRACY` | `OFF` | Windows, Linux | Compiles the Tracy profiler client and instruments internal timing scopes for profiling runs. |
| `ANYPS5_USE_SYSTEM_DEPS` | `OFF` | Linux | Resolves SDL2, FreeType, Vulkan-Headers, SPIRV-Headers, glslang, and SPIRV-Tools from host system packages rather than `3rdparty/` submodules. |
| `ANYPS5_RELINKER_CLI` | `ON` | All | Builds the native command-line executable for the relinker tool. |
| `APS5_AGC_CREATE_LOG` | `ON` | Windows, Linux | Enables diagnostic logging for successful `sceAgcCreateShader` calls. |
| `AGC_BUILD_VISUAL_TEST` | `OFF` | Windows, Linux | Builds the standalone interactive AGC SPIR-V visual test runner. |

## Standard CMake cache variables

In addition to project-specific flags, AnyPS5 honors standard CMake variables:

### `CMAKE_BUILD_TYPE`

Determines compiler optimization flags and debug symbol generation:

- `Release`: Optimizations enabled (`-O3` or `/O2`), debug assertions disabled. Recommended for general usage.
- `Debug`: Debug symbols generated (`-g` or `/Zi`), optimizations disabled (`-O0` or `/Od`).
- `RelWithDebInfo`: High optimizations with complete debug symbols. Recommended for profiling and debugging crash dumps.

### `CMAKE_INSTALL_PREFIX`

Specifies the destination directory when running `cmake --install build`. Defaults to `/usr/local` on Linux and `C:/Program Files/AnyPS5` on Windows. When staging local builds, setting `-DCMAKE_INSTALL_PREFIX=install` places output files in a local directory.

## Option compatibility matrix

| Option combination | Supported | Notes |
| :--- | :--- | :--- |
| `ANYPS5_RELINKER_ONLY=ON` + macOS | Yes | Verified configuration on Apple silicon and Intel macOS. |
| `ANYPS5_RELINKER_ONLY=OFF` + macOS | No | Full runtime libraries require Linux or Windows kernel and display backends. |
| `ANYPS5_BUILD_WASM=ON` + native compiler | No | Fails configuration. Must be invoked via `emcmake cmake`. |
| `ANYPS5_ENABLE_ASAN=ON` + Windows | No | AddressSanitizer guest arena adjustments are implemented for Linux memory layouts only. |
| `ANYPS5_USE_SYSTEM_DEPS=ON` + Windows | No | Windows builds must use the pinned submodules in `3rdparty/`. |
