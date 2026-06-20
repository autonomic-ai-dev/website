export function inview(node: HTMLElement, { threshold = 0.1, rootMargin = '0px', delay = 0 } = {}) {
  let observer: IntersectionObserver;

  const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          node.classList.add('reveal-visible');
        }, delay);
        observer.unobserve(node);
      }
    });
  };

  observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin,
    threshold
  });

  observer.observe(node);

  return {
    destroy() {
      if (observer) observer.disconnect();
    }
  };
}
