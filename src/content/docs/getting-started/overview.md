---
title: What AnyPS5 is and what it is not
description: Definition, scope, and technical principles of the AnyPS5 binary conversion and runtime project.
---

AnyPS5 is a static binary conversion and runtime tool that ports PlayStation 5 executables to run natively on Linux and Windows. It provides a command-line relinker that converts target binaries into the host operating system's native executable format, together with clean-room implementations of PlayStation 5 system PRX libraries suitable for dynamic linking.

## What AnyPS5 is

AnyPS5 converts compiled PlayStation 5 x86-64 code so that the host operating system kernel and dynamic loader execute it directly.

- A static relinker (`core/relinker`) that parses PlayStation 5 ELF executables, resolves imported symbol hashes (NIDs), rewrites relocations, and outputs native Linux ELF binaries, Windows Portable Executable (PE) binaries, or macOS Mach-O binaries.
- A collection of host runtime dynamic libraries (`core/libs/prx`) that reimplement PlayStation 5 system libraries (such as `libkernel`, `libc`, `libScePad`, and `libSceAudioOut`) using host APIs including POSIX threads, Win32, SDL2, and Vulkan.
- A GPU shader recompiler (`core/shader/recompiler`) that translates AMD RDNA2 GPU shader machine code into standard Vulkan SPIR-V.
- An in-browser WebAssembly converter (`demo/web`) that converts titles on client machines without transferring files across the network.

## What AnyPS5 is not

AnyPS5 does not use traditional emulation techniques.

- It is not a CPU emulator. The host CPU executes guest instructions directly. Because PlayStation 5 binaries compile for an AMD Zen 2 CPU, the host processor must support the instruction set extensions used by the binary, including AVX2, FMA, F16C, BMI1, BMI2, LZCNT, and MOVBE.
- It is not a virtual machine or hypervisor. Converted executables run inside regular operating system processes, subject to standard host memory management and security policies.
- It is not a decryption or jailbreak tool. AnyPS5 requires clean, unencrypted ELF binaries. It does not dump or decrypt commercial packages, and it does not contain or require proprietary firmware files or cryptographic keys.
- It is not affiliated with Sony Interactive Entertainment. "PlayStation" and "PS5" are trademarks of Sony Interactive Entertainment Inc.

## Strict failure model

The codebase follows a strict failure policy. When the runtime or relinker encounters an unexpected state, missing export, or invalid input data, it does not invent fallback values or attempt to continue in an undefined state.

The code throws `std::runtime_error`. The runtime prints the error message from `what()` to stderr and the process terminates immediately.
