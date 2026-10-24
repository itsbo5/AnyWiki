---
title: Preparing input
description: Requirements and directory layout for input executables, modules, and container unwrapping.
---

import { FileTree, Aside } from '@astrojs/starlight/components';

AnyPS5 requires unencrypted x86-64 ELF executables and bundled guest modules. It cannot process encrypted PlayStation 5 retail containers (SELF/fSELF) directly.

## Clean ELF requirement

Ensure all executables and modules are decrypted before running the relinker. If an input file is an encrypted container, the relinker detects the container signature and skips it with a warning:

```text
Skipping SELF container: sce_module/libSceFoo.prx (unwrap it before relinking)
```

### Unwrapping SELF containers

Use `tools/unwrap_self.py` to extract an unencrypted ELF from a decrypted SELF container:

```sh
python3 tools/unwrap_self.py input.self input.elf
```

The unwrap tool performs the following checks:
- Places segments at the offsets recorded in the SELF segment headers and restores the alignment invariant `p_offset % p_align == p_vaddr % p_align`.
- Refuses containers where all load segments appear encrypted.
- Refuses containers requiring more than 64 MiB of total alignment padding before allocating the buffer.

## Guest module directories

Bundled modules must be placed in a module directory beside the main executable:

<FileTree>
- source/
  - input.elf
  - sce_module/
    - moduleA.prx
    - moduleB.prx
</FileTree>

The relinker recognizes three standard directory names:
- `sce_module/`
- `sce_modules/`
- `prx/`

### Directory rules

1. Exactly one of `sce_module/` or `sce_modules/` may exist. Having both present in the parent directory is a fatal error:
   ```text
   FAIL: Both sce_module and sce_modules exist in the guest module parent directory
   ```
2. The `prx/` directory can coexist with either `sce_module/` or `sce_modules/`.
3. If all three directories are absent, the relinker halts unless you pass an explicit `--module-dir` option:
   ```text
   FAIL: sce_module was not found in: /path/to/source. Use --skip-sce-module to disable guest module processing.
   ```
4. Only files directly inside the module directory are processed. Subdirectories are not recursed automatically.

### Custom module directories with `--module-dir`

For homebrew packages where shared libraries sit in the root directory beside the executable, use `--module-dir .`:

```sh
relinker --module-dir . source/eboot.elf output.elf
```

For applications with extra plugin directories (such as Unity plugins under `Media/Plugins`), specify each directory with `--module-dir`:

```sh
relinker --module-dir Media/Plugins source/input.elf app.elf
```

Repeat the `--module-dir` flag for each additional directory.

### Module backup copy filtering

The relinker inspects module filenames and skips backup copies produced by dumping utilities. When a filename extends the name of another module in the same directory (such as `libFoo.prxbak` or `libFoo.prx.esbak` beside `libFoo.prx`) and both share the same internal `SONAME`, the relinker processes only the primary file and logs:

```text
Skipping backup copy: sce_module/libFoo.prxbak (same SONAME as sce_module/libFoo.prx)
```

## Output path collisions

The relinker validates destination paths before writing any files. The output executable, patch manifests, icon files, and converted modules must not point to the input executable or any bundled module being converted, including through filesystem hard links or symbolic links.

If a collision is detected, the relinker halts:

```text
FAIL: Output paths collide: /path/to/input.elf and /path/to/output.elf
```
