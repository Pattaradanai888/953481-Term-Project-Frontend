<!-- pages/login.vue -->
<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
			<div>
				<h1 class="text-center text-3xl font-extrabold text-gray-900">
					Sign in to your account
				</h1>
				<p class="mt-2 text-center text-sm text-gray-600">
					Or
					<NuxtLink
						to="/register"
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						create a new account
					</NuxtLink>
				</p>
			</div>

			<form
				class="mt-8 space-y-6"
				@submit.prevent="login"
			>
				<div
					v-if="error"
					class="bg-red-50 border-l-4 border-red-400 p-4 mb-4"
				>
					<div class="flex">
						<div class="flex-shrink-0">
							<svg
								class="h-5 w-5 text-red-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-red-700">
								{{ error }}
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label
							for="username"
							class="sr-only"
						>Username</label>
						<input
							id="username"
							v-model="formData.username"
							name="username"
							type="text"
							autocomplete="username"
							required
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Username"
						>
					</div>
					<div>
						<label
							for="password"
							class="sr-only"
						>Password</label>
						<input
							id="password"
							v-model="formData.password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Password"
						>
					</div>
				</div>

				<div>
					<button
						type="submit"
						:disabled="loading"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<span
							v-if="loading"
							class="absolute left-0 inset-y-0 flex items-center pl-3"
						>
							<svg
								class="animate-spin h-5 w-5 text-indigo-300"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						</span>
						Sign in
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Define route
const route = useRoute();
const router = useRouter();

// Get auth store
const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

// Form data
const formData = reactive({
	username: '',
	password: '',
});


// Login function
const login = async () => {
	try {
		const success = await authStore.login(formData.username, formData.password);
		if (success) {
			// Redirect to previous route or home
			const redirectPath = route.query.redirect?.toString() || '/';
			router.push(redirectPath);
		}
	}
	catch {
		// Error is already handled in the store
		console.error('Login error occurred');
	}
};
</script>
