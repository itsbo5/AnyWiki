---
title: Debugging tips
description: Built-in diagnostic tools, call tracing, crash inspection, and GPU pipeline profiling in AnyPS5.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 provides built-in tracing, telemetry, and crash diagnostic mechanisms to debug applications without attaching external debuggers.

## Tracing system library calls

To identify which functions a game executes before an abort or crash:

1. Relink the binary with import tracing enabled:
   ```sh
   relinker --trace-imports source/input.elf app.elf
   ```
2. Set the `APS5_TRACE_CALLS` environment variable to a comma-separated list of libraries, or `all`:
   ```sh
   APS5_TRACE_CALLS=libkernel,libSceSaveData ./app.elf
   ```

When an abort occurs, the runtime outputs:
- The last 64 system library calls across all threads, showing the thread ID, target PRX, imported NID, and caller address.
- The last 32 calls made specifically by the faulting thread.
- The 32 most frequently called imports since startup.

```text
last traced system library calls (APS5_TRACE_CALLS):
  #1 thread 9384 libkernel.prx k+AXqu2-eBc from 0x0000000140010006 app.exe+0x10006
last traced calls of thread 9384:
  #1 libkernel.prx k+AXqu2-eBc from 0x0000000140010006 app.exe+0x10006
most called traced imports (1 calls in total):
             1 libkernel.prx k+AXqu2-eBc
```

## Windows crash diagnostics

When an unhandled exception or abort occurs on Windows, AnyPS5 generates a diagnostic memory report:

- **Indirect memory targets**: Set `APS5_CRASH_INDIRECT_MEMORY=1` to dump up to 64 bytes from each memory pointer discovered in CPU registers.
- **Stack words**: Set `APS5_CRASH_STACK_BYTES=4096` to inspect stack words above `rsp` and scan for return address candidates.
- **Thread frames**: The crash report enumerates all running threads, printing their instruction pointers (`rip`), stack pointers (`rsp`), base pointers (`rbp`), and return address candidates.

## GPU submission rings and stall dumps

When debugging GPU command stream hangs:

- **Submission ring buffer**: Set `APS5_PM4_RING=64` (valid values: 0 to 4096) to retain the last `n` PM4 command buffer submissions per queue. When an exception or timeout occurs, the runtime dumps decoded packet contents to stderr.
- **Watchdog timer**: Set `APS5_STALL_WATCHDOG_SECS=10` to configure a queue stall watchdog. If a queue waits without progress for the specified seconds, it outputs the command ring buffer while keeping the process running.
- **Forced result writeback**: If rendering shows stale buffers or race conditions between CPU reads and GPU writes, launch with `APS5_STORE_AT_FLIP=1` (writes back pending storage images on display flip) or `APS5_STORE_AT_LABEL=1` (writes back results before GPU label writes).

## On-screen performance overlay

Press **F10** during execution, or launch with `ANYPS5_OVERLAY=1`, to display the built-in diagnostic overlay:

- **Position**: Set `ANYPS5_OVERLAY_POS=tl` (top-left, default), `tr` (top-right), `bl` (bottom-left), or `br` (bottom-right).
- **Displayed metrics**: Current FPS, frame time history graph (last 120 frames), minimum/average/maximum frame times, GPU execution time, draw and dispatch packet counts, newly compiled pipeline counts, VRAM usage from `VK_EXT_memory_budget`, and private process RAM usage.
- **GPU timestamp profiling**: Set `APS5_PROFILE_GPU=1` to inject timestamp queries across GPU command batches, populating the `GPU` time field on the overlay.
- **Worker profiling**: Set `APS5_PROFILE_DRAW=1` to track thread time spent inside packet workers, populating the `DRIVER` field on the overlay.
