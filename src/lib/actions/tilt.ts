export function tilt(node: HTMLElement, { max = 15, perspective = 1000, scale = 1.05 } = {}) {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const xTilt = (max / 2 - xPct * max).toFixed(2);
    const yTilt = (yPct * max - max / 2).toFixed(2);

    node.style.transform = `perspective(${perspective}px) rotateX(${yTilt}deg) rotateY(${xTilt}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const handleMouseLeave = () => {
    node.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  node.addEventListener('mousemove', handleMouseMove);
  node.addEventListener('mouseleave', handleMouseLeave);
  node.style.transition = 'transform 0.1s ease-out';
  node.style.willChange = 'transform';

  return {
    destroy() {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
    }
  };
}
