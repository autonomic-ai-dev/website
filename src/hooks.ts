import { productForHost } from '#lib/data/products';

const ROOT_LEVEL_FILES = ['/robots.txt', '/sitemap.xml'];

export const reroute = ({ url }: { url: URL }): string | undefined => {
	const product = productForHost(url.hostname);
	if (!product || ROOT_LEVEL_FILES.includes(url.pathname)) return;
	const prefix = `/${product.id}`;
	if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) return;
	return `${prefix}${url.pathname}`;
};
