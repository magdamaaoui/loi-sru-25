# Research dashboards

Two independently built SvelteKit websites share navigation, editorial styles, supporter logos, and a photo gallery through an npm workspace package.

```text
apps/loi-sru/           Existing SRU website, data, assets, scripts, and tests
apps/what-heat-costs/   Six-page heat dashboard scaffold
packages/dashboard-ui/ Shared navigation, styles, logo strip, and photo gallery
studio/                Existing SRU Sanity Studio (separate install/deployment)
```

## Development

Use Node 22.13 or newer. Install website dependencies once at the repository root:

```sh
npm ci
npm run dev:sru       # http://localhost:5173
npm run dev:heat      # http://localhost:5174
```

Run the dev commands in separate terminals to work on both apps. `npm run dev` remains an alias for SRU. Extra Vite arguments can be passed with `--`, for example `npm run dev:heat -- --host 0.0.0.0`.

What Heat Costs contains an introduction with a photographic cover, supporter logos, bilingual section headings, and lorem ipsum text. Preparedness Evaluation has a single-project gallery of 11 supplied construction photos with placeholder captions; the four remaining pages have headings only. The chronology and cost-of-inaction sections are titles only. Site labels live in `apps/what-heat-costs/src/lib/site.ts`; introduction placeholders live in its `src/routes/+page.svelte`. It has no research data or Sanity connection yet.

## Sharing boundary

`@dashboards/ui` exports Svelte source components and the common stylesheet; each app compiles its own copy. No registry publishing or separate library build is needed.

The shared navigation receives localized labels, app-resolved URLs, the current route, and a language-change callback. Its glossary is an optional Svelte snippet, and the fullscreen-hero overlay is opt-in. SRU supplies both; the heat scaffold supplies neither. Each app explicitly includes the package in Tailwind source detection.

Keep page composition, language state, glossary content, data, maps, charts, and content validation inside each app. Extract further components only as both dashboards need them. Shared components must not import either app's `$lib`, route definitions, or datasets.

`PhotoGallery` shares the sticky image stack and caption layout. It accepts app-resolved image URLs and captions. Single-project galleries track scrolling internally; SRU supplies its active frame and binds the gallery elements for its project navigator. SRU's project selectors, project profiles, caption editor, and resident analysis remain inside SRU. `LogoStrip` shares the logo sizing and rendering, with each app supplying its own supporter list.

## Checks and builds

```sh
npm run check        # Both apps, including their shared component imports
npm run build:all    # Independent builds for both apps
npm run test:e2e     # Existing SRU regression suite
npm run content:report
```

`npm run build:sru` writes `apps/loi-sru/build`. Its default base path remains `/sru-project`; use `DEPLOY_TARGET=cloudflare` for root-domain deployment. `npm run build:heat` writes `apps/what-heat-costs/build` and always uses the domain root.

Preview SRU with `npm run preview` (port 4173) and heat with `npm run preview:heat` (port 4174).

## Deployment compatibility

The existing Cloudflare and GitHub Pages configurations can continue using `npm run build` and output directory `build`. That command builds SRU and copies its output to the legacy root directory. This preserves existing deployment settings while the repo is reorganized.

For two Cloudflare Pages projects, both install from the repository root using the root lockfile:

| Setting | Existing SRU project | New heat project |
| --- | --- | --- |
| Root directory | Repository root | Repository root |
| Build command | `npm run build` (compatible) or `npm run build:sru` | `npm run build:heat` |
| Output directory | `build` (compatible) or `apps/loi-sru/build` | `apps/what-heat-costs/build` |
| Environment | Existing `CONTENT_SOURCE=sanity`, `DEPLOY_TARGET=cloudflare` | No CMS environment variables yet |

If changing SRU to `build:sru`, update its output directory at the same time. Give each Pages project its own domain. Watch its own `apps/<app>/*` directory, `packages/*`, and root build inputs such as `package.json`, `package-lock.json`, `.npmrc`, `.nvmrc`, and `scripts/*`. Code in a shared package must trigger both builds.

This scaffold does not create hosting projects, change domains, or configure content-publishing webhooks. Cloudflare settings and the new heat domain still need to be configured when ready to deploy.

## Content editor

The existing Studio remains in `studio/`, with its own dependencies and lockfile:

```sh
npm --prefix studio ci
npm run studio:dev
npm run studio:build
```

Its existing SRU content, schemas, and publishing flow are unchanged. A heat workspace and dataset can be added when we develop its editorial content. See `studio/README.md` for the current editor workflow.

SRU maintenance scripts now live under `apps/loi-sru/scripts/`. Root npm aliases still expose the image, map, and content commands. The content export alias continues writing to the root `.sanity-import/` directory. For scripts run through `sanity exec` from `studio/`, use paths starting with `../apps/loi-sru/scripts/sanity/`.

Older research and handoff documents retain their historical paths. Use this README for the current checkout layout.
