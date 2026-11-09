import { originForHost, sitemapPaths } from '#lib/seo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const origin = originForHost(url.hostname);
	const today = new Date().toISOString().split('T')[0];
	const entries = sitemapPaths(url.hostname)
		.map(
			(path) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'max-age=0, s-maxage=3600' } }
	);
};
