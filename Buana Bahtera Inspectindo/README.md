# Buana Bahtera Inspectindo Website

Static 5-page corporate website for CV Buana Bahtera Inspectindo with SEO/GEO metadata, 3D motion styling, company-profile-derived content, and a seamless client marquee in the footer.

## Preview

Run the local server:

```bash
node serve.cjs
```

Open:

```text
http://127.0.0.1:4174/index.html
```

## Verify

Run the full local verification:

```bash
node verify-site.cjs
```

Or:

```bash
npm run verify
```

## Deploy To GitHub And Vercel

1. Create a new GitHub repository.
2. Push this project folder to the repository.
3. In Vercel, choose **Add New Project** and import the GitHub repository.
4. Use these Vercel settings:
   - Framework Preset: `Other`
   - Build Command: leave empty
   - Output Directory: `.`
   - Install Command: leave empty
5. Add the production domain when ready, then update `sitemap.xml`, canonical URLs, Open Graph URLs, and `robots.txt` if the final domain differs from `https://surveyorbbi.co.id`.

The included `vercel.json` keeps the site static, adds basic security headers, caches brand assets, and maps `/id` to the Indonesian homepage.

## Pages

- `index.html`
- `about.html`
- `services.html`
- `projects.html`
- `contact.html`
- `id/index.html`
- `id/about.html`
- `id/services.html`
- `id/projects.html`
- `id/contact.html`

## SEO And GEO Assets

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- JSON-LD LocalBusiness, FAQPage, and Service data
- English and Indonesian pages with reciprocal `hreflang`
- Open Graph, Twitter card, favicon, and web manifest metadata
- Local office signals for Jakarta Utara, Pontianak Utara, and Bekasi

## Client Marquee

The footer client marquee appears on every HTML page under the `client-marquee` section. Current marks are sector placeholders. Replace those labels with real client names or logo images when the official client list is available.

## Brand Assets

BBI logo files live in:

```text
assets/brand/
```
