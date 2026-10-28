import { agents } from '$lib/data/agents';

export const prerender = true;

interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  category: string;
  author: string;
}

const blogModules = import.meta.glob('/src/lib/content/blog/*.svx', { eager: true });

export async function GET() {
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/registry', priority: '0.9', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/docs', priority: '0.9', changefreq: 'weekly' },
    { url: '/docs/architecture', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/installation', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/invariants', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/verification', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/agstack', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/minimalist-entrepreneur', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/gstack', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/memory', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/workflows', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/cli', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/cli/agent-brain', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/cli/agent-spine', priority: '0.8', changefreq: 'weekly' }
  ];

  const now = new Date().toISOString().split('T')[0];

  const blogPages = Object.values(blogModules)
    .map((mod: any) => mod.metadata as PostMeta)
    .filter((meta): meta is PostMeta => Boolean(meta && meta.slug))
    .map((post) => ({
      url: `/blog/${post.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: post.date || now
    }));

  const agentPages = agents.map((agent) => ({
    url: `/agents/${agent.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: now
  }));

  const allPages = [
    ...staticPages.map((p) => ({ ...p, lastmod: now })),
    ...blogPages,
    ...agentPages
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>https://autonomic-ai.dev${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
}
