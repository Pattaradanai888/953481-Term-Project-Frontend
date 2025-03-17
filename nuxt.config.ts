// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	modules: [
		'@nuxt/image',
		'@nuxtjs/tailwindcss',
		'@pinia/nuxt',
		'@nuxt/eslint',
	],
	devtools: { enabled: true },
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
