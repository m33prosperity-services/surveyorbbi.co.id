const fs = require("fs");
const path = require("path");

const root = __dirname;
const baseUrl = "http://127.0.0.1:4174";
const pages = [
  "index.html",
  "about.html",
  "services.html",
  "projects.html",
  "contact.html",
  "id/index.html",
  "id/about.html",
  "id/services.html",
  "id/projects.html",
  "id/contact.html"
];

const routes = [
  "/",
  "/about.html",
  "/services.html",
  "/projects.html",
  "/contact.html",
  "/id/",
  "/id/index.html",
  "/id/about.html",
  "/id/services.html",
  "/id/projects.html",
  "/id/contact.html",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/site.webmanifest",
  "/README.md",
  "/boot.js",
  "/main.js",
  "/styles.css",
  "/assets/brand/bbi-logo-dark.png",
  "/assets/brand/bbi-logo-line.png"
];

const requiredHeadTokens = [
  "<title>",
  'name="description"',
  'rel="canonical"',
  'hreflang="en"',
  'hreflang="id"',
  'hreflang="x-default"',
  "theme-color",
  'rel="icon"',
  'rel="apple-touch-icon"',
  'rel="manifest"',
  'property="og:title"',
  'property="og:description"',
  'property="og:type"',
  'property="og:url"',
  'property="og:image"',
  'property="og:locale"',
  'name="twitter:card"',
  'name="twitter:title"',
  'name="twitter:description"',
  'name="twitter:image"'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function verifyPageMetadata() {
  let jsonLdCount = 0;

  for (const page of pages) {
    const html = read(page);
    const missing = requiredHeadTokens.filter((token) => !html.includes(token));
    const lang = html.match(/<html lang="([^"]+)"/)?.[1];

    assert(missing.length === 0, `${page} missing metadata: ${missing.join(", ")}`);
    assert(page.startsWith("id/") ? lang === "id" : lang === "en", `${page} has unexpected lang=${lang}`);
    assert(html.includes("client-marquee"), `${page} missing client marquee`);
    assert(html.includes("precision-field"), `${page} missing 3D canvas hook`);
    assert(html.includes("language-switch"), `${page} missing language switch`);
    assert(html.includes("boot.js"), `${page} missing loading bootstrap`);

    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      JSON.parse(match[1]);
      jsonLdCount += 1;
    }
  }

  assert(jsonLdCount >= 4, `Expected at least 4 JSON-LD blocks, found ${jsonLdCount}`);
  console.log(`metadata ok: ${pages.length} pages, ${jsonLdCount} JSON-LD blocks`);
}

function verifySitemap() {
  const sitemap = read("sitemap.xml");
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  const alternateCount = (sitemap.match(/xhtml:link/g) || []).length;

  assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), "sitemap missing xhtml namespace");
  assert(locCount === 11, `Expected 11 sitemap loc entries, found ${locCount}`);
  assert(alternateCount === 30, `Expected 30 sitemap alternate links, found ${alternateCount}`);
  assert(sitemap.includes("https://surveyorbbi.co.id/id/"), "sitemap missing Indonesian home");
  assert(sitemap.includes("https://surveyorbbi.co.id/llms.txt"), "sitemap missing llms.txt");
  console.log("sitemap ok");
}

function verifyStaticFiles() {
  const manifest = JSON.parse(read("site.webmanifest"));
  const llms = read("llms.txt");
  const robots = read("robots.txt");

  assert(manifest.name === "Buana Bahtera Inspectindo", "manifest name mismatch");
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "manifest needs at least two icons");
  assert(llms.includes("## Languages") && llms.includes("https://surveyorbbi.co.id/id/"), "llms.txt missing bilingual facts");
  assert(robots.includes("Sitemap: https://surveyorbbi.co.id/sitemap.xml"), "robots.txt missing sitemap");
  console.log("static files ok");
}

async function verifyServerRoutes() {
  const server = require("./serve.cjs");
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    for (const route of routes) {
      const response = await fetch(`${baseUrl}${route}`);
      const bytes = await response.arrayBuffer();
      assert(response.ok, `${route} returned ${response.status}`);
      assert(bytes.byteLength > 0, `${route} returned empty response`);
      console.log(`${route} ${response.status} ${bytes.byteLength}`);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

(async () => {
  verifyPageMetadata();
  verifySitemap();
  verifyStaticFiles();
  await verifyServerRoutes();
  console.log("site verification passed");
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
