# BBI Website Content & Media Placement Guide

This guide documents all the temporary placeholder content (stock photos, client sector badges, and logos) in the CV Buana Bahtera Inspectindo (BBI) bilingual website. Use these tables and instructions to manually replace them with your actual company photos, client logos, and official materials.

---

## 1. Hero Background Images (Stock Photos)
The main banner (Hero) section of each page currently uses high-resolution stock photos from the Pexels CDN. These are defined using the inline CSS variable `--hero-image` on the `<section class="hero ...">` element.

| Page | Language | Line # | Current stock image description | Code Snippet / Value to Find |
| :--- | :--- | :--- | :--- | :--- |
| **Home**<br>`index.html` | English | 112 | Container ship at sea | `--hero-image: url('https://images.pexels.com/photos/33837934/pexels-photo-33837934.jpeg?...');` |
| **Home (ID)**<br>`id/index.html` | Indonesian | 76 | Container ship at sea | `--hero-image: url('https://images.pexels.com/photos/33837934/pexels-photo-33837934.jpeg?...');` |
| **About**<br>`about.html` | English | 51 | Container ship at sea | `--hero-image: url('https://images.pexels.com/photos/33837934/pexels-photo-33837934.jpeg?...');` |
| **About (ID)**<br>`id/about.html` | Indonesian | 42 | Container ship at sea | `--hero-image: url('https://images.pexels.com/photos/33837934/pexels-photo-33837934.jpeg?...');` |
| **Services**<br>`services.html` | English | 57 | Ship hull construction / drydock | `--hero-image: url('https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?...');` |
| **Services (ID)**<br>`id/services.html` | Indonesian | 42 | Ship hull construction / drydock | `--hero-image: url('https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?...');` |
| **Projects**<br>`projects.html` | English | 42 | Tugboats pushing container ship | `--hero-image: url('https://images.pexels.com/photos/36003959/pexels-photo-36003959.jpeg?...');` |
| **Projects (ID)**<br>`id/projects.html` | Indonesian | 42 | Tugboats pushing container ship | `--hero-image: url('https://images.pexels.com/photos/36003959/pexels-photo-36003959.jpeg?...');` |
| **Contact**<br>`contact.html` | English | 42 | Ship hull construction / drydock | `--hero-image: url('https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?...');` |
| **Contact (ID)**<br>`id/contact.html` | Indonesian | 42 | Ship hull construction / drydock | `--hero-image: url('https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?...');` |

### How to replace:
1. Create a folder named `images` inside the `assets/` directory (i.e. `assets/images/`).
2. Save your custom hero image there (e.g. `assets/images/hero-home.jpg`).
3. Update the HTML code.
   - For **root (English)** files:
     ```html
     style="--hero-image: url('./assets/images/hero-home.jpg');"
     ```
   - For **Indonesian (`id/`)** files:
     ```html
     style="--hero-image: url('../assets/images/hero-home.jpg');"
     ```
   > [!TIP]
   > Recommended dimensions for Hero images are **1920x1080 pixels** or **2200x1200 pixels** (saved with JPG/WebP compression for fast loading).

---

## 2. Feature Image Panels
Some pages have layout bands featuring a large side image panel. These are loaded similarly using the inline `--panel-image` variable.

| Page | Language | Line # | Current stock image description | Code Snippet / Value to Find |
| :--- | :--- | :--- | :--- | :--- |
| **Home**<br>`index.html` | English | 169 | Ship hull construction | `--panel-image: url('https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?...');` |
| **Projects**<br>`projects.html` | English | 67 | Container ship at sea | `--panel-image: url('https://images.pexels.com/photos/33837934/pexels-photo-33837934.jpeg?...');` |
| **Projects (ID)**<br>`id/projects.html` | Indonesian | 63 | Container ship at sea | `--panel-image: url('https://images.pexels.com/photos/33837934/pexels-photo-33837934.jpeg?...');` |

