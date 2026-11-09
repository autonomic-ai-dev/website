<script lang="ts">
	import ProductLayout from '#lib/components/product/ProductLayout.svelte';
	import { products } from '#lib/data/products';

	let { children } = $props();
</script>

<ProductLayout product={products['agent-spine']}>
	{@render children()}
</ProductLayout>
