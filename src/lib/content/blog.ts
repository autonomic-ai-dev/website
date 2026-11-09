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

const allPosts = Object.values(modules).map((mod) => mod.metadata);

export function postsFor(product: ProductId): PostMeta[] {
	return allPosts
		.filter((post) => post.product === product)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function postFor(product: ProductId, slug: string) {
	const mod = modules[`/src/lib/content/blog/${slug}.svx`];
	if (!mod || mod.metadata.product !== product) {
		throw error(404, `Post "${slug}" not found`);
	}
	return { component: mod.default, metadata: mod.metadata };
}
