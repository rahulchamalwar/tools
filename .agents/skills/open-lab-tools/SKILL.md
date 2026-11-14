---
name: open-lab-tools
description: "Build, debug, review, secure, optimize, test, document, and deploy the Open Lab Tools website. Use for Angular/TypeScript/Bootstrap tools, browser-side utilities, technical SEO, structured data, performance, accessibility, GitHub workflows, cPanel hosting, and production releases in this repository."
---

# Open Lab Tools — Engineering Skill

## Mission

Maintain and improve the Open Lab Tools website as a reliable, fast, accessible, search-friendly collection of genuinely working online tools.

Work within the repository's existing architecture. The README describes an Angular, TypeScript, Bootstrap, JavaScript and jQuery project with online utilities and SEO-friendly pages. Treat the checked-out source, package manifests, build configuration and deployment configuration as the source of truth; inspect them before making technical decisions.

## Operating principles

1. **Inspect before editing.** Read `README.md`, `package.json`, Angular workspace configuration, routing, relevant source files, tests, and deployment configuration before changing code.
2. **Preserve the existing stack.** Do not migrate frameworks, replace libraries, introduce a backend, database, paid API, or new build system unless the user explicitly requests it and approves the scope.
3. **No fake functionality.** A tool is complete only when its input validation, processing, output, error states, reset behavior and mobile layout work. Never add a non-functional button, fabricated result, or placeholder tool and present it as finished.
4. **Privacy by default.** Prefer client-side processing for files and user-entered data. Do not upload, persist, log, or transmit user data unless the feature explicitly requires it, the user has approved it, and the behavior is clearly disclosed.
5. **No secrets in source.** Never commit API keys, passwords, access tokens, private customer data, or production credentials. Use documented environment variables and safe placeholders.
6. **Small, reviewable changes.** Keep changes scoped, reuse existing patterns, avoid unrelated refactors, and explain any unavoidable trade-offs.
7. **Verify claims.** Run available checks and inspect their actual output. Never claim a test, build, deployment, indexing change, or live-site check succeeded unless it was actually verified.
8. **Ask before consequential actions.** Do not publish, deploy, change DNS, delete data, alter hosting, change billing, or perform destructive Git operations without explicit authorization for that action.

## Task routing

Classify each request, then perform only the relevant workflow:

- **Feature/tool:** inspect existing tool patterns, implement the full user flow, add tests where practical, and update navigation/content metadata.
- **Bug/debugging:** reproduce or isolate the issue, identify the root cause, make the smallest fix, and run regression checks.
- **Technical SEO:** inspect rendered HTML, routing, canonicals, robots directives, sitemap, metadata, structured data, internal links and indexability. Separate code findings from external Search Console findings.
- **Performance:** measure or inspect bundle/build output, rendering, asset sizes, network dependencies and Core Web Vitals evidence before optimizing.
- **Accessibility/responsive UI:** check semantic HTML, keyboard operation, focus, labels, contrast, error messaging, touch targets and narrow viewports.
- **Security/privacy:** inspect input handling, file processing, dependencies, external requests, storage, CSP/security headers and secret exposure.
- **GitHub/CI:** inspect workflow files and logs; fix the cause without weakening checks or exposing secrets.
- **Deployment:** determine the actual target and build output from repository configuration. Prepare deployment instructions; execute a release only when explicitly authorized.

## Repository discovery checklist

At the start of a task:

- Identify the current branch, working tree status and recent relevant changes.
- Inspect `README.md`, `package.json`, lockfiles and Angular configuration.
- Locate application entry points, routes, shared components, tool implementations, styles and assets.
- Find existing tests, lint/type-check scripts and GitHub Actions workflows.
- Inspect `robots.txt`, sitemap generation, canonical URL configuration, metadata/schema utilities and any deployment-specific base path.
- Check for existing conventions before adding dependencies or files.

Do not assume file paths, npm scripts, Angular version, deployment folder, domain, analytics IDs, or hosting provider. Discover them from the repository and ask when a required production value is missing.

## Feature implementation workflow

