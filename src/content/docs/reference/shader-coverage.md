---
title: Shader recompiler coverage
description: Complete breakdown of the 1,166 RDNA2 shader opcodes recompiled to SPIR-V in AnyPS5.
---

AnyPS5 includes an ahead-of-time shader recompiler that translates AMD RDNA2 GPU machine instructions into standard SPIR-V 1.3/1.5 bytecode for execution on host Vulkan drivers.

## Coverage overview

The shader recompiler tracks 1,166 documented RDNA2 machine instruction encodings defined in `tools/rdna_isa.txt`. As of upstream commit `5b65588`, all 1,166 opcodes are implemented in the recompiler code generator:

- **Total defined opcodes**: 1,166
- **Implemented opcodes**: 1,166
- **Completion rate**: 100.0%

## Breakdown by instruction encoding category

The table below details opcode distribution across all 20 RDNA2 instruction formats.

| Encoding format | Description | Implemented | Total | Coverage |
| :--- | :--- | :--- | :--- | :--- |
| `DS` | Local Data Share (LDS) read, write, and atomic instructions | 123 | 123 | 100% |
| `EXP` | Export vertex, position, parameter, and color data to hardware buffers | 1 | 1 | 100% |
| `FLAT` | Memory access resolving to flat, scratch, or global addresses | 54 | 54 | 100% |
| `GLOBAL` | Direct global memory load, store, and atomic operations | 57 | 57 | 100% |
| `MIMG` | Mapped image load, sample, gather, and texture query instructions | 130 | 130 | 100% |
| `MTBUF` | Typed memory buffer formatted read and write instructions | 16 | 16 | 100% |
| `MUBUF` | Untyped memory buffer loads, stores, and format conversions | 75 | 75 | 100% |
| `SCRATCH` | Thread-private scratchpad memory load and store instructions | 22 | 22 | 100% |
| `SMEM` | Scalar memory read and buffer cache operations | 20 | 20 | 100% |
| `SOP1` | Scalar ALU operations with one source operand | 65 | 65 | 100% |
| `SOP2` | Scalar ALU operations with two source operands | 51 | 51 | 100% |
| `SOPC` | Scalar comparison operations setting the execution condition mask | 18 | 18 | 100% |
| `SOPK` | Scalar ALU operations with an embedded 16-bit signed immediate | 27 | 27 | 100% |
| `SOPP` | Scalar control flow, conditional branches, synchronization, and barriers | 37 | 37 | 100% |
| `VINTRP` | Vector parameter interpolation for fragment shader inputs | 3 | 3 | 100% |
| `VOP1` | Vector ALU operations with one source operand | 81 | 81 | 100% |
| `VOP2` | Vector ALU operations with two source operands | 51 | 51 | 100% |
| `VOP3` | Vector ALU operations with three source operands and input modifiers | 116 | 116 | 100% |
| `VOP3P` | Vector packed operations including 16-bit dual math and dot products | 29 | 29 | 100% |
| `VOPC` | Vector comparison operations producing 64-bit lane mask outputs | 190 | 190 | 100% |

## Special and composite instructions

In addition to base ISA opcodes, the recompiler handles 24 composite and hardware-specific instruction patterns:

- Vector arithmetic variants: `VAddI32`, `VSubI32`, `VMulLoI32`, `VSubrevI32`.
- Data Share secondary source operations: `DsAddSrc2U32`, `DsSubSrc2U32`, `DsRsubSrc2U32`, `DsIncSrc2U32`, `DsDecSrc2U32`, `DsMinSrc2I32`, `DsMaxSrc2I32`, `DsMinSrc2U32`, `DsMaxSrc2U32`, `DsAndSrc2B32`, `DsOrSrc2B32`, `DsXorSrc2B32`, `DsWriteSrc2B32`, `DsMinSrc2F32`, `DsMaxSrc2F32`, `DsAddSrc2F32`.
- Scalar debug branching and cache control: `SCbranchCdbg`, `SDcacheWb`, `SDcacheDiscard`, `SDcacheDiscardX2`.

## Verification on hardware

While opcode support is complete according to specification definitions, instruction behavior under edge conditions (such as denormalized floats, divide-by-zero flags, and out-of-bounds texture fetches) continues to be refined using hardware measurements:

- The [hardware oracle](https://github.com/boykopovar/AnyPS5/blob/main/docs/dev/HW_ORACLE.md) captures execution results on physical RDNA2 silicon.
- Vulkan validation layers (`VK_LAYER_KHRONOS_validation`) verify that emitted SPIR-V modules produce no validation violations (`VUID` errors) on host drivers.
