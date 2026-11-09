<script lang="ts">
	import ProductOverview from '#lib/components/product/ProductOverview.svelte';
	import { products } from '#lib/data/products';

	const product = products['agent-spine'];
</script>

<svelte:head>
	<title>{product.name} — {product.tagline}</title>
	<meta name="description" content={product.subline} />
	<link rel="canonical" href={product.origin} />
</svelte:head>

<ProductOverview {product} />