1. Restate the requested behavior and identify the relevant route/component/service.
2. Check whether a similar tool already exists; reuse shared components and utilities.
3. Define input types, validation rules, expected output, limits and failure cases.
4. Implement the real algorithm or integration. Use browser-native APIs where suitable and compatible with the current supported browsers.
5. Keep expensive work responsive: use streaming, chunking, Web Workers or progress feedback only when justified by the task and current architecture.
6. For file tools, validate MIME type, extension and size; handle malformed, encrypted, empty and unsupported files; release object URLs and temporary resources; never silently transmit files.
7. Provide accessible labels, keyboard support, visible focus, helpful errors, loading/progress states, success feedback and a usable empty state.
8. Add or update unit/integration tests for normal, boundary and invalid inputs.
9. Update tool descriptions, page title/description, breadcrumbs, related links and sitemap inclusion where appropriate.
10. Run checks and summarize changed files, behavior, limitations and verification results.

## Functional quality standard for every tool

A tool must:

- Have a clear purpose, instructions, labeled controls and a meaningful example when useful.
- Validate required, malformed, out-of-range and oversized input.
- Handle errors without crashing the page or losing unrelated user input.
- Produce deterministic, correct output for supported cases.
- Offer copy, download or export only when relevant and verify the generated output is usable.
- Work on mobile and desktop, including keyboard-only use.
- Avoid sending sensitive content to external services without explicit disclosure and consent.
- Include tests for representative valid and invalid cases.

For calculations, verify formulas and units. For converters, preserve data accurately and document unsupported formats. For image/PDF/file processing, test realistic files and edge cases rather than only a happy-path sample.

## Angular and frontend conventions

- Follow the Angular version and patterns already used by this repository.
- Prefer typed TypeScript and strict null-safe handling consistent with project configuration.
- Keep components focused; place reusable logic in existing shared services/utilities where appropriate.
- Avoid direct DOM manipulation unless required; clean up subscriptions, listeners, workers and object URLs.
- Do not add jQuery to new code unless the existing integration genuinely requires it.
- Use Bootstrap classes and existing design tokens before adding custom CSS.
- Preserve route behavior, browser history, deep links and the configured deployment base path.
- Do not introduce SSR, hydration, a backend, or a database as an incidental optimization.

## Technical SEO workflow

For every SEO task, inspect the implementation and distinguish verified source-code facts from live search-engine data.

### Crawlability and indexability
- Ensure important pages return the intended HTTP status and are reachable through crawlable internal links.
- Check `robots.txt` and meta/X-Robots-Tag directives; do not block assets required for rendering.
- Ensure sitemap URLs are absolute, canonical, indexable URLs and exclude redirects, errors, duplicates and noindex pages.
- Confirm the sitemap is valid XML and is actually served from the intended production domain.
- Check canonical URLs for correctness, consistency, HTTPS, host preference, trailing-slash policy and deployment subpaths.
- Do not add a noindex directive to important production pages.

### On-page metadata
- Give each indexable tool page a unique, accurate title and meta description.
- Use one clear primary H1 and a logical heading hierarchy.
- Write useful original explanations, instructions, limitations and examples; do not generate thin, near-duplicate pages just to target keywords.
- Add descriptive internal links and meaningful anchor text.
- Provide useful alt text for informative images; decorative images should have empty alt text.

### Structured data
- Use JSON-LD only when it accurately represents visible page content and complies with current Schema.org and Google guidelines.
- Validate JSON syntax, required properties and page-to-schema consistency.
- Do not fabricate reviews, ratings, prices, author identities, organization details or other claims.
- Do not assume that valid structured data guarantees a rich result or ranking improvement.
- Reuse the site's existing schema implementation and avoid duplicate/conflicting entities.

### Performance and rendering
- Ensure primary page content, titles, canonical tags and essential metadata are available to crawlers in the rendered page.
- Check mobile usability, image dimensions, lazy loading, font loading, JavaScript errors and unnecessary third-party requests.
- Measure Core Web Vitals with suitable tools when available; do not invent LCP, INP, CLS or PageSpeed scores.
- Avoid adding heavy dependencies for small features.

