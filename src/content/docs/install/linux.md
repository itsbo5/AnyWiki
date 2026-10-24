---
title: Linux setup and run
description: How to build AnyPS5, convert executables, and run PlayStation 5 titles on Linux.
---

import { Steps, FileTree, Aside } from '@astrojs/starlight/components';

AnyPS5 on Linux supports the complete pipeline: building the relinker tool, compiling host PRX runtime libraries, converting executables to Linux ELF binaries, and executing converted titles natively.

<Aside type="note">
This page was verified from the build configuration, source code, and continuous integration workflows, not by running commands on a live Linux system.
</Aside>

## Prerequisites

Install required build tools and header packages for your distribution:

### Ubuntu and Debian

```sh
sudo apt update
sudo apt install -y \
    build-essential gcc g++ cmake ninja-build git python3 \
    libx11-dev libxext-dev libxrandr-dev \
    libwayland-dev libxkbcommon-dev libegl-dev libdecor-0-dev \
    libpipewire-0.3-dev libpulse-dev libasound2-dev
```

### Fedora

```sh
sudo dnf install -y \
    gcc gcc-c++ cmake ninja-build git python3 \
    libX11-devel libXext-devel libXrandr-devel \
    wayland-devel libxkbcommon-devel mesa-libEGL-devel libdecor-devel \
    pipewire-devel pulseaudio-libs-devel alsa-lib-devel \
    glslang SPIRV-tools \
    glibc-static libstdc++-static
```

If CMake on Fedora reports `Could NOT find Threads`, ensure `glibc-static` and `libstdc++-static` are installed.

### Kernel device permissions for udmabuf

When using Mesa Vulkan drivers (RADV or ANV), AnyPS5 shares direct GPU memory buffers through `/dev/udmabuf`. The user executing the game must have read and write permissions for this device.

Most distributions set ownership of `/dev/udmabuf` to `root:kvm` with mode `0660`. Add your user account to the `kvm` group:

```sh
sudo usermod -aG kvm $USER
```

Log out and log back in to apply group changes.

## Clone the repository

Clone the AnyPS5 repository with all third-party submodules:

```sh
git clone --recursive https://github.com/boykopovar/AnyPS5.git
cd AnyPS5
```

If submodules were not initialized during cloning, initialize them:

```sh
git submodule update --init --recursive
```

## Configure and build

<Steps>

1. ### Configure the build directory

   Generate the build files using CMake and Ninja:

   ```sh
   cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release
   ```

2. ### Compile the relinker and runtime libraries

   Build the main targets, followed by the explicit `libs` target:

   ```sh
   cmake --build build --parallel
   cmake --build build --target libs --parallel
   ```

   Compilation outputs are placed in:
   - Relinker binary: `build/core/relinker/relinker`
   - Host runtime libraries: `build/core/libs/libs/*.prx`

</Steps>

## Worked conversion example

Convert a PlayStation 5 ELF executable to a native Linux ELF binary:

```sh
./build/core/relinker/relinker source/input.elf app.elf
```

The relinker converts `source/input.elf` into `app.elf` and places converted guest modules under `app0/sce_module/`.

### Runtime folder layout

Arrange the runtime directory beside the output executable:

<FileTree>
- game-directory/
  - app.elf
  - libs/
    - libkernel.prx
    - libc.prx
    - libSceAgcDriver.prx
    - libSceVideoOut.prx
    - libSceAudioOut.prx
    - libScePad.prx
  - app0/
    - eboot.bin (original binary)
    - sce_sys/
      - param.json
    - sce_module/
      - <converted guest modules printed by the relinker>
</FileTree>

Copy the built system libraries from `build/core/libs/libs/*.prx` into `libs/`.

## Running the application

Ensure the generated binary has execute permissions, then launch it:

```sh
chmod +x app.elf
./app.elf
```

A successful launch logs CPU capabilities, initializes the Vulkan surface, and runs the title:

```text
[cpu] Host CPU: AMD Ryzen 9 7950X 16-Core Processor
[gpu] Physical device candidate: AMD Radeon RX 7900 XTX (RADV NAVI31)
[gpu] Surface format: VK_FORMAT_B8G8R8A8_UNORM
```

## Common Linux errors

### Permission denied on udmabuf

```text
[gpu] open /dev/udmabuf: Permission denied
```

Cause: The executing user account does not have read-write access to `/dev/udmabuf`. Without this permission, GPU memory ranges are copied rather than imported, leading to stores failing with `BDA access failed`. Add your user to the `kvm` group (`sudo usermod -aG kvm $USER`) and log in again.

### Permission denied when executing auxiliary binaries

```text
sceSystemServiceLoadExec: execv failed: Permission denied
```

Cause: A title launched a secondary executable (such as a launcher or setup tool) that lost its executable file permission bit. Run `chmod +x` on every binary in `app0/`.

### CMake error: SDL has no XRandR support

```text
CMake Error at CMakeLists.txt:
  SDL has no XRandR support, so X11 display refresh rates cannot be queried.
```

Cause: Missing XRandR development files. Install `libxrandr-dev` on Debian/Ubuntu or `libXrandr-devel` on Fedora, then rerun configuration.

### CMake error: SDL found no audio development files

```text
CMake Error at CMakeLists.txt:
  SDL found no PipeWire, PulseAudio or ALSA development files, so audio output would be silent.
```

Cause: None of the supported Linux audio backends were detected. Install `libpipewire-0.3-dev`, `libpulse-dev`, or `libasound2-dev` on Debian/Ubuntu, or `pipewire-devel`, `pulseaudio-libs-devel`, or `alsa-lib-devel` on Fedora.
