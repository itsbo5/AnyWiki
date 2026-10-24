---
title: In-browser web converter
description: How to convert PlayStation 5 applications in your web browser using WebAssembly.
---

import { Steps, Aside } from '@astrojs/starlight/components';

AnyPS5 provides an in-browser converter hosted at [boykopovar.github.io/AnyPS5](https://boykopovar.github.io/AnyPS5/). The converter allows users to relink applications without installing a compiler, CMake, or native dependencies.

<Aside type="note">
This page was verified by analyzing the web frontend and worker implementation in `demo/web/` (`app.mjs`, `worker.mjs`, `archive.mjs`, and `batch.mjs`) and the build tooling in `tools/build_web.py`.
</Aside>

## How the web converter works

The web converter executes client-side inside your browser:

1. A Web Worker (`worker.mjs`) loads the WebAssembly-compiled relinker (`relinker_wasm.mjs`).
2. The user drops a ZIP archive containing the unencrypted ELF executable and `sce_module/` directory, or selects a local folder.
3. The archive is parsed and unpacked entirely in browser memory. No game code or asset data is transmitted to an external server.
4. The worker fetches the precompiled AnyPS5 system PRX runtime libraries matching the current release tag from GitHub Releases (`release.json`). The downloaded archive's SHA-256 digest is checked before use.
5. The WebAssembly relinker converts the ELF executable and bundled guest modules.
6. The resulting binary, converted modules, and system PRX libraries are bundled together into the final output.

## Conversion limits and constraints

The web converter enforces the following limits:

- Maximum conversion input size: 256 MiB per title (`CONVERSION_LIMIT`). If the combined size of the executable and guest modules exceeds 256 MiB, use the native command-line relinker instead.
- Maximum in-memory download size: 256 MiB (`MEMORY_LIMIT`). For results larger than 256 MiB, select **Save ZIP to disk** in desktop Chromium-based browsers (Chrome or Edge) to stream data directly to storage.
- Windows folder output restriction: Browsers block direct file-system creation of DLL files. Direct uncompressed folder output is therefore restricted to Linux targets. Windows output must use ZIP mode.
- Icon size: Embedded Windows icon assets (`icon0.png`) must not exceed 16 MiB.

## Step-by-step conversion

<Steps>

1. ### Package the source files

   Create a standard ZIP archive containing your decrypted ELF executable and module directory:

   ```text
   game.zip
   ├── input.elf
   └── sce_module/
       └── libSceFoo.prx
   ```

2. ### Open the converter

   Navigate to [https://boykopovar.github.io/AnyPS5/](https://boykopovar.github.io/AnyPS5/) in a modern web browser.

3. ### Select options

   Choose your target operating system (Linux or Windows). If targeting an Intel host processor, check the option to convert AMD-specific instructions.

4. ### Convert and save

   Drop the ZIP file into the browser window. When conversion finishes:
   - Click **Save ZIP to disk** to download the converted package.
   - On Linux in supported browsers, select an uncompressed directory to write output files directly to your drive.

</Steps>

## Building and running the web converter locally

To develop or host the web converter locally:

<Steps>

1. ### Compile the WebAssembly binary

   Configure and build the WebAssembly target with Emscripten:

   ```sh
   emcmake cmake -S . -B build-wasm -G Ninja -DCMAKE_BUILD_TYPE=Release -DANYPS5_BUILD_WASM=ON
   cmake --build build-wasm --target relinker_wasm
   ```

2. ### Stage the frontend and library release assets

   Run `tools/build_web.py` to package the static assets and download release libraries:

   ```sh
   python3 tools/build_web.py --build build-wasm --release
   ```

3. ### Start the local development server

   Launch the local test server on port 8000:

   ```sh
   python3 tools/test_web.py --build build-wasm
   ```

</Steps>
