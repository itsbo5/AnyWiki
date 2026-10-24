---
title: Community
description: Communication channels, discussion boards, and issue reporting for AnyPS5.
---

The AnyPS5 community coordinates development, title testing, and reverse engineering across multiple public communication channels.

## Communication channels

### GitHub Discussions

GitHub Discussions is the central forum for compatibility tracking, title bring-up reports, and general architecture questions.

- **Game bring-up**: The dedicated category for per-title compatibility tracking is [Game bring-up](https://github.com/boykopovar/AnyPS5/discussions/categories/game-bring-up). Each title has exactly one discussion thread identified by its title ID and game name. Review the [filing bring-up reports guide](/AnyWiki/compatibility/bring-up-reports/) before creating a new thread.
- **Q&A and ideas**: Use the general discussion categories for questions about toolchains, build environments, and feature proposals.

### Discord server

Real-time developer chat and technical discussion occur on the project Discord server:

- Join the server via the public invite link: [https://discord.gg/BHFztBPUe](https://discord.gg/BHFztBPUe).
- Discussion channels are organized by technical area: relinker engineering, graphics and shaders, PRX system libraries, and general development.

### GitHub Issues

GitHub Issues is reserved for actionable bugs, regression reports, and performance measurements.

- **Bug reports**: Use the issue tracker to report crashes, unexpected `std::runtime_error` terminations, or link failures. Provide complete terminal logs, the relinker command line used, and your host platform environment.
- **Performance reports**: If reporting slow rendering or frame pacing drops, use the structured performance issue template. Attach performance traces captured with `tools/trace_digest.py`.
- Do not use GitHub Issues for general troubleshooting questions or to request support for unsupported games; use GitHub Discussions instead.

## Community rules

All community channels enforce strict rules regarding legal compliance and constructive collaboration:

1. **No pirated material**: Never post, link, or request copyrighted game files, decrypted executables, console firmware dumps, or cryptographic keys. Any thread or message containing or soliciting proprietary files is deleted immediately, and the author is banned.
2. **Respect developer bandwidth**: Contributors work on AnyPS5 as independent open-source developers. Do not post demands for ETAs on specific games or repeatedly ping maintainers.
3. **Constructive problem reports**: When reporting issues, include full command invocations, host hardware details (GPU, CPU, driver version), and exact console logs.
