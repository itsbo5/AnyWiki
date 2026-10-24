---
title: Progress metrics
description: How to interpret AnyPS5 library and shader recompiler progress metrics accurately.
---

import { Aside, Card, CardGrid } from '@astrojs/starlight/components';

AnyPS5 publishes automated progress badges and visual coverage maps on its project site. Understanding how these metrics are calculated prevents common misconceptions about system coverage and game compatibility.

<CardGrid>
  <Card title="Live progress dashboard" icon="open-book">
    View the interactive coverage map and per-library metrics on the official dashboard:
    [boykopovar.github.io/AnyPS5/progress.html](https://boykopovar.github.io/AnyPS5/progress.html)
  </Card>
  <Card title="Historical progress" icon="information">
    Review commit-by-commit milestone history and implementation trajectories:
    [boykopovar.github.io/AnyPS5/history.html](https://boykopovar.github.io/AnyPS5/history.html)
  </Card>
</CardGrid>

## Reading the library progress badge

The system library badge measures implementation coverage within known exports:

```text
libraries: [percent]%
```

<Aside type="caution">
The library progress figure is a percentage of the functions known to the project so far (declared in `core/libs/prx`), not of every PlayStation 5 system function. Never interpret this number as measuring complete operating system coverage.
</Aside>

### Denominator growth

The total function count is dynamic:
1. When a title calls previously undocumented NIDs, developers add corresponding function declarations to `core/libs/prx`.
2. Adding declarations increases the total known function count (the denominator).
3. If new stub declarations are added faster than implementations are written, the overall percentage can decrease even while active development continues.

### Function classification

The progress tool (`tools/progress.py`) categorizes each declared export into one of three states:

- **Implemented**: The function has an active implementation that does not call `NotImplemented_nid_no_patch`.
- **Inert**: An implemented function whose body consists only of constant returns, empty returns, or discards (such as silent UI stubs).
- **Stub**: An export whose body delegates to `NotImplemented_nid_no_patch`. Calling this function throws `std::runtime_error` at runtime.

The published percentage represents `(implemented + inert) / total_declared_functions`.

## Reading the shader recompiler badge

The shader recompiler badge measures instruction decoding and translation coverage:

```text
shaders: [percent]%
```

This metric measures the proportion of AMD RDNA2 GPU opcodes listed in the canonical instruction set specification (`tools/rdna_isa.txt`) that are supported by `core/shader/recompiler/RdnaDecoder`.

- The instruction list includes scalar ALU (SALU), vector ALU (VALU), data share (LDS/GDS), image sampling (MIMG), export (EXP), and vector memory buffer (MUBUF/MTBUF) opcodes.
- Full opcode coverage indicates that the recompiler recognizes and translates supported instructions into Vulkan SPIR-V bytecode. It does not imply that every graphics feature or title rendering technique behaves identically to console hardware.
