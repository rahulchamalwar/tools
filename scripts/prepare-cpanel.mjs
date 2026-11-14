#!/usr/bin/env node
/**
 * Prepare the checked-in static Angular export for cPanel at the domain root.
 *
 * Usage:
 *   node scripts/prepare-cpanel.mjs
 *   node scripts/prepare-cpanel.mjs . ./cpanel-dist
 *
 * The source repository is not modified. A transformed deployment copy is written
 * to cpanel-dist (or the output directory supplied as the second argument).
 */
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SITE_ORIGIN = "https://www.openlabtools.online";
const LEGACY_ORIGIN = "https://rahulchamalwar.github.io";
const LEGACY_BASE = "/tools/";
const root = path.resolve(process.argv[2] ?? process.cwd());
const output = path.resolve(process.argv[3] ?? path.join(root, "cpanel-dist"));

const ignored = new Set([".git", ".agents", ".github", "node_modules", "cpanel-dist", "scripts"]);
const excludedFiles = new Set(["README.md", "CPANEL_DEPLOYMENT.md", "AUDIT_REPORT.md"]);

if (root === output) throw new Error("Output directory must differ from the source directory.");

}
for (const required of ["index.html", "robots.txt", "sitemap.xml", "assets/main.js"]) {
  const p = path.join(root, required);
  try { await stat(p); } catch { throw new Error(`Required production file is missing: ${required}`); }
}

async function collect(dir, relative = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    if (!relative && ignored.has(entry.name)) continue;
    if (!relative && excludedFiles.has(entry.name)) continue;
    const rel = path.posix.join(relative.split(path.sep).join("/"), entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await collect(full, rel));
    else if (entry.isFile()) found.push({ full, rel });
  }
  return found;
}

const files = await collect(root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

let htmlCount = 0;
let transformedBundle = false;
for (const file of files) {
  const target = path.join(output, file.rel);
  await mkdir(path.dirname(target), { recursive: true });

  if (/\.html?$/i.test(file.rel)) {
    let html = await readFile(file.full, "utf8");
    html = html.replaceAll(`${LEGACY_ORIGIN}${LEGACY_BASE}`, `${SITE_ORIGIN}/`);
    html = html.replaceAll(`${LEGACY_ORIGIN}`, SITE_ORIGIN);
    html = html.replaceAll('href="/tools/', 'href="/');
    html = html.replaceAll('src="/tools/', 'src="/');
    html = html.replaceAll('<base href="/tools/">', '<base href="/">');
    htmlCount++;
    await writeFile(target, html);
    continue;
  }

  if (file.rel === "assets/main.js") {
    let js = await readFile(file.full, "utf8");
    const oldConfig = 'var c6="https://rahulchamalwar.github.io",u6="/tools/"';
    const newConfig = 'var c6="https://www.openlabtools.online",u6="/"';
    const occurrences = js.split(oldConfig).length - 1;
    if (occurrences !== 1) {
      throw new Error(`Expected one compiled site-origin/base-path config in assets/main.js; found ${occurrences}. Do not deploy an unverified bundle.`);
    }
    js = js.replace(oldConfig, newConfig);
    transformedBundle = true;
    await writeFile(target, js);
    continue;
  }

  if (file.rel === "robots.txt") {
    let robots = await readFile(file.full, "utf8");
    robots = robots.replaceAll(
      `${LEGACY_ORIGIN}${LEGACY_BASE}sitemap.xml`,
      `${SITE_ORIGIN}/sitemap.xml`
    );
    if (!robots.includes(`${SITE_ORIGIN}/sitemap.xml`)) {
      robots = `User-agent: *\\nAllow: /\\nSitemap: ${SITE_ORIGIN}/sitemap.xml\\n`;
    }
    await writeFile(target, robots);
    continue;
  }

  if (file.rel === "sitemap.xml") {
    let sitemap = await readFile(file.full, "utf8");
    sitemap = sitemap.replaceAll(`${LEGACY_ORIGIN}${LEGACY_BASE}`, `${SITE_ORIGIN}/`);
    await writeFile(target, sitemap);
    continue;
  }

  if (file.rel === "sw.js") {
    const worker = `const CACHE_NAME = "open-lab-tools-v4";
const BASE_URL = new URL("./", self.location.href);
const SHELL = ["./", "site.webmanifest", "app-icon.png", "favicon.png", "robots.txt"]
  .map((path) => new URL(path, BASE_URL).toString());

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => response)
        .catch(async () => (await caches.match(request)) || (await caches.match(new URL("./", self.location.href).toString())) || Response.error())
    );
    return;
  }

  const cacheable = ["script", "style", "image", "font", "worker"].includes(request.destination);
  if (!cacheable) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached || Response.error());
      return cached || network;
    })
  );
});
`;
    await writeFile(target, worker);
    continue;
  }

  await cp(file.full, target);
}

if (!transformedBundle) throw new Error("The compiled Angular bundle was not transformed.");
if (!htmlCount) throw new Error("No HTML pages were copied.");

const htaccess = `Options -Indexes -MultiViews
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Canonical HTTPS + www host. Enable AutoSSL in cPanel before using this redirect.
  RewriteCond %{HTTPS} !=on [OR]
  RewriteCond %{HTTP_HOST} !^www\\.openlabtools\\.online$ [NC]
  RewriteRule ^ https://www.openlabtools.online%{REQUEST_URI} [R=301,L]
</IfModule>

<IfModule mod_mime.c>
  AddType text/javascript .js .mjs
  AddType application/manifest+json .webmanifest
  AddType application/wasm .wasm
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType text/javascript "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType font/woff2 "access plus 30 days"
  ExpiresByType application/manifest+json "access plus 1 day"
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  <FilesMatch "\\.(html?)$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(css|js|mjs|png|jpe?g|webp|svg|ico|woff2?|ttf)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
</IfModule>

# Do not expose repository metadata or environment files.
<FilesMatch "^\\.(?!well-known)">
  Require all denied
</FilesMatch>
`;
await writeFile(path.join(output, ".htaccess"), htaccess);

const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
const sitemapUrls = sitemap.split("<loc>").slice(1).map((part) => part.split("</loc>")[0]);
const missing = [];
for (const url of sitemapUrls) {
  const pathname = new URL(url).pathname;
  const relative = pathname.split("/").filter(Boolean).join(path.sep);
  try { await stat(path.join(output, relative, "index.html")); }
  catch { missing.push(url); }
}
if (missing.length) {
  throw new Error(`Sitemap URLs without matching static files: ${missing.join(", ")}`);
}

console.log("cPanel deployment export prepared.");
console.log(`Source: ${root}`);
console.log(`Output: ${output}`);
console.log(`HTML pages transformed: ${htmlCount}`);
console.log(`Sitemap URLs verified against files: ${sitemapUrls.length}`);
console.log(`Production origin: ${SITE_ORIGIN}`);
console.log("The source repository was not modified. Upload the CONTENTS of this output folder to the cPanel document root.");
