export const prerender = true;

export async function GET() {
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/workflows', priority: '0.9', changefreq: 'daily' },
    { url: '/docs', priority: '0.9', changefreq: 'weekly' },
    { url: '/docs/architecture', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/installation', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/memory', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/workflows', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/cli', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/cli/agent-brain', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/cli/agent-spine', priority: '0.8', changefreq: 'weekly' }
  ];

  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>https://autonomic-ai.dev${p.url}</loc>
    <lastmod>${now}</lastmod>
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
