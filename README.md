# AnyPS5 documentation wiki

A documentation wiki for the [AnyPS5](https://github.com/boykopovar/AnyPS5) project, built with [Astro Starlight](https://starlight.astro.build/).

## Verification baseline

The documentation and generated reference datasets in this repository are verified against upstream AnyPS5 commit:

- **Upstream commit**: `5b65588957f8b2020adb1f264a3d9408c997297f`
- **Commit date**: `Sat Oct 24 17:22:08 2026 +0400`
- **Upstream tree**: `https://github.com/boykopovar/AnyPS5/tree/5b65588957f8b2020adb1f264a3d9408c997297f`

## Prerequisites

- Node.js 24 LTS (`.nvmrc` specifies `24.15.0`)
- npm 11 or newer

## Local development

Install dependencies:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Build the static site for production (validates internal links and assets):

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run the mechanical prose quality check:

```sh
npm run check:prose
```

## Updating when upstream changes

When upstream AnyPS5 receives updates, refresh the generated reference files by pointing `ANYPS5_DIR` to the local AnyPS5 clone and running:

```sh
npm run generate:data
```

This updates:
1. `src/data/progress.json` and `src/data/libraries.json` (PRX system library inventory, NIDs, and opcode counts)
2. `src/data/errors.json` (runtime error catalog)
3. `src/data/contributors.json` (contributors and merged pull requests)
4. `src/data/commit.json` (verified upstream commit metadata)

After regenerating, run `npm run check:prose` and `npm run build` to verify that all links and prose checks pass before committing.

## Deployment

The site is configured for deployment to GitHub Pages under the `/AnyWiki` subpath. Deployment is automated through `.github/workflows/deploy.yml` on push to `main`.
