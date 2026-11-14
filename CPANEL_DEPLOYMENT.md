# Open Lab Tools — cPanel production deployment

## What the current repository contains

The checked-in repository is a static production export of an Angular application, not a complete Angular development workspace. It contains the compiled Angular bundle at `assets/main.js`, route-specific HTML files, vendor modules, a service worker, `robots.txt` and `sitemap.xml`. The repository root does not currently contain `package.json`, `angular.json` or the TypeScript application source required for a reproducible Angular build.

## Prepare the cPanel package

The preparation script creates a separate `cpanel-dist/` directory and does not modify the existing GitHub Pages export.

Requirements: Node.js 18 or later.

From the repository root:

```bash
node scripts/prepare-cpanel.mjs
```

Optional source and output directories:

```bash
node scripts/prepare-cpanel.mjs ./ ./cpanel-dist
```

The script:
- Changes the base URL from the GitHub Pages `/tools/` subpath to the domain root.
- Changes the compiled Angular SEO origin/base-path configuration to `https://www.openlabtools.online/`.
- Rewrites every static HTML page's canonical, Open Graph, Twitter and internal root-relative links.
- Updates `robots.txt` and every sitemap URL to the production domain.
- Adds a cPanel `.htaccess` with HTTPS/www canonicalization, compression, sensible caching, MIME types and basic security headers.
- Updates the service worker so navigations are network-first and non-navigation caching is limited to static assets. This avoids the previous worker's broad caching of every same-origin GET response.
- Checks that every sitemap URL has a matching static HTML file in the output.

The script intentionally fails if the expected compiled bundle configuration is not found. Review its output before uploading.

## cPanel deployment steps

1. In cPanel, open **Domains** and confirm that `www.openlabtools.online` points to the intended document root (normally `public_html`, unless the domain uses a separate document root).
2. Enable and verify an SSL certificate using **SSL/TLS Status** or AutoSSL before enabling the HTTPS redirect in `.htaccess`.
3. Back up the current document root before replacing any files. Do not delete unrelated email, verification or hosting files.
4. Run the preparation script locally.
5. Open **File Manager** and enter the domain's document root.
6. Upload the **contents** of `cpanel-dist/` (not the folder itself), including the hidden `.htaccess` file. Enable **Show Hidden Files** in File Manager if necessary.
7. Confirm the domain's document root contains `index.html`, `assets/`, `tools/`, `category/`, `robots.txt`, `sitemap.xml` and `.htaccess`.
8. Clear any cPanel/Cloudflare/CDN cache and test the homepage, at least one route from each category, the PDF/image tools, and a deliberately invalid URL.
9. Verify `https://www.openlabtools.online/robots.txt` and `https://www.openlabtools.online/sitemap.xml` in a browser. Confirm the sitemap URLs use the production host and do not contain the old GitHub Pages prefix.
10. Submit the production sitemap in Google Search Console. Use URL Inspection to test representative pages; sitemap submission does not guarantee indexing.

## Important deployment assumptions

- The selected canonical host is `https://www.openlabtools.online/`, based on the production URL supplied for this project. If you want the non-www host to be canonical, change `SITE_ORIGIN` in the script and the matching redirect in its generated `.htaccess` before building.
- The script assumes the website is deployed at the document root, not inside a `/tools/` subdirectory.
- Do not enable the HTTPS/www redirect until the DNS records and SSL certificate are ready.
- The script does not upload files, modify DNS, access cPanel, or publish the site.
- Keep the previous deployment backup until the new site passes the post-deployment checks.

## Rollback

If the new deployment fails, restore the backed-up document-root files and the previous `.htaccess`. If a browser still loads an old app after rollback, clear the site's service-worker/cache data or unregister the old service worker in browser developer tools.
