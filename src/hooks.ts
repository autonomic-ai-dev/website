const PRODUCT_ROOTS: Record<string, string> = {
	'agent-brain.autonomic-ai.dev': '/agent-brain',
	'agent-spine.autonomic-ai.dev': '/agent-spine'
};

export const reroute = ({ url }: { url: URL }): string | undefined => {
	const root = PRODUCT_ROOTS[url.hostname];
	if (root && url.pathname === '/') return root;
};
