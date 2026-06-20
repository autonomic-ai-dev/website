import type { PageLoad } from './$types';

interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  category: string;
  author: string;
}

const modules = import.meta.glob('/src/lib/content/blog/*.svx', { eager: true });

export const load: PageLoad = () => {
  const posts: PostMeta[] = Object.values(modules)
    .map((mod: any) => mod.metadata as PostMeta)
    .filter(Boolean)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts };
};
