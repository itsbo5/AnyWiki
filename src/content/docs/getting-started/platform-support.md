---
title: Platform support matrix
description: Capabilities and requirements across Windows, Linux, and macOS for building, converting, and running AnyPS5.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 supports different stages of the conversion and execution pipeline depending on the host operating system and hardware architecture.

## Capability matrix

The following table summarizes platform capabilities confirmed in the source code and build workflows:

| Capability | Windows (x86-64) | Linux (x86-64) | macOS (Intel / Apple Silicon) |
| :--- | :--- | :--- | :--- |
| Build relinker CLI | Supported | Supported | Supported |
| Build system runtime libraries | Supported | Supported | Unsupported |
| Convert to Linux ELF | Supported | Supported | Supported |
| Convert to Windows PE (`.exe`) | Supported | Supported | Supported |
| Convert to macOS Mach-O | Supported | Supported | Supported |
| Execute converted applications | Supported | Supported | Unsupported |
| In-browser WebAssembly converter | Supported | Supported | Supported |

<Aside type="caution">
macOS supports building and running the offline relinker tool only. AnyPS5 does not build or ship precompiled PRX system libraries or graphics presentation runners for macOS. Converted games cannot execute on macOS.
</Aside>

## Hardware requirements

Running a converted game requires hardware that meets the architectural assumptions of the original executable and the Vulkan renderer.

### CPU requirements

The host processor must be an x86-64 CPU supporting the instruction set extensions present on the PlayStation 5 AMD Zen 2 processor:

- AVX2 (Advanced Vector Extensions 2)
- FMA (Fused Multiply-Add)
- F16C (Half-precision floating-point conversion)
- BMI1 and BMI2 (Bit Manipulation Instruction Sets 1 and 2)
- LZCNT (Leading Zero Count)
- MOVBE (Move to/from Big-Endian)

At startup, the runtime checks the CPU features via CPUID. If a required extension is missing, the program stops immediately and prints the missing flags to stderr.

When converting for an Intel host, use the `--to-intel` relinker flag to translate AMD-specific instructions.

### GPU requirements

The graphics pipeline requires a dedicated or integrated GPU supporting:

- Vulkan 1.1 or newer
- Independent graphics and compute queues
- Vulkan swapchain presentation
- Extension `VK_EXT_memory_budget` for texture cache budgeting
- Extension `VK_EXT_swapchain_colorspace` and `VK_EXT_hdr_metadata` for HDR10 presentation (Windows only)

On Linux, direct GPU memory sharing via `/dev/udmabuf` requires user membership in the `kvm` group when using open-source drivers (Mesa RADV or ANV).
