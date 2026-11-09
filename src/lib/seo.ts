import { postsFor } from '#lib/content/blog';
import { MAIN_ORIGIN, productForHost } from '#lib/data/products';

export function originForHost(hostname: string): string {
	return productForHost(hostname)?.origin ?? MAIN_ORIGIN;
}

export function sitemapPaths(hostname: string): string[] {
	const product = productForHost(hostname);
	if (!product) return ['/', '/products'];

	const docs = product.docsNav.flatMap((group) => group.links.map((link) => link.href));
	const posts = postsFor(product.id).map((post) => `/blog/${post.slug}`);
	return ['/', '/blog', '/registry', ...docs, ...posts];
}
