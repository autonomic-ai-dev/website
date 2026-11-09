# Autonomic AI website

This repository builds the Autonomic AI website. It has three parts:

- **Main site** (`autonomic-ai.dev`): the landing page and the products page.
- **agent-brain site** (`agent-brain.autonomic-ai.dev`): overview, docs, blog and registry for agent-brain.
- **agent-spine site** (`agent-spine.autonomic-ai.dev`): overview, docs, blog and registry for agent-spine.

The site is built with SvelteKit 2, Svelte 5, Tailwind CSS v4, and MDsveX for Markdown and `.svx` pages. It deploys to Vercel.

## Requirements

- Bun 1.4 or later (the lockfile is `bun.lock`).
- Node.js 22 or later, which Vercel also uses for the server runtime.

## Run it locally

```bash
bun install
bun run dev
```

Open these URLs. Each one shows a different site, the same way it appears in production:

| Site | Local URL |
| :--- | :--- |
| Main site (landing and products) | http://localhost:5173 |
| agent-brain | http://agent-brain.localhost:5173 |
| agent-spine | http://agent-spine.localhost:5173 |

`*.localhost` names resolve to your own machine in Chrome and Firefox, and the browser does not force them to HTTPS. Links, Home buttons and docs navigation all stay inside the product you are viewing. Production uses `agent-brain.autonomic-ai.dev` and `agent-spine.autonomic-ai.dev`, and the `.localhost` names are mapped to the same products in `src/lib/data/products.ts`.

To check the host routing from the command line:

```bash
curl -H "Host: agent-brain.autonomic-ai.dev:5173" http://localhost:5173/
```

Run `bun run build` to produce a production build, and `bun run preview` to serve it.

## Where to edit

| What | Where |
| :--- | :--- |
| Main site pages | `src/routes/(main)/` |
| Product overview content, features, install command, limits | `src/lib/data/products.ts` |
| Product layout, header, footer | `src/lib/components/product/ProductLayout.svelte` |
| Product overview sections | `src/lib/components/product/ProductOverview.svelte` |
| Docs navigation and layout | `src/lib/components/product/DocsShell.svelte` and `docsNav` in `products.ts` |
| agent-brain docs | `src/routes/agent-brain/docs/` |
| agent-spine docs | `src/routes/agent-spine/docs/` |
| Blog posts | `src/lib/content/blog/*.svx`, with a `product:` field in the frontmatter |
| Registry pages | `src/routes/agent-brain/registry/`, `src/routes/agent-spine/registry/` |
| Global styles and grid background | `src/app.css` |
| Hostname routing | `src/hooks.ts` and `productForHost` in `src/lib/data/products.ts` |
| Sitemap and robots | `src/routes/sitemap.xml/` and `src/routes/robots.txt/` |

Docs pages are Markdown with a `title:` frontmatter line. Add a link to a new docs page in `docsNav` so it appears in the sidebar.

Diagrams are Mermaid code blocks in Markdown. They render in the browser when the page loads.

## Checks

```bash
bun run check    # type check with svelte-check
bun run build    # production build
bun run lint     # Prettier check
```

The project verification script is `.verify/playbooks/verify_versioning_and_docs.sh`. It checks the agent-brain formula version, the docs content, and the CLI reference examples, then runs the type check and build.

## Notes

- `AUTONOMIC_VERSION` (or `VITE_AUTONOMIC_VERSION`) overrides the version shown on the site. Without it, the site reads the version from the Homebrew tap formulas on GitHub, and falls back to a built-in value when the network is unavailable.
- In local development, the Vercel analytics script returns 404. This does not affect the site.
