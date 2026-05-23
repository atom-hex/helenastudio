# Agent Context & Guidelines

## Project Overview
Interior design & architecture studio website built with **Eleventy (v3.1.5)**, hosted at helena.studio.
- `index.njk` serves as the homepage (hero, services, about, portfolio)
- Warm ivory theme (Cormorant Garamond + Jost), all CSS inline in `base.njk`
- Multilingual UI (EN / FR / ES / PT-BR) via client-side JS flag switcher
- Articles written in Markdown under `articles/`, each in its own folder with co-located translations

## Project Structure
```
.
├── index.njk               # Homepage (hero, services, about, portfolio sections)
├── eleventy.config.cjs     # Eleventy config: collections, filters, passthrough
├── package.json            # Eleventy SSG with open-cli and luxon
├── _data/
│   └── site.json           # Global site metadata (title, description, url)
├── articles/
│   └── <article-slug>/     # One folder per article
│       ├── index.md        # English content (source of truth)
│       └── index.11tydata.json  # Translations (FR/ES/PT-BR) + baseVersion
├── assets/
│   └── images/             # Static image assets
├── _includes/
│   └── _layouts/
│       ├── base.njk        # Base HTML shell: all CSS inline, lang switcher JS
│       └── article.njk    # Article page layout (title, date, content, tags)
├── .eleventyignore         # Excludes AGENT.md and README.md from processing
├── .gitignore              # Ignores node_modules/ and _site/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions: build + deploy to GitHub Pages
└── _site/                  # Build output (auto-generated, gitignored)
```

## Tech Stack
- **Build Tool**: Eleventy v3.1.5 (static site generator)
- **Date Formatting**: luxon v3+ (via `date` filter in `eleventy.config.cjs`)
- **Dev Server**: `npm run dev` starts Eleventy live reload
- **Build Command**: `npm run build` (or `npx @11ty/eleventy`)
- **Additional**: open-cli for auto-open in browser

## Key Features
- Warm ivory theme (Cormorant Garamond serif + Jost sans, all CSS in `base.njk`)
- Multilingual UI: EN / FR / ES / PT-BR, client-side JS flag switcher, persisted to `localStorage`
- Sticky header with backdrop blur
- Sections: hero, services (3 cards), about, portfolio (article cards)
- Article body per-language via hidden `<div id="article-body-{lang}">` swapped by JS
- Responsive design, WCAG AA color contrast

## Development Workflow
1. Edit files in `articles/` as `.njk` (Nunjucks) or `.md` or plain `.html`
2. Run `npm run dev` for live preview
3. Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically

## GitHub Pages Deployment
- Workflow: `.github/workflows/deploy.yml` (triggers on push to `main`)
- Uses GitHub's native Pages API (`actions/deploy-pages`)
- Requires repo Settings → Pages → Source set to **GitHub Actions**
- `ELEVENTY_PATH_PREFIX` env var in `deploy.yml` controls URL prefix:
  - Project site: set to `/` for helena.studio
- After enabling Pages in repo settings, deployments appear at the configured URL

## Template Conventions
- Articles live in `articles/<slug>/index.md` using `layout: _layouts/article.njk`
- The `article` collection is auto-built from all `articles/**/*.md` files (no special tag required)
- URL is automatic from folder name: `articles/my-article/index.md` → `/articles/my-article/`
- **Required frontmatter:**
  ```yaml
  ---
  title: Article Title
  date: YYYY-MM-DD
  contentVersion: 1
  summary: Short 2-3 sentence summary shown on homepage card
  tags: [category]  # optional
  layout: _layouts/article.njk
  ---
  ```
- `contentVersion` is an integer incremented every time the article body meaningfully changes
- Article templates reference: `{{ title }}`, `{{ date }}`, `{{ summary }}`, `{{ content }}`, `{{ tags }}`

## Important Files
- `index.njk` - Homepage template listing all articles
- `eleventy.config.cjs` - Eleventy config: article collection, date filter, asset passthrough, pathPrefix
- `_includes/_layouts/base.njk` - Base HTML shell shared by all pages (all CSS inline here)
- `_includes/_layouts/article.njk` - Article page layout
- `_data/site.json` - Global site metadata (title, description, url)
- `package.json` - Dependencies and scripts
- `.github/workflows/deploy.yml` - CI/CD: build + deploy to GitHub Pages

## Guidelines for Changes
1. **Always run `npm run dev` before testing changes** to see results immediately
2. **Date filter**: Uses Luxon format tokens (e.g. `'LLLL dd, yyyy'`) — NOT strftime
3. **Nunjucks syntax**: Use `{{ value if condition else default }}` — NOT JS ternary `? :`
4. **Asset paths**: Use `../assets/images/` from articles directory
5. **Preserve styling**: Keep inline styles in `base.njk` unless modifying
6. **Test build**: Run `npm run build` locally before committing
7. **Clean stale build output**: Eleventy v3 has no `--clean` flag; delete `_site/` manually then rebuild
8. **No explicit permalink needed**: folder name determines URL automatically

---

## Multilingual Articles

### Architecture
Each article is a self-contained folder. English is the source of truth. Translations live alongside it:
```
articles/my-article/
  index.md              ← English content, has contentVersion in frontmatter
  index.11tydata.json   ← translations + baseVersion (auto-loaded by Eleventy, never output)
```

