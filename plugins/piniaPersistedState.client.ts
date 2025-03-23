// plugins/piniaPersistedState.client.ts
import { defineNuxtPlugin, useNuxtApp } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(() => {
  const { $pinia } = useNuxtApp();
  if ($pinia) {
    $pinia.use(piniaPluginPersistedstate)
  }
})
