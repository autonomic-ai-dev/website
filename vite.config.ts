import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

const PRODUCT_HOSTS = [
	'tekmor.autonomic-ai.dev',
	'thesmos.autonomic-ai.dev',
	'tekmor.localhost',
	'thesmos.localhost'
];

export default defineConfig({
	server: { allowedHosts: PRODUCT_HOSTS },
	preview: { allowedHosts: PRODUCT_HOSTS },
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.md', '.svx'],
			preprocess: [
				vitePreprocess(),
				mdsvex({
					extensions: ['.md', '.svx']
				})
			],
			adapter: adapter({
				runtime: 'nodejs22.x'
			})
		})
	]
});
