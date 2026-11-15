import { error } from '@sveltejs/kit';
import type { ProductId } from '#lib/data/products';

export type PostMeta = {
	title: string;
	date: string;
	excerpt: string;
	slug: string;
	category: string;
	author: string;
	product: ProductId;
};

type PostModule = { default: unknown; metadata: PostMeta };

const modules = import.meta.glob('/src/lib/content/blog/*.svx', { eager: true }) as Record<string, PostModule>;

export const allPosts: PostMeta[] = Object.values(modules)
	.map((mod) => mod.metadata)
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function postsFor(product?: ProductId): PostMeta[] {
	if (!product) return allPosts;
	return allPosts.filter((post) => post.product === product);
}

export type PaginatedResult<T> = {
	items: T[];
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
};

export function paginatePosts(posts: PostMeta[], page = 1, pageSize = 4): PaginatedResult<PostMeta> {
	const validPage = Math.max(1, page);
	const totalItems = posts.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(validPage, totalPages);
	const start = (currentPage - 1) * pageSize;
	const items = posts.slice(start, start + pageSize);

	return {
		items,
		page: currentPage,
		pageSize,
		totalItems,
		totalPages,
		hasNext: currentPage < totalPages,
		hasPrev: currentPage > 1
	};
}

export function postFor(product: ProductId, slug: string) {
	const mod = modules[`/src/lib/content/blog/${slug}.svx`];
	if (!mod || mod.metadata.product !== product) {
		throw error(404, `Post "${slug}" not found for product "${product}"`);
	}
	return { component: mod.default, metadata: mod.metadata };
}

export function anyPostFor(slug: string) {
	const mod = modules[`/src/lib/content/blog/${slug}.svx`];
	if (!mod) {
		throw error(404, `Post "${slug}" not found`);
	}
	return { component: mod.default, metadata: mod.metadata };
}
