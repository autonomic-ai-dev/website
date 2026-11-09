const PRODUCT_HOSTS: Record<string, string> = {
	'agent-brain.autonomic-ai.dev': 'agent-brain',
	'agent-spine.autonomic-ai.dev': 'agent-spine'
};

export const reroute = ({ url }: { url: URL }): string | undefined => {
	const product = PRODUCT_HOSTS[url.hostname];
	if (!product) return;
	const prefix = `/${product}`;
	if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) return;
	return `${prefix}${url.pathname}`;
};
