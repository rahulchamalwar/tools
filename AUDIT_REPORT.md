# Open Lab Tools — repository audit

Audit date: 2026-11-14  
Repository: https://github.com/rahulchamalwar/tools  
Intended production URL: https://www.openlabtools.online/

## Executive summary

The repository contains a static export of an Angular-based tools website. Its GitHub Pages configuration is internally consistent for a `/tools/` project subpath, but it is not ready to upload unchanged to the root of a cPanel domain. A deployment-preparation script has been added to create a separate root-domain package without altering the existing GitHub Pages files.

## Verified findings

| Severity | Area | Evidence | Impact | Action |
|---|---|---|---|---|
| Critical for cPanel root deployment | Base URL and assets | Static HTML uses `<base href="/tools/">` and references `/tools/assets/...`; compiled bundle sets the site origin to `https://rahulchamalwar.github.io` and base path to `/tools/`. | Root-domain deployment would resolve assets and canonical URLs to the wrong paths/host. | Run `scripts/prepare-cpanel.mjs` and deploy its output, not the unmodified repository root. |
| High | Robots and sitemap | `robots.txt` declares the GitHub Pages sitemap. The sitemap lists 35 URLs under `https://rahulchamalwar.github.io/tools/`. | Search engines are directed to the old host after moving to the custom domain. | The preparation script rewrites both files to the production host. |
| High | Angular source/build reproducibility | Root-level `package.json`, `angular.json`, TypeScript source and test configuration were not found at the expected paths. | A clean Angular rebuild, dependency audit and source-level optimization cannot be run from this repository snapshot. | Restore the original Angular source workspace and lockfile to a development branch/repository. |
| Medium | Main bundle | `assets/main.js` is approximately 934 KB of minified JavaScript before transfer compression. | Larger parse/execute cost, especially on low-end mobile devices. | cPanel output enables gzip compression and caching. For deeper optimization, restore source and implement route-level lazy loading, dependency analysis and bundle budgets. |
| Medium | Service worker | Existing `sw.js` caches all same-origin GET responses and falls back to the cached homepage for any navigation failure. | Can serve stale pages and may return the wrong cached document for an offline route. | The preparation script replaces it with network-first navigation handling and static-asset-only caching. |
| Medium | Tool capability expectations | The static page copy describes PDF compression as rasterizing/rebuilding pages, DOCX-to-PDF as text-only, PDF-to-Word as text extraction, and background removal as solid-color background removal. | These are limited transformations, not full-fidelity document conversion or AI background removal. | Keep limitations visible in tool UI; do not advertise full fidelity. |

## Route inventory check

- Sitemap entries: **35**.
- Tool routes represented in the sitemap: **21**.
- Category routes: **6**.
- Informational/policy routes: **6**.
- Home and All Tools pages: **2**.
- The corresponding static HTML files for the sitemap entries were found in the repository.
- The inspected HTML pages contain canonical tags and JSON-LD script blocks. This structural presence does not, by itself, prove that every JSON-LD block is valid or eligible for a Google rich result.

## Functional audit status

**Not yet verified in a live browser:** each tool's complete interaction, file handling, invalid-input behavior, download integrity, mobile layout, console/network errors and accessibility. The repository connector exposed the compiled static export, not the Angular source workspace or an executable browser test environment. Therefore no tool is being marked as fully tested or fixed at the feature-logic level.

Suggested manual regression matrix after deployment:
- EMI, SIP, GST, age and percentage calculators: normal values, zero, negative, empty and boundary values.
- QR generator and password generator: Unicode/long input, option combinations, copy and download.
- Image compressor/resizer/background remover: JPEG, PNG, transparent PNG, oversized image and unsupported file.
- JPG-to-PDF, PDF compressor, PDF-to-JPG, PDF-to-Word, Word-to-PDF and PDF splitter: multi-page, large, encrypted, malformed and unsupported files; verify output opens and disclose formatting loss.
- Word counter and JSON formatter: empty input, Unicode, malformed JSON, large text, copy and download.
- Currency converter: unavailable network, stale rates, invalid amount and rate timestamp/attribution.

## Schema.org review

The inspected route pages embed JSON-LD graphs using `Organization`, `WebApplication`, `BreadcrumbList` and `FAQPage` types; collection pages use `CollectionPage`/ `ItemList`. The 404 page is marked `noindex`. The deployment script rewrites the old host in static HTML and in the compiled runtime SEO configuration.

Before production:
- Validate representative pages with Schema Markup Validator and Google Rich Results Test.
- Ensure every FAQ answer is visibly present on the page and avoid adding FAQ schema solely to chase rich results.
- Confirm the organization name, logo URL and contact email are accurate and reachable.
- Do not add fabricated ratings, reviews or author details.

## Performance status

Verified: the bundle is minified and the application dynamically loads PDF/ZIP/QR-related modules when needed. The generated cPanel package enables server-side compression and browser caching for static assets while keeping HTML revalidation enabled.

Not measured: gzip transfer size, Lighthouse scores, Core Web Vitals, long tasks, real-device performance and network waterfall. These require a reachable production/staging URL and browser measurement. The 934 KB bundle figure is the uncompressed file size, not its compressed transfer size.

## Files added

- `scripts/prepare-cpanel.mjs` — creates a transformed `cpanel-dist/` export.
- `CPANEL_DEPLOYMENT.md` — cPanel deployment and rollback steps.
- `AUDIT_REPORT.md` — evidence, limitations and post-deployment test plan.

## Release gate

Do not call the site production-ready until the generated output is deployed to a staging/document-root target, the sitemap/robots/canonicals are fetched from the live domain, representative tools pass manual regression tests, and Lighthouse/real-device checks have been run.
