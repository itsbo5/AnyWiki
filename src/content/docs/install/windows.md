---
title: Windows setup and run
description: How to build AnyPS5, convert executables, and run PlayStation 5 titles on Windows.
---

import { Steps, FileTree, Aside } from '@astrojs/starlight/components';

AnyPS5 on Windows supports building the relinker, compiling the host PRX runtime libraries, converting executables to Windows PE format, and executing converted titles natively.

<Aside type="note">
This page was verified by running commands on Windows 11 with WinLibs GCC 15.2.0 and Ninja against upstream commit `5b65588957f8b2020adb1f264a3d9408c997297f`.
</Aside>

## Prerequisites

Install the following software before configuring the project:

- Operating system: 64-bit Windows 10 or Windows 11.
- C++ toolchain: WinLibs MinGW-w64 GCC 15.2.0 (`x86_64-ucrt-posix-seh`, release `15.2.0posix-14.0.0-ucrt-r7`) or MSYS2 UCRT64 GCC (`mingw-w64-ucrt-x86_64-gcc`). The compiler must support DWARF or SEH exceptions for System V calling convention functions. Scoop standalone GCC is unsupported because it lacks System V catch handlers.
- CMake: version 3.22.1 or newer.
- Ninja: build system.
- Git for Windows: full installation with Bash (`C:\Program Files\Git\bin\bash.exe`) required for generating libusb version headers.
- Python: version 3.9 or newer.

## Clone the repository

Clone the AnyPS5 repository with all third-party submodules:

```powershell
git clone --recursive https://github.com/boykopovar/AnyPS5.git
cd AnyPS5
```

If you already cloned without submodules, initialize them:

```powershell
git submodule update --init --recursive
```

## Configure and build

<Steps>

1. ### Set environment paths

   Prepend the MinGW-w64 toolchain and Git paths to your PowerShell session `PATH`:

   ```powershell
   $env:PATH = "C:\tools\winlibs\mingw64\bin;C:\Program Files\Git\cmd;C:\Program Files\Git\usr\bin;$env:PATH"
   ```

2. ### Configure the build tree

   Run CMake with the Ninja generator, targeting a Release build:

   ```powershell
   cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++
   ```

   If CMake does not detect your Python installation automatically, specify the interpreter:

   ```powershell
   cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++ -DPython3_EXECUTABLE="C:/Program Files/Python312/python.exe"
   ```

3. ### Compile the relinker and runtime libraries

   Build the main targets, then explicitly build the `libs` target:

   ```powershell
   cmake --build build --parallel
   cmake --build build --target libs --parallel
   ```

   The built files are placed in:
   - Relinker executable: `build\core\relinker\relinker.exe`
   - Host runtime libraries: `build\core\libs\libs\*.prx`

4. ### Copy compiler runtime libraries

   Copy the required MinGW runtime DLLs beside the compiled PRX libraries:

   ```powershell
   $toolchainBin = "C:\tools\winlibs\mingw64\bin"
   foreach ($name in @("libgcc_s_seh-1.dll", "libstdc++-6.dll", "libwinpthread-1.dll")) {
       Copy-Item -LiteralPath (Join-Path $toolchainBin $name) -Destination "build\core\libs\libs"
   }
   ```

</Steps>

## Worked conversion example

Convert a title using the compiled relinker:

```powershell
.\build\core\relinker\relinker.exe --windows source\input.elf app.exe
```

Add `--to-intel` if running on an Intel processor.

### Runtime folder layout

Arrange the converted files, host libraries, and application assets as follows:

<FileTree>
- game-directory/
  - app.exe
  - libs/
    - libkernel.prx
    - libc.prx
    - libSceAgcDriver.prx
    - libSceVideoOut.prx
    - libSceAudioOut.prx
    - libScePad.prx
    - libgcc_s_seh-1.dll
    - libstdc++-6.dll
    - libwinpthread-1.dll
    - mimalloc.dll (optional)
    - mimalloc-redirect.dll (optional)
  - app0/
    - eboot.bin (original binary)
    - sce_sys/
      - param.json
    - sce_module/
      - <converted guest modules printed by the relinker>
</FileTree>

## Running the application

Launch the application from PowerShell:

```powershell
.\app.exe
```

A successful startup displays the detected host CPU extensions, initializes Vulkan physical devices, creates a swapchain surface, and begins processing frame submissions:

```text
[cpu] Host CPU: AMD Ryzen 7 7800X3D 8-Core Processor
[gpu] Physical device candidate: NVIDIA GeForce RTX 4080
[gpu] Surface format: VK_FORMAT_B8G8R8A8_UNORM
```

## Common Windows errors

### System error 126 (module not found)

```text
LoadLibrary failed with error 126
```

Cause: `libs/` lacks the MinGW runtime DLLs (`libgcc_s_seh-1.dll`, `libstdc++-6.dll`, or `libwinpthread-1.dll`). Windows does not search system `PATH` for dependencies loaded by PRX libraries. Copy these files from your MinGW toolchain `bin/` directory into `libs/`.

### System error 193 (not a valid Win32 application)

```text
LoadLibrary failed with error 193
```

Cause: An unconverted PlayStation 5 ELF `.prx` module was placed in `libs/`. Windows attempts to load it as a native PE dynamic library. Only AnyPS5 host libraries belong in `libs/`. Converted game modules belong in `app0/sce_module/`.

### Direct memory allocation failure

```text
FAIL: replace guest placeholder with resident direct memory
```

Cause: Windows committed memory limit exceeded. PlayStation 5 direct memory maps up to 13,824 MiB at launch. Enlarge your Windows system pagefile in Advanced System Settings to accommodate the requested direct memory.

### Crash during Vulkan adapter enumeration

If the application crashes before presenting a window and the system has Mesa Dozen installed via the Windows OpenCL/OpenGL/Vulkan Compatibility Pack, disable Dozen for the current session:

```powershell
$env:VK_LOADER_DRIVERS_DISABLE = '*dzn*'
.\app.exe
```