### `index.11tydata.json` structure
```json
{
  "baseVersion": 1,
  "translations": {
    "fr": { "title": "...", "summary": "...", "body": "<p>...</p><h2>...</h2>..." },
    "es": { "title": "...", "summary": "...", "body": "<p>...</p>..." },
    "ptbr": { "title": "...", "summary": "...", "body": "<p>...</p>..." }
  }
}
```
- `body` is pre-rendered HTML (same structure as the Markdown would produce: `<p>`, `<h2>`, `<blockquote>`, `<em>`)
- `baseVersion` must match the article's `contentVersion` — mismatch means translations are stale

### How language switching works at runtime
- `article.njk` renders one visible `<div id="article-body-en">` plus hidden `<div id="article-body-{lang}">` for each translation
- A `<script>` in `article.njk` sets `window._artLangs` with title/summary per language
- The global `apply(lang)` in `base.njk` shows/hides the correct body div and swaps title/summary
- Homepage cards use `window._articleTrans` (keyed by article URL) to swap card titles/summaries

### Translation staleness tracking
- `contentVersion` in `index.md` frontmatter: increment whenever the article body changes meaningfully
- `baseVersion` in `index.11tydata.json`: update to match `contentVersion` after translating
- When `baseVersion < contentVersion`, translations are stale and need updating

### Publishing checklist
Before publishing or deploying, verify each article in `articles/`:

1. **All languages present** — `translations` in `index.11tydata.json` must have keys `fr`, `es`, `ptbr`
2. **Each language complete** — every translation entry must have `title`, `summary`, and `body`
3. **Translations up to date** — `baseVersion` in `index.11tydata.json` must equal `contentVersion` in `index.md` frontmatter
4. **Body structure matches** — translated `body` HTML should mirror the heading/paragraph structure of the English source
5. **Build passes** — `npm run build` exits 0 with no warnings

A verification script can automate steps 1–3:
```js
// scripts/check-translations.cjs
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const REQUIRED_LANGS = ['fr', 'es', 'ptbr'];
const REQUIRED_FIELDS = ['title', 'summary', 'body'];
let errors = 0;

fs.readdirSync('articles').forEach(slug => {
  const dir = path.join('articles', slug);
  if (!fs.statSync(dir).isDirectory()) return;

  const mdPath = path.join(dir, 'index.md');
  const dataPath = path.join(dir, 'index.11tydata.json');

  const { data: fm } = matter(fs.readFileSync(mdPath, 'utf8'));
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const { translations = {}, baseVersion } = data;

  if (baseVersion !== fm.contentVersion) {
    console.error(`[${slug}] Stale: contentVersion=${fm.contentVersion}, baseVersion=${baseVersion}`);
    errors++;
  }
  REQUIRED_LANGS.forEach(lang => {
    if (!translations[lang]) {
      console.error(`[${slug}] Missing language: ${lang}`);
      errors++;
    } else {
      REQUIRED_FIELDS.forEach(field => {
        if (!translations[lang][field]) {
          console.error(`[${slug}/${lang}] Missing field: ${field}`);
          errors++;
        }
      });
    }
  });
});

if (errors) { console.error(`\n${errors} translation error(s) found.`); process.exit(1); }
else console.log('All translations OK.');
```
Install dependency: `npm install --save-dev gray-matter`  
Add to `package.json` scripts: `"check-translations": "node scripts/check-translations.cjs"`  
Run: `npm run check-translations`

### Adding a new article
1. Create `articles/<slug>/index.md` with frontmatter including `contentVersion: 1`
2. Create `articles/<slug>/index.11tydata.json` with `baseVersion: 1` and all translations
3. Run `npm run check-translations` to verify
4. Run `npm run build` to confirm clean build

---

## AGENT.MD Maintenance Instructions

**IMPORTANT**: This file must be kept in sync with the codebase to ensure the agent has accurate context before making changes.

**Add to this file when**:

1. **New dependencies installed** (e.g., `npm install package`):
   - Update the Tech Stack section
   - Add script if new commands created
   - Note breaking version changes

2. **New files/directories created**:
   - Add to Project Structure tree
   - Describe file purpose in file-specific section

3. **Template engine changes**:
   - If switching from Nunjucks to Liquid/Handlebars etc., update accordingly
   - Note new variables/filters available
   - Document breaking changes in build process

4. **Build process modifications**:
   - Update commands in Development Workflow
   - Note new build options/flags
   - Add environment variables if introduced

5. **Styling changes**:
   - If CSS replaced by SCSS/Less: update build instructions and file extensions
   - Note new utility classes/patterns
   - Document design system updates

6. **Content structure changes**:
   - New article formats or conventions
   - Frontmatter changes/extensions
   - Directory structure modifications

7. **Performance improvements**:
   - Note new optimization techniques used
   - Document bundle size changes
   - Add caching/CDN configurations

8. **New plugins/extensions**:
   - Document in Tech Stack section
   - Explain purpose and configuration
   - Note any limitations or gotchas

9. **Deployment changes**:
   - Update CI/CD pipeline notes
   - Add environment-specific configurations
   - Document build artifacts

**Remove from this file when**:
- Features/plugins deprecated and removed
- Commands no longer work or exist
- Deprecated file types/extensions

**After every codebase modification**:
1. Compare current files to documented context
2. Update AGENT.md with any new/changed information
3. Verify build still works after updates
4. Keep instructions action-oriented and specific

**Format rules**:
- Be concise - bullet points over paragraphs
- Use code blocks for commands, example structures
- Keep tree structure flat, no deep nesting
- Version numbers where relevant (e.g., Eleventy v3.1.5)
- Test commands before documenting

**Review frequency**:
- After dependency version bumps (>1 minor)
- When project structure changes
- On significant feature additions
- After build process changes