### SEO reporting
Report each finding with: severity, affected URL/file, evidence, user/search impact, recommended fix, and verification method. Label Search Console, analytics, backlink and indexing conclusions as unavailable unless those data sources are connected or supplied.

## AdSense and advertising safeguards

- Treat AdSense approval and revenue as outcomes that cannot be guaranteed.
- Keep ads clearly distinguishable from tool controls, downloads and navigation; never encourage accidental clicks.
- Do not place ads so they obstruct core tool functionality or mislead users.
- Do not fabricate traffic, policy compliance, publisher IDs or approval status.
- Add publisher/ads configuration only from values supplied by the site owner. Never invent an AdSense client ID.
- Preserve useful content, privacy disclosures and required policy pages; flag missing owner-supplied legal/business information instead of inventing it.
- Do not add ad scripts to local/test environments unless explicitly requested.

## Privacy and security safeguards

- Treat all user input and uploaded files as untrusted.
- Validate and constrain file size, type and parsing work; handle decompression/resource exhaustion risks where relevant.
- Avoid unsafe HTML injection and sanitize untrusted content using established project dependencies.
- Do not use `eval`, `new Function`, or unsafe dynamic code execution.
- Avoid storing tool inputs in localStorage, sessionStorage, cookies or analytics unless explicitly required and disclosed.
- Minimize third-party scripts and network requests.
- Review dependency changes for maintenance, license, bundle-size and security impact.
- Never weaken Content Security Policy, security headers, validation or tests merely to make a feature work.
- Do not expose stack traces, secrets or internal configuration to end users.

## Testing and verification

First inspect the available scripts; do not assume command names. Run the narrowest relevant tests, then broader checks when feasible:

- Unit/integration tests for affected logic and UI.
- TypeScript/Angular compilation and production build.
- Lint/format checks if configured.
- Link, route, metadata, sitemap and structured-data checks relevant to the change.
- Responsive and keyboard checks for UI changes.
- A representative manual test of the affected tool, including invalid input.
- Git diff review for accidental files, secrets, generated output and unrelated changes.

If a command cannot run, report the exact reason and what remains unverified. Do not suppress failing checks or change scripts just to obtain a green result.

## Git and GitHub workflow

- Inspect `git status` and the diff before staging.
- Never use `git add .` blindly; stage only files related to the task.
- Never rewrite shared history, force-push, delete branches, or discard user changes unless explicitly requested.
- Keep commits focused with clear imperative messages when the user asks to commit.
- For pull requests, include purpose, implementation summary, tests run, risks and screenshots where relevant.
- Diagnose GitHub Actions failures from the actual workflow and logs. Do not expose repository secrets in logs or output.
- Do not merge a pull request or publish a release without explicit authorization.

## Deployment and hosting

The production host and deployment target must be verified from the current task and repository configuration. Do not assume GitHub Pages, cPanel, Netlify or another host.

Before preparing a release:

1. Confirm the intended domain, hosting target, build command and output directory.
2. Confirm the app's base URL/base href and routing fallback behavior for that host.
3. Verify canonical URLs, sitemap, robots file, redirects and HTTPS behavior for the target domain.
4. Confirm environment-specific values are supplied and no secrets are bundled into frontend assets.
5. Build and test the production artifact.
6. Provide a deployment checklist and rollback considerations.

For cPanel, give steps that match the configured build output and document root. Do not overwrite unrelated files or modify DNS without explicit approval. For GitHub Pages, verify repository path deployment and asset URLs before recommending a base path.

## Communication and completion report

Be concise, precise and evidence-based. Use the user's language where practical. At completion, state:

- What changed and why.
- Files created or modified.
- Commands/tests run and their actual results.
- Any remaining risks, assumptions or unverified items.
- Exact next action needed from the user, if any.

Do not claim the website is live, indexed, AdSense-approved, secure, error-free or ranking unless the relevant result has been directly verified.

## Scope boundaries

This skill does not authorize access to private accounts, external services, production hosting, DNS, payment systems or customer data. Use only connected tools and credentials explicitly authorized for the task. If the request exceeds available access, prepare the exact steps or configuration and explain what access is needed.
