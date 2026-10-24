---
title: Frequently asked questions
description: Answers to common technical questions about AnyPS5 architecture, platform support, and usage.
---

### Is AnyPS5 an emulator?

No. AnyPS5 does not interpret guest machine instructions or run a virtual machine. It converts the executable container into a native operating system binary (Linux ELF, Windows PE, or macOS Mach-O). The host CPU executes game instructions directly. System calls and console services link against native reimplementations of PlayStation 5 PRX libraries.

### Can games run on macOS?

No. The relinker tool compiles and runs on macOS (both Intel and Apple Silicon), allowing users to convert executables on macOS. AnyPS5 does not provide runtime PRX system libraries or graphics presentation runners for macOS. Converted games execute only on Linux and Windows.

### How does the web converter protect file privacy?

The web converter executes locally inside the browser using WebAssembly (`relinker_wasm.mjs`) in a Web Worker. Input archives and executables are inspected, converted, and packaged entirely on your machine. No game files or executable binaries are uploaded to any server.

### What do the progress badges measure?

The library progress percentage measures the proportion of declared functions in `core/libs/prx` that have non-stub implementations. It does not measure total coverage of every PlayStation 5 system function. The denominator increases as new functions are discovered and declared.

### Why does AnyPS5 terminate on missing functions?

AnyPS5 follows a strict failure model. An unimplemented export calls `NotImplemented_nid_no_patch`, which throws `std::runtime_error`. The runtime prints the message to stderr and halts execution. This prevents games from continuing in corrupted or undefined states.

### What host CPU extensions are required?

The host CPU must support the x86-64 extensions used by PlayStation 5 Zen 2 software: AVX2, FMA, F16C, BMI1, BMI2, LZCNT, and MOVBE. If any required extension is missing, the application halts at startup and prints the missing flags.

For Intel processors, pass `--to-intel` to the relinker to convert AMD-specific instructions.

### Where is game compatibility tracked?

Per-game test reports, logs, and open issues are tracked in the GitHub Discussions forum under the "Game bring-up" category, with one dedicated thread per title ID.

### How are controllers configured?

AnyPS5 supports standard controllers recognized by SDL2. Sticks and analog triggers pass through automatically. Keyboard and mouse controls can be customized by placing an `anyps5-input.ini` file beside the generated executable.
