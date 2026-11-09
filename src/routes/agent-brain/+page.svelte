<script lang="ts">
	import ProductOverview from '#lib/components/product/ProductOverview.svelte';
	import { products } from '#lib/data/products';

	const product = products['agent-brain'];
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: product.name,
		url: product.origin,
		description: product.subline,
		applicationCategory: 'DeveloperApplication',
		author: { '@type': 'Organization', name: 'Autonomic AI', url: 'https://autonomic-ai.dev' }
	};
</script>

<svelte:head>
	<title>{product.name} — {product.tagline}</title>
	<meta name="description" content={product.subline} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${product.name} — ${product.tagline}`} />
	<meta property="og:description" content={product.subline} />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<ProductOverview {product} />
