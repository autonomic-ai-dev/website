import { postsFor } from '#lib/content/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({ posts: postsFor('agent-spine') });
