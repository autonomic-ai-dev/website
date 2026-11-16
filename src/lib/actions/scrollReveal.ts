export interface ScrollRevealOptions {
	threshold?: number;
	rootMargin?: string;
	delay?: number;
	y?: number;
	once?: boolean;
}

export function scrollReveal(node: HTMLElement, options: ScrollRevealOptions = {}) {
	const threshold = options.threshold ?? 0.12;
	const rootMargin = options.rootMargin ?? '0px';
	const delay = options.delay ?? 0;
	const y = options.y ?? 24;
	const once = options.once ?? false;

	// Set initial hidden state with smooth physics transition
	node.style.transition =
		'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.willChange = 'opacity, transform';

	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					if (delay > 0) {
						timeoutId = setTimeout(() => {
							node.style.opacity = '1';
							node.style.transform = 'translateY(0)';
						}, delay);
					} else {
						node.style.opacity = '1';
						node.style.transform = 'translateY(0)';
					}
					if (once) {
						observer.unobserve(node);
					}
				} else if (!once) {
					if (timeoutId) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					// Reset when leaving viewport so it re-animates on both scroll up and scroll down
					node.style.opacity = '0';
					node.style.transform = `translateY(${y}px)`;
				}
			}
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			if (timeoutId) clearTimeout(timeoutId);
			observer.disconnect();
		}
	};
}
