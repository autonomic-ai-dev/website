<script lang="ts">
	import { onMount } from 'svelte';

	let {
		value,
		prefix = '',
		suffix = '',
		duration = 1.0,
		decimals = 0,
		class: className = ''
	}: {
		value: number;
		prefix?: string;
		suffix?: string;
		duration?: number;
		decimals?: number;
		class?: string;
	} = $props();

	let spanRef: HTMLSpanElement | undefined = $state();

	function format(val: number): string {
		const numStr = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US');
		return `${prefix}${numStr}${suffix}`;
	}

	onMount(() => {
		if (!spanRef) return;

		let frameId: number;
		let startTime: number | null = null;
		const targetValue = value;
		// Count down to 0 from 18 so zero-values have an unmistakable, tactile countdown
		const startValue = targetValue === 0 ? 18 : 0;
		const durationMs = duration * 1000;

		function easeOutCubic(t: number): number {
			return 1 - Math.pow(1 - t, 3);
		}

		function step(now: number) {
			if (!startTime) startTime = now;
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / durationMs, 1);
			const eased = easeOutCubic(progress);
			const current = startValue + (targetValue - startValue) * eased;

			if (spanRef) {
				spanRef.textContent = format(current);
			}

			if (progress < 1) {
				frameId = requestAnimationFrame(step);
			} else {
				if (spanRef) spanRef.textContent = format(targetValue);
			}
		}

		function startAnimation() {
			cancelAnimationFrame(frameId);
			startTime = null;
			frameId = requestAnimationFrame(step);
		}

		function reset() {
			cancelAnimationFrame(frameId);
			if (spanRef) spanRef.textContent = format(startValue);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						startAnimation();
					} else {
						// Bidirectional: reset when out of view so re-scrolling triggers animation
						reset();
					}
				}
			},
			{ threshold: 0.15 }
		);

		observer.observe(spanRef);

		return () => {
			cancelAnimationFrame(frameId);
			observer.disconnect();
		};
	});
</script>

<!-- SSR-first: Server outputs the fully formatted target number to prevent CLS and preserve SEO -->
<span bind:this={spanRef} class="tabular-nums {className}">
	{format(value)}
</span>
