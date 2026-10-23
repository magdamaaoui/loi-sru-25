# Research dashboards

Two independently built SvelteKit websites share navigation, editorial styles, supporter logos, and a photo gallery through an npm workspace package.

```text
apps/loi-sru/           Existing SRU website, data, assets, scripts, and tests
apps/what-heat-costs/   What Heat Costs website and app-specific assets
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

The shared navigation receives localized labels, app-resolved URLs, the current route, and a language-change callback. Its glossary is an optional Svelte snippet, and the fullscreen-hero overlay is opt-in. SRU supplies both; What Heat Costs uses the hero overlay without the glossary. Each app explicitly includes the package in Tailwind source detection.

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

## Production deployments

Both dashboards deploy from **`main` in `magdamaaoui/loi-sru-25`**. They are separate Cloudflare Pages projects within the **mm-dashboards** account, using the repository root and one root npm lockfile.

| Setting | SRU | What Heat Costs |
| --- | --- | --- |
| Project | `loi-sru-25` | `what-heat-costs` |
| URL | https://loi-sru-25.pages.dev | https://what-heat-costs.pages.dev |
| Production branch | `main` | `main` |
| Build command | `npm run check:sru && npm run build:sru` | `npm run check:heat && npm run build:heat` |
| Output directory | `apps/loi-sru/build` | `apps/what-heat-costs/build` |
| App-specific build paths | `apps/loi-sru/*` | `apps/what-heat-costs/*` |
| Content environment | `CONTENT_SOURCE=sanity`, `DEPLOY_TARGET=cloudflare` | No CMS connection yet |

An app-only change rebuilds that app. Changes to `packages/*`, root dependency files, or the deployment configuration rebuild both. Each project retains its own environment variables, domains, and deployment history. SRU's Sanity publishing hook remains on its existing project. Heat has no publishing webhook or custom domain yet.

The managed Cloudflare build, branch, and path settings are versioned in `deployment/cloudflare-pages.json`. To detect configuration drift, provide a Cloudflare credential with Pages read/edit access and run:

```sh
node scripts/configure-cloudflare-pages.mjs          # Check only
node scripts/configure-cloudflare-pages.mjs --apply  # Apply and verify
```

The script reads `CLOUDFLARE_API_TOKEN` and preserves other project settings, including environment variables and hooks. It verifies the repository before making changes. Never commit credentials.

Pull requests and pushes to `main` run independent checks and builds for both apps through `.github/workflows/check-dashboards.yml`. Cloudflare also checks each app before publishing it. Normal deployment is a push to `main`; a manual heat deployment, after `npx wrangler login`, is:

```sh
npm run check:heat
npm run build:heat
CLOUDFLARE_ACCOUNT_ID=e7ac77deafbc24aced36bb508b513b05 npx wrangler pages deploy apps/what-heat-costs/build --project-name what-heat-costs --branch main
```

The retained GitHub Pages workflow builds only SRU. `npm run build` is a legacy SRU alias that stages its output in root `build`; the Cloudflare projects use the app-specific commands and output directories above.

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
