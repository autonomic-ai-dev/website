<script lang="ts">
	import BlogPost from '#lib/components/BlogPost.svelte';
	import { products } from '#lib/data/products';

	let { data } = $props();
</script>

<BlogPost {data} product={products['agent-spine']} />
