import fs from 'node:fs';
import path from 'node:path';

export interface AutonomicFormulae {
	autonomic: string;
	stack: string;
	ecosystemVersion: string;
	stackVersion: string;
	organs: Record<string, string>;
}

let cached: AutonomicFormulae | null = null;
let lastFetch = 0;
const CACHE_TTL_MS = 60 * 1000;

export async function getAutonomicFormulae(): Promise<AutonomicFormulae> {
	const now = Date.now();
	if (cached && now - lastFetch < CACHE_TTL_MS) {
		return cached;
	}

	// 1. Try local filesystem (development environment)
	try {
		const localTapDir = path.resolve(process.cwd(), '../homebrew-tap/Formula');
		if (fs.existsSync(localTapDir)) {
			const readVer = (filename: string): string | null => {
				const p = path.join(localTapDir, filename);
				if (!fs.existsSync(p)) return null;
				const content = fs.readFileSync(p, 'utf-8');
				const match = content.match(/version\s+"([^"]+)"/);
				return match ? match[1] : null;
			};

			const autonomic = readVer('autonomic.rb') || '1.0.0-beta.3';
			const stack = readVer('autonomic-stack.rb') || '1.0.0-beta.3.1';
			const brain = readVer('agent-brain.rb') || '1.0.0-beta.3.1';

			cached = {
				autonomic,
				stack,
				ecosystemVersion: `v${stack}`,
				stackVersion: `v${stack}`,
				organs: {
					'agent-body': `v${autonomic}`,
					'agent-brain': `v${brain}`,
					'agent-spine': `v${autonomic}`,
					'agent-heart': `v${autonomic}`,
					'agent-nerves': `v${autonomic}`,
					'agent-muscle': `v${autonomic}`,
					'agent-immune': `v${autonomic}`,
					'agent-eyes': `v${autonomic}`,
					'agent-mouth': `v${autonomic}`,
					'agent-tui': `v${autonomic}`,
					'agent-ci-dashboard': `v${autonomic}`
				}
			};
			lastFetch = now;
			return cached;
		}
	} catch (e) {
		// Non-fatal, proceed to remote fetch
	}

	// 2. Fetch from remote GitHub raw files
	try {
		const fetchVer = async (file: string): Promise<string | null> => {
			const res = await fetch(
				`https://raw.githubusercontent.com/autonomic-ai-dev/homebrew-tap/main/Formula/${file}`,
				{
					headers: { 'User-Agent': 'autonomic-website' },
					signal: AbortSignal.timeout(3000)
				}
			);
			if (!res.ok) return null;
			const text = await res.text();
			const match = text.match(/version\s+"([^"]+)"/);
			return match ? match[1] : null;
		};

		const [autonomic, stack, brain] = await Promise.all([
			fetchVer('autonomic.rb'),
			fetchVer('autonomic-stack.rb'),
			fetchVer('agent-brain.rb')
		]);

		const autoVer = autonomic || '1.0.0-beta.3';
		const stackVer = stack || '1.0.0-beta.3.1';
		const brainVer = brain || '1.0.0-beta.3.1';

		cached = {
			autonomic: autoVer,
			stack: stackVer,
			ecosystemVersion: `v${stackVer}`,
			stackVersion: `v${stackVer}`,
			organs: {
				'agent-body': `v${autoVer}`,
				'agent-brain': `v${brainVer}`,
				'agent-spine': `v${autoVer}`,
				'agent-heart': `v${autoVer}`,
				'agent-nerves': `v${autoVer}`,
				'agent-muscle': `v${autoVer}`,
				'agent-immune': `v${autoVer}`,
				'agent-eyes': `v${autoVer}`,
				'agent-mouth': `v${autoVer}`,
				'agent-tui': `v${autoVer}`,
				'agent-ci-dashboard': `v${autoVer}`
			}
		};
		lastFetch = now;
		return cached;
	} catch (err) {
		return {
			autonomic: '1.0.0-beta.3',
			stack: '1.0.0-beta.3.1',
			ecosystemVersion: 'v1.0.0-beta.3.1',
			stackVersion: 'v1.0.0-beta.3.1',
			organs: {
				'agent-body': 'v1.0.0-beta.3',
				'agent-brain': 'v1.0.0-beta.3.1',
				'agent-spine': 'v1.0.0-beta.3',
				'agent-heart': 'v1.0.0-beta.3',
				'agent-nerves': 'v1.0.0-beta.3',
				'agent-muscle': 'v1.0.0-beta.3',
				'agent-immune': 'v1.0.0-beta.3',
				'agent-eyes': 'v1.0.0-beta.3',
				'agent-mouth': 'v1.0.0-beta.3',
				'agent-tui': 'v1.0.0-beta.3',
				'agent-ci-dashboard': 'v1.0.0-beta.3'
			}
		};
	}
}