### How to replace:
Follow the same steps as the hero images. Place the image in `assets/images/` and update the inline CSS `url()` reference.
* Recommended dimensions: **1200x800 pixels** or **800x600 pixels**.

---

## 3. Client Marquee Badges (Text Placeholders)
Near the bottom of every page (inside the footer), there is a sliding client marquee. It currently uses text-based sector abbreviations instead of company logos:
```html
<span class="client-mark"><b>SO</b> Ship Owners</span>
<span class="client-mark"><b>PO</b> Port Operators</span>
...
```

### Locations:
You will find this block inside the `<footer class="site-footer">` of **all 10 HTML files**:
* **English root pages**: Near the end (e.g. lines 205-230 in `index.html`)
* **Indonesian `id/` pages**: Near the end (e.g. lines 159-162 in `id/index.html`)

### How to replace:
You have two choices for adding your actual clients:

#### Option A: Replace with Text & Badges (Simplest)
Modify the text inside the marquee track:
```html
<span class="client-mark"><b>[ABBR]</b> [Client Name]</span>
```
*Note: Make sure to duplicate the list of clients **twice** inside the `.marquee-track` container so the scroll effect loops seamlessly.*

#### Option B: Replace with Client Logo Images
If you want to show actual image logos instead of text badges:
1. Save client logos (preferably transparent PNG or SVGs, ~150px wide) into `assets/brand/logos/`.
2. Replace the `<span>` tags with `<img>` tags inside the `.marquee-track`:
   ```html
   <!-- In English root files: -->
   <img class="client-logo" src="assets/brand/logos/client-a.png" alt="Client A">
   <img class="client-logo" src="assets/brand/logos/client-b.png" alt="Client B">
   
   <!-- In Indonesian id/ files: -->
   <img class="client-logo" src="../assets/brand/logos/client-a.png" alt="Client A">
   <img class="client-logo" src="../assets/brand/logos/client-b.png" alt="Client B">
   ```
3. Add a quick class style in `styles.css` if necessary to control the height of `.client-logo` (e.g., `height: 48px; object-fit: contain;`).

---

## 4. Brand Logos and Assets
All corporate branding is stored in `assets/brand/`. If you receive new high-res or official corporate logos from CV Buana Bahtera Inspectindo, overwrite the files below.

| Logo Path | Role / Usage in Site |
| :--- | :--- |
| `assets/brand/bbi-logo-dark.png` | Main corporate logo. Used in the site header, the footer, the boot loader, and the splash screen. |
| `assets/brand/bbi-logo-line.png` | Simplified/Outline logo. Used for browser favicon, mobile bookmark tiles, and manifest links. |

### Note on logo references in JS:
If you rename these logo files, update their variables in the following files:
1. **`main.js`** (Line 3): `const brandLogoUrl = "/assets/brand/bbi-logo-dark.png";`
2. **`boot.js`** (Line 2): `const brandLogoUrl = "/assets/brand/bbi-logo-dark.png";`

---

## 5. Contact Info, Addresses, and Legal Details
All company addresses, phone numbers, and official details (like NPWP and metadata) are real, but if they change, they are located in these files:

### Office Addresses & PIC Contact Numbers:
* **English**: `contact.html` (lines 52-81) and footer section (lines 236-248).
* **Indonesian**: `id/contact.html` (lines 52-57) and footer section (lines 62-63).

### Structured SEO Data (JSON-LD schemas):
Search engines read the company address, phones, and tax details from the schema scripts in the `<head>` of the following files:
* `index.html` (Lines 33-56)
* `services.html` (Lines 32-46)
* `id/index.html` (Lines 32-56)

### Company NPWP Tax ID:
Displayed in the footer of all Indonesian pages:
* `id/about.html` (Line 73)
* `id/contact.html` (Line 63)
* `id/index.html` (Line 164)
* `id/projects.html` (Line 71)
* `id/services.html` (Line 75)
