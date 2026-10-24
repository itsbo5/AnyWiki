---
title: macOS setup and conversion
description: How to build the AnyPS5 relinker and convert executables on macOS and Apple Silicon.
---

import { Steps, FileTree, Aside } from '@astrojs/starlight/components';

The macOS build produces the offline relinker tool only. Converted PlayStation 5 applications cannot execute on macOS because AnyPS5 does not build or ship host PRX runtime libraries, audio drivers, or Vulkan graphics presentation backends for macOS. You can use macOS (both Apple Silicon and Intel) to convert PlayStation 5 executables into Linux ELF, Windows PE, or macOS Mach-O binaries for inspection and deployment to supported hosts.

<Aside type="note">
This page was verified from the build configuration, source code, and continuous integration workflows, not by running commands on a live macOS system.
</Aside>

## Prerequisites

Install the required command-line tools:

- Operating system: macOS 13 or newer (tested on macOS 14 and 15 in CI).
- AppleClang compiler: installed via Xcode Command Line Tools (`xcode-select --install`).
- CMake: version 3.22.1 or newer (available via Homebrew: `brew install cmake`).
- Ninja: build tool (available via Homebrew: `brew install ninja`).
- Python: version 3.9 or newer (for relinker test registration).

On Apple Silicon Macs, ensure Rosetta 2 is installed if testing x86-64 binaries:

```sh
softwareupdate --install-rosetta --agree-to-license
```

## Clone the repository

Clone the AnyPS5 repository:

```sh
git clone https://github.com/boykopovar/AnyPS5.git
cd AnyPS5
```

Initializing third-party submodules is not required for the relinker-only build.

## Configure and build

The relinker-only mode builds the conversion tool and its automated test suite without configuring SDL2, Vulkan, FFmpeg, or the shader recompiler.

<Steps>

1. ### Configure the relinker build

   Generate build files with `-DANYPS5_RELINKER_ONLY=ON`:

   ```sh
   cmake -S . -B build-relinker -G Ninja \
       -DCMAKE_BUILD_TYPE=Release \
       -DANYPS5_RELINKER_ONLY=ON \
       -DBUILD_TESTING=ON
   ```

2. ### Compile the relinker executable

   Build the relinker binary using Ninja:

   ```sh
   cmake --build build-relinker --parallel
   ```

   The compiled binary is placed at:
   - `build-relinker/core/relinker/relinker`

3. ### Run the relinker test suite

   Verify the compiled relinker:

   ```sh
   ctest --test-dir build-relinker --output-on-failure
   ```

</Steps>

## Worked conversion example

To convert a PlayStation 5 ELF executable to an x86-64 Mach-O binary suitable for execution under Rosetta 2 on Apple Silicon:

```sh
./build-relinker/core/relinker/relinker --macos --to-rosetta source/input.elf eboot
```

To convert a title for deployment to Linux or Windows hosts:

```sh
# Convert to Linux ELF
./build-relinker/core/relinker/relinker source/input.elf app.elf

# Convert to Windows PE (.exe)
./build-relinker/core/relinker/relinker --windows source/input.elf app.exe
```

### Conversion output structure

The relinker produces the main executable and translates bundled guest modules:

<FileTree>
- output-directory/
  - eboot (Mach-O binary)
  - app0/
    - sce_module/
      - <converted Mach-O guest libraries>
</FileTree>

Verify the resulting binary format using the `file` command:

```sh
file eboot
```

Expected output:

```text
eboot: Mach-O 64-bit x86_64 executable
```

## Common macOS errors

### Attempting a full build on Apple Silicon

```text
CMake Error at CMakeLists.txt:
  The full build on macOS is x86-64 only; configure without CMAKE_OSX_ARCHITECTURES or set it to x86_64
```

Cause: Attempting to build the complete runtime on macOS without the `-DANYPS5_RELINKER_ONLY=ON` flag. The full runtime does not support macOS. Add `-DANYPS5_RELINKER_ONLY=ON` to your CMake configure command.

### Flag conflict between Rosetta and Windows

```text
FAIL: --to-rosetta conflicts with --windows
```

Cause: Combining `--to-rosetta` with `--windows`. The `--to-rosetta` flag lowers instructions specifically for the Rosetta 2 translator on macOS. For Windows targets, use `--to-intel` instead.

### Missing Python during configuration

```text
-- Could NOT find Python3 (missing: Python3_EXECUTABLE Interpreter)
```

Cause: CMake could not detect a Python 3 interpreter. While the relinker compiles without Python, regression tests will not be registered. Pass the interpreter path explicitly: `-DPython3_EXECUTABLE=$(which python3)`.
