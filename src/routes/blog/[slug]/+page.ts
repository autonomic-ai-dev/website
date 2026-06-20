import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const modules = import.meta.glob('/src/lib/content/blog/*.svx', { eager: true });

export const load: PageLoad = ({ params }) => {
  const path = `/src/lib/content/blog/${params.slug}.svx`;
  const mod = (modules as Record<string, any>)[path];

  if (!mod) {
    throw error(404, `Post "${params.slug}" not found`);
  }

  return {
    component: mod.default,
    metadata: mod.metadata,
  };
};
