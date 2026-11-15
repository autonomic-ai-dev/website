<script lang="ts">
	import DocsShell from '#lib/components/product/DocsShell.svelte';
	import { products } from '#lib/data/products';

	let { children } = $props();
</script>

<DocsShell product={products.tekmor}>
	{@render children()}
</DocsShell>
