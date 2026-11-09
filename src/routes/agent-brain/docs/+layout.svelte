<script lang="ts">
	import DocsShell from '#lib/components/product/DocsShell.svelte';
	import { products } from '#lib/data/products';

	let { children } = $props();
</script>

<DocsShell product={products['agent-brain']}>
	{@render children()}
</DocsShell>
