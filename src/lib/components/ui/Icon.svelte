<script lang="ts">
	import { Check, Database, Eye, Play, ReceiptText, Route, ShieldCheck, Terminal } from 'lucide-svelte';
	import type { IconName } from '#lib/data/products';

	let { name, size = 18 }: { name: IconName; size?: number } = $props();

	const icons = {
		route: Route,
		shield: ShieldCheck,
		receipt: ReceiptText,
		play: Play,
		database: Database,
		eye: Eye,
		terminal: Terminal,
		check: Check
	};

	const Glyph = $derived(icons[name]);
</script>

<Glyph {size} strokeWidth={1.75} />
