// plugins/piniaPersistedState.client.ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { defineNuxtPlugin, useNuxtApp } from '#app';

export default defineNuxtPlugin(() => {
	const { $pinia } = useNuxtApp();
	if ($pinia) {
		$pinia.use(piniaPluginPersistedstate);
	}
});
