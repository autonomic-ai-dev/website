import { postFor } from '#lib/content/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => postFor('agent-spine', params.slug);
