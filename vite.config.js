import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html'],
		  },
	}
};
export default config;
