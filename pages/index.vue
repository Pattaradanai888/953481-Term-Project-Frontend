<!-- pages/index.vue -->
<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div
			v-if="!isLoggedIn"
			class="text-center"
		>
			<h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
				Find and save your favorite dishes
			</h1>
			<p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
				Search, bookmark, and get personalized recommendations for food recipes.
			</p>
			<div class="mt-8 flex justify-center">
				<div class="rounded-md shadow">
					<NuxtLink
						to="/register"
						class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
					>
						Get started
					</NuxtLink>
				</div>
				<div class="ml-3">
					<NuxtLink
						to="/login"
						class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
					>
						Sign in
					</NuxtLink>
				</div>
			</div>
		</div>

		<div v-else>
			<!-- Recommendations Sections -->
			<h1>Place holder</h1>
			<div
				v-if="loading"
				class="flex justify-center py-10"
			>
				<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);

const loading = ref(true);

onMounted(async () => {
	if (isLoggedIn.value) {
		loading.value = true;
	}
});
</script>
