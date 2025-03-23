// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	modules: [
		'@nuxt/image',
		'@nuxtjs/tailwindcss',
		'@pinia/nuxt',
		'@nuxt/eslint',
		'vue3-carousel-nuxt',
	],
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			apiBaseUrl: 'http://localhost:5000',
		},
	},
	compatibilityDate: '2024-11-01',
	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
				// ...
			},
		},
	},
});
