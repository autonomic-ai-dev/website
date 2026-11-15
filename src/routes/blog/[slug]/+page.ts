import { anyPostFor } from '#lib/content/blog';
import { products } from '#lib/data/products';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = anyPostFor(params.slug);
	const product = products[post.metadata.product];
	return {
		...post,
		product
	};
};
