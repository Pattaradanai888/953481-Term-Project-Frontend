<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
			<!-- Header -->
			<div class="text-center">
				<h1 class="text-3xl font-bold text-gray-900">
					Sign in to your account
				</h1>
				<p class="mt-2 text-sm text-gray-600">
					Don’t have an account?
					<NuxtLink
						to="/register"
						class="font-medium text-blue-600 hover:text-blue-700"
					>
						Create one now
					</NuxtLink>
				</p>
			</div>

			<!-- Error Message from Auth Store -->
			<div
				v-if="error"
				class="bg-red-50 p-4 rounded-md border border-red-200 text-red-700"
			>
				<div class="flex items-center">
					<svg
						class="h-5 w-5 text-red-500 mr-2"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p>{{ error }}</p>
				</div>
			</div>

			<!-- Form -->
			<VeeForm
				v-slot="{ errors }"
				:validation-schema="schema"
				class="space-y-6"
				@submit="login"
			>
				<div class="space-y-4">
					<div>
						<label
							for="username"
							class="block text-sm font-medium text-gray-700"
						>Username</label>
						<VeeField
							id="username"
							name="username"
							type="text"
							autocomplete="username"
							class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="Enter your username"
						/>
						<span
							v-if="errors.username"
							class="text-red-600 text-sm mt-1 block"
						>{{ errors.username }}</span>
					</div>
					<div>
						<label
							for="password"
							class="block text-sm font-medium text-gray-700"
						>Password</label>
						<VeeField
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="Enter your password"
						/>
						<span
							v-if="errors.password"
							class="text-red-600 text-sm mt-1 block"
						>{{ errors.password }}</span>
					</div>
				</div>

				<button
					type="submit"
					:disabled="loading"
					class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center justify-center"
				>
					<svg
						v-if="loading"
						class="animate-spin h-5 w-5 mr-2 text-white"
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
					{{ loading ? 'Signing in...' : 'Sign in' }}
				</button>
			</VeeForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

// Define validation rules (can be moved to a shared file if reused)
import { defineRule } from 'vee-validate';
import { required, min } from '@vee-validate/rules';
import { useAuthStore } from '~/stores/auth';

defineRule('required', required);
defineRule('min', min);

// Validation schema
const schema = {
	username: 'required|min:3',
	password: 'required|min:6',
};

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const login = async (values: { username: string; password: string }) => {
	try {
		const success = await authStore.login(values.username, values.password);
		if (success) {
			const redirectPath = route.query.redirect?.toString() || '/';
			router.push(redirectPath);
		}
	}
	catch {
		console.error('Login error occurred');
	}
};
</script>
