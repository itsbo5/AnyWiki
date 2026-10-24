---
title: System calls
description: How the AnyPS5 relinker scans, validates, and traps FreeBSD system calls.
---

PlayStation 5 software runs on a modified FreeBSD-derived operating system kernel (often designated as Prospero or Orbis). While system libraries handle high-level tasks, some binaries and low-level runtime modules issue direct kernel instructions. AnyPS5 enforces strict verification of direct system call instructions during relinking.

## The system call incompatibility problem

On x86-64 architectures, operating system system calls are triggered by the machine instructions:

- `syscall` (`0x0F 0x05`)
- `sysenter` (`0x0F 0x34`)
- `int 0x80` (`0xCD 0x80`)

Direct system call instructions cannot execute across different host operating systems:

- **Syscall number mismatch**: Syscall registers (`rax`) map to entirely different kernel operations between FreeBSD, Linux, and Windows NT.
- **Calling conventions**: Argument registers and kernel scratch registers differ. On Windows, executing a FreeBSD `syscall` directly corrupts processor register state and triggers access violations or unhandled exceptions.
- **Kernel interface divergence**: Structures passed by reference (such as `struct stat`, `struct kevent`, or socket address buffers) have layout differences between kernels.

AnyPS5 applications must interact with host operating systems exclusively through host dynamic libraries (`libs/*.prx`), which translate guest semantics to native Linux or Windows API calls.

## Relinker syscall scanning

During conversion, the relinker inspects executable code segments to identify direct system call instructions:

1. **Instruction disassembly**: The relinker disassembles executable bytes in `PT_LOAD` segments.
2. **Unwind table scoping**: In binaries with `PT_SCE_DYNLIBDATA` sections, code and read-only data are interleaved. The relinker uses exception unwind tables (`.eh_frame`) to identify function boundaries, avoiding false positives in static data tables that happen to match opcode byte patterns.
3. **Rejection on discovery**: If an unhandled `syscall`, `sysenter`, or `int 0x80` opcode is found within an active code path, the relinker halts conversion with exit code `2`.

## Handling SDK and homebrew stubs

Certain homebrew titles compiled with `ps5-payload-dev` or specific SDK runtimes bundle generic numbered syscall stubs or inline `mman.c` memory helpers. Many of these wrappers are never invoked by the application code, but their presence in binary sections normally causes the relinker to reject the image.

### The `--trap-sdk-syscall-stubs` flag

For debugging and homebrew analysis, the relinker provides the `--trap-sdk-syscall-stubs` flag:

- **Exact pattern matching**: The relinker scans for verified byte patterns corresponding to `ps5-payload-dev` numbered wrappers and standard SDK inline `mmap`/`mprotect` sequences.
- **Trapping with `UD2`**: When an exact match is detected, the relinker replaces the two-byte `syscall` instruction (`0x0F 0x05`) with the `UD2` machine instruction (`0x0F 0x0B`).
- **Runtime protection**: If the application never calls the wrapper, execution continues without error. If the trapped path is called at runtime, the processor immediately raises an illegal instruction signal (`SIGILL` or `EXCEPTION_ILLEGAL_INSTRUCTION`) rather than issuing an invalid kernel call to the host.

### Deprecated flags

The `--skip-syscall-check` option disables all syscall scanning across both the main executable and bundled modules. This flag is deprecated:

- It leaves raw FreeBSD syscall instructions inside the output binary.
- If executed on Linux or Windows, the host kernel interprets the registers arbitrarily, causing immediate crashes or silent data corruption.
- It is retained strictly for local relinker pipeline diagnostics.
