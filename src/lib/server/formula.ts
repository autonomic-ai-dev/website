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

	// 0. Environment variable override
	const envVersion = process.env.AUTONOMIC_VERSION || process.env.VITE_AUTONOMIC_VERSION;
	if (envVersion) {
		const cleanVer = envVersion.replace(/^v/, '');
		cached = {
			autonomic: cleanVer,
			stack: cleanVer,
			ecosystemVersion: `v${cleanVer}`,
			stackVersion: `v${cleanVer}`,
			organs: {
				'agent-brain': `v${cleanVer}`,
				'agent-spine': `v${cleanVer}`,
				'agstack': `v${cleanVer}`
			}
		};
		lastFetch = now;
		return cached;
	}

	// 1. Try local filesystem (local development monorepo workspace)
	try {
		const searchPaths = [
			path.resolve(process.cwd(), '../homebrew-tap/Formula'),
			path.resolve(process.cwd(), 'homebrew-tap/Formula'),
			path.resolve('/Volumes/Seagate/developer/personal/autonomic-ai-dev/homebrew-tap/Formula')
		];

		const localTapDir = searchPaths.find((p) => fs.existsSync(p));

		if (localTapDir) {
			const readVer = (filename: string): string | null => {
				const p = path.join(localTapDir, filename);
				if (!fs.existsSync(p)) return null;
				const content = fs.readFileSync(p, 'utf-8');
				const match = content.match(/version\s+"([^"]+)"/);
				return match ? match[1] : null;
			};

			const stack = readVer('autonomic-stack.rb') || '1.0.0-rc2';
			const brain = readVer('agent-brain.rb') || stack;
			const spine = readVer('agent-spine.rb') || stack;

			cached = {
				autonomic: stack,
				stack,
				ecosystemVersion: `v${stack}`,
				stackVersion: `v${stack}`,
				organs: {
					'agent-brain': `v${brain}`,
					'agent-spine': `v${spine}`,
					'agstack': `v${stack}`
				}
			};
			lastFetch = now;
			return cached;
		}
	} catch (e) {
		// Non-fatal, proceed to remote fetch
	}

	// 2. Fetch from remote GitHub raw files (tries main then master)
	try {
		const fetchVer = async (file: string): Promise<string | null> => {
			for (const branch of ['main', 'master']) {
				try {
					const res = await fetch(
						`https://raw.githubusercontent.com/autonomic-ai-dev/homebrew-tap/${branch}/Formula/${file}`,
						{
							headers: { 'User-Agent': 'autonomic-website' },
							signal: AbortSignal.timeout(3000)
						}
					);
					if (res.ok) {
						const text = await res.text();
						const match = text.match(/version\s+"([^"]+)"/);
						if (match) return match[1];
					}
				} catch {
					// continue to next branch
				}
			}
			return null;
		};

		const [stack, brain, spine] = await Promise.all([
			fetchVer('autonomic-stack.rb'),
			fetchVer('agent-brain.rb'),
			fetchVer('agent-spine.rb')
		]);

		const stackVer = stack || '1.0.0-rc2';
		const brainVer = brain || stackVer;
		const spineVer = spine || stackVer;

		cached = {
			autonomic: stackVer,
			stack: stackVer,
			ecosystemVersion: `v${stackVer}`,
			stackVersion: `v${stackVer}`,
			organs: {
				'agent-brain': `v${brainVer}`,
				'agent-spine': `v${spineVer}`,
				'agstack': `v${stackVer}`
			}
		};
		lastFetch = now;
		return cached;
	} catch (err) {
		// Fallback baseline
		return {
			autonomic: '1.0.0-rc2',
			stack: '1.0.0-rc2',
			ecosystemVersion: 'v1.0.0-rc2',
			stackVersion: 'v1.0.0-rc2',
			organs: {
				'agent-brain': 'v1.0.0-rc2',
				'agent-spine': 'v1.0.0-rc2',
				'agstack': 'v1.0.0-rc2'
			}
		};
	}
}
