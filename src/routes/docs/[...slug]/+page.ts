import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const REDIRECTS: Record<string, string> = {
	'installation': '/tekmor/docs/installation',
	'verification': '/tekmor/docs/verification',
	'cli': '/tekmor/docs/cli',
	'limits': '/tekmor/docs/limits',
	'workflows': '/thesmos/docs/workflows',
	'decisions': '/thesmos/docs/decisions',
	'troubleshooting': '/thesmos/docs/troubleshooting',
	'cli/agent-spine': '/thesmos/docs/cli/agent-spine'
};

export const load: PageLoad = ({ params }) => {
	const slug = params.slug.replace(/\/+$/, '');
	const target = REDIRECTS[slug] || '/docs';
	throw redirect(307, target);
};
