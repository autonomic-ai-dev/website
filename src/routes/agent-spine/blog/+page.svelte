<script lang="ts">
	import BlogIndex from '#lib/components/BlogIndex.svelte';
	import { products } from '#lib/data/products';

	let { data } = $props();
</script>

<BlogIndex {data} product={products['agent-spine']} />
