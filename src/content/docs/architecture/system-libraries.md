---
title: System libraries
description: Declaration syntax, NID hashing, calling convention bridging, and implementation states in PRX libraries.
---

import { Aside } from '@astrojs/starlight/components';

PlayStation 5 applications execute system tasks through dynamic PRX libraries. AnyPS5 reimplements these libraries in `core/libs/prx/` using standard C++20 and host operating system APIs.

## Library organization

Each system library resides in a dedicated directory under `core/libs/prx/` (for example, `core/libs/prx/libScePad/`). A typical library directory contains:

- `CMakeLists.txt`: Configures the target and defines whether the library compiles as a shared library (`EXCLUDE_FROM_ALL`) under the `libs` CMake target.
- `Export.cpp`: Contains the public export declarations and function bodies.
- Implementation files: Internal logic mapping PlayStation 5 calls to host APIs (such as SDL2, Vulkan, or POSIX threading).

## Function declaration syntax

Public functions are defined using the `APS5_VABI` macro:

```cpp
APS5_VABI int scePadInit() {
    // Implementation body
    return 0;
}
```

For functions where the C++ identifier differs from the exported symbol or NID, the `APS5_EXPORT` macro maps the symbol explicitly:

```cpp
APS5_EXPORT("OlftfYofqMI", sceKernelCreateThread)
```

Internal helper functions that must not be registered as exported NID symbols are suffixed with `_nid_no_patch` or `_nid_no_patch_cut`.

## Calling convention bridging

PlayStation 5 applications compile for the System V AMD64 ABI. In this convention, integer and pointer arguments pass in `rdi`, `rsi`, `rdx`, `rcx`, `r8`, and `r9`.

- On Linux and macOS: The host operating system uses the System V AMD64 ABI. `APS5_VABI` is defined as empty in `core/libs/prx/libc/include/general/VabiMacros.hpp`.
- On Windows: The native toolchain uses the Microsoft x64 calling convention (`rcx`, `rdx`, `r8`, `r9`). `APS5_VABI` is defined as `__attribute__((sysv_abi))`. This directs GCC to generate function prologues and epilogues that preserve and restore registers according to the System V standard.

## NID resolution and hashing

PlayStation 5 dynamic linkers identify exported and imported symbols using 11-character alphanumeric strings known as NIDs (Numeric Identifiers).

The NID generation algorithm hashes the symbol name using SHA-1:

```text
NID = Base64URL_11Chars( ReverseBytes_8( SHA1( symbol_name + SALT )[0..7] ) )
```

The salt is a fixed 16-byte array:

```text
0x51, 0x8D, 0x64, 0xA6, 0x35, 0xDE, 0xD8, 0xC1,
0xE6, 0xB0, 0x39, 0xB1, 0xC3, 0xE5, 0x52, 0x30
```

The first 8 bytes of the SHA-1 digest are byte-reversed and encoded using a 64-character alphabet (`A-Z`, `a-z`, `0-9`, `+`, `-`), producing an 11-character identifier (for example, `OlftfYofqMI` for `sceKernelCreateThread`).

## Implementation states

Functions in AnyPS5 exist in one of three states:

### Implemented

The function provides complete or functional handling of console behavior mapped to host APIs. It handles all valid parameter ranges without assuming hardcoded values seen in a single title's execution trace.

### Inert (silent stubs)

An implemented export whose body consists of an empty return, a constant return, or discarded parameters. Inert stubs are permitted only when required to unblock title progress through UI initialization, and must be logged under "Silent stubs" in the library's technical debt file (`docs/dev/debt/<library>.md`).

### Stub (unimplemented)

The function calls `NotImplemented_nid_no_patch(__func__)`:

```cpp
APS5_VABI int sceAudioOutSetSparkControl() {
    NotImplemented_nid_no_patch(__func__);
}
```

When an application invokes an unimplemented stub, the runtime throws `std::runtime_error`, outputs the failing symbol to stderr, and halts execution immediately.

## Adding a new function

To declare and implement a new system export:

1. Identify the library exporting the symbol (for example, `core/libs/prx/libSceAudioOut/Export.cpp`).
2. Add the function declaration using `APS5_VABI`.
3. If the general behavior is known, implement it fully using standard C++20 and host facilities.
4. If the behavior is unknown, call `NotImplemented_nid_no_patch(__func__)` and log the gap in `docs/dev/debt/<library>.md`.
5. Run the conventions checker before committing:
   ```sh
   python3 tools/check_conventions.py --base origin/main
   ```
