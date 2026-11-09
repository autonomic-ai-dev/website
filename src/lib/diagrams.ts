let counter = 0;

export async function renderMermaidBlocks(root: HTMLElement): Promise<void> {
	const blocks = root.querySelectorAll<HTMLPreElement>('pre.language-mermaid');
	if (blocks.length === 0) return;

	const { default: mermaid } = await import('mermaid');
	mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'dark', flowchart: { useMaxWidth: false } });

	for (const pre of blocks) {
		counter += 1;
		try {
			const { svg } = await mermaid.render(`diagram-${counter}`, pre.textContent ?? '');
			const figure = document.createElement('figure');
			figure.className = 'my-10 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6';
			figure.innerHTML = svg;
			pre.replaceWith(figure);
		} catch (error) {
			console.error('Mermaid diagram failed to render', error);
		}
	}
}
