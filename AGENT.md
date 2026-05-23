# Agent Context & Guidelines

## Project Overview
Small business static blog built with **Eleventy (v3.1.5)** and hosted on GitHub Pages.
- `index.njk` serves as the homepage template
- Uses CSS-based orbital animation effects with twinkling stars background
- Articles written in Markdown under `articles/`

## Project Structure
```
.
├── index.njk               # Homepage template (lists all articles)
├── eleventy.config.cjs     # Eleventy config: collections, filters, passthrough
├── package.json            # Eleventy SSG with open-cli and luxon
├── _data/
│   └── site.json           # Global site metadata (title, description, url)
├── articles/               # Article source files (.md)
├── assets/
│   └── images/             # Static image assets
├── _includes/
│   └── _layouts/
│       ├── base.njk        # Base HTML shell (stars, orbits, header, footer)
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
- Dark UI theme with slate/navy gradients
- Fixed orbital rings background animation
- Twinkling stars overlay effect
- Styled article cards with hover effects
- Responsive design with system font stack

## Development Workflow
1. Edit files in `articles/` as `.njk` (Nunjucks) or `.md` or plain `.html`
2. Run `npm run dev` for live preview
3. Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically

## GitHub Pages Deployment
- Workflow: `.github/workflows/deploy.yml` (triggers on push to `main`)
- Uses GitHub's native Pages API (`actions/deploy-pages`)
- Requires repo Settings → Pages → Source set to **GitHub Actions**
- `ELEVENTY_PATH_PREFIX` env var in `deploy.yml` controls URL prefix:
  - Project site (`username.github.io/helena`): set to `/helena/`
  - User/org site (`username.github.io`): set to `/`
- After enabling Pages in repo settings, deployments appear at the configured URL

## Template Conventions
- Articles in `articles/` should be `.md` files using `layout: _layouts/article.njk`
- The `article` collection is auto-built from all `articles/**/*.md` files (no special tag required)
- **Required frontmatter for all articles:**
  ```yaml
  ---
  title: Article Title
  date: YYYY-MM-DD
  summary: Short 2-3 sentence summary for homepage
  tags: [category]  # optional
  ---
  ```
- **Content field:** Main article body in `{% if content %}` or just paste below frontmatter (will be used if content field not provided)
- Static assets in `assets/` directory (images, fonts)
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
2. **Frontmatter required**: Add `---` YAML frontmatter to articles with:
   ```yaml
   ---
   date: YYYY-MM-DD
   title: Article Title
   summary: Short 2-3 sentence summary
   tags: [category]
   layout: _layouts/article.njk
   permalink: /articles/your-slug/
   ---
   ```
3. **Date filter**: Uses Luxon format tokens (e.g. `'LLLL dd, yyyy'`) — NOT strftime
4. **Nunjucks syntax**: Use `{{ value if condition else default }}` — NOT JS ternary `? :`
5. **Asset paths**: Use `../assets/images/` from articles directory
6. **Preserve styling**: Keep inline styles in `base.njk` unless modifying
7. **Test build**: Run `npm run build` locally before committing
8. **Clean stale build output**: Eleventy v3 has no `--clean` flag; delete `_site/` manually then rebuild

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
