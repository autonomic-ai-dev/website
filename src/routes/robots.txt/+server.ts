import { originForHost } from '#lib/seo';
import type { RequestHandler } from './$types';

const RULES = [
	['Googlebot', 'Allow: /'],
	['Bingbot', 'Allow: /'],
	['Applebot', 'Allow: /'],
	['DuckDuckBot', 'Allow: /'],
	['Bytespider', 'Disallow: /'],
	['CCBot', 'Disallow: /'],
	['GPTBot', 'Disallow: /'],
	['ClaudeBot', 'Disallow: /'],
	['*', 'Allow: /']
];

export const GET: RequestHandler = ({ url }) => {
	const groups = RULES.map(([agent, rule]) => `User-agent: ${agent}\n${rule}`).join('\n\n');
	const body = `${groups}\n\nSitemap: ${originForHost(url.hostname)}/sitemap.xml\n`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'max-age=0, s-maxage=3600' }
	});
};
