import { paginatePosts, postsFor } from '#lib/content/blog';
import type { ProductId } from '#lib/data/products';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
	const productFilter = (url.searchParams.get('product') as ProductId | null) || undefined;
	const posts = postsFor(productFilter);
	const paginated = paginatePosts(posts, isNaN(pageParam) ? 1 : pageParam, 4);

	return {
		paginated,
		selectedProduct: productFilter
	};
};
