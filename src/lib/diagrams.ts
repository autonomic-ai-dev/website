let counter = 0;

export async function renderMermaidBlocks(root: HTMLElement): Promise<void> {
	// Find all pre elements that are or contain mermaid diagrams
	const pres: HTMLElement[] = [];
	const directPres = root.querySelectorAll<HTMLPreElement>('pre.language-mermaid');
	for (const pre of directPres) {
		if (!pres.includes(pre)) pres.push(pre);
	}
	const codeBlocks = root.querySelectorAll<HTMLElement>('code.language-mermaid');
	for (const code of codeBlocks) {
		const parentPre = code.closest('pre');
		const target = parentPre || code;
		if (!pres.includes(target)) pres.push(target);
	}

	if (pres.length === 0) return;

	const { default: mermaid } = await import('mermaid');
	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'strict',
		theme: 'dark',
		themeVariables: {
			fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			primaryColor: '#12141a',
			primaryTextColor: '#f4f4f5',
			primaryBorderColor: 'rgba(255, 255, 255, 0.18)',
			lineColor: '#5fd39a',
			secondaryColor: '#0a0b0e',
			tertiaryColor: '#08090b',
			background: '#07080a',
			nodeBorder: 'rgba(255, 255, 255, 0.2)'
		},
		flowchart: {
			useMaxWidth: false,
			htmlLabels: true,
			curve: 'basis'
		}
	});

	for (const block of pres) {
		counter += 1;
		try {
			const text = block.textContent?.trim() ?? '';
			if (!text) continue;
			const { svg } = await mermaid.render(`diagram-${counter}`, text);
			const figure = document.createElement('figure');
			figure.className =
				'my-8 overflow-x-auto rounded-2xl border border-white/[0.1] bg-[#07080a] p-6 sm:p-8 shadow-2xl flex justify-center items-center';
			figure.innerHTML = svg;
			block.replaceWith(figure);
		} catch (error) {
			console.error('Mermaid diagram failed to render', error);
		}
	}
}
