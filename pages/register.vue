<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
			<!-- Header -->
			<div class="text-center">
				<h2 class="text-3xl font-bold text-gray-900">
					Create your account
				</h2>
				<p class="mt-2 text-sm text-gray-600">
					Already have an account?
					<NuxtLink
						to="/login"
						class="font-medium text-blue-600 hover:text-blue-700"
					>
						Sign in here
					</NuxtLink>
				</p>
			</div>

			<!-- Error Message -->
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
				@submit="handleRegister"
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
							for="email"
							class="block text-sm font-medium text-gray-700"
						>Email address</label>
						<VeeField
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="Enter your email"
						/>
						<span
							v-if="errors.email"
							class="text-red-600 text-sm mt-1 block"
						>{{ errors.email }}</span>
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
							autocomplete="new-password"
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
					{{ loading ? 'Creating account...' : 'Create account' }}
				</button>
			</VeeForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Define validation rules (can be moved to a shared file if reused)
import { defineRule } from 'vee-validate';
import { required, min, email } from '@vee-validate/rules';
import { useAuthStore } from '~/stores/auth';

defineRule('required', required);
defineRule('min', min);
defineRule('email', email);

// Validation schema
const schema = {
	username: 'required|min:3',
	email: 'required|email',
	password: 'required|min:6',
};

const authStore = useAuthStore();
const router = useRouter();

const error = ref('');
const loading = ref(false);

onMounted(() => {
	if (authStore.isLoggedIn) {
		router.push('/');
	}
});

const handleRegister = async (values: { username: string; email: string; password: string }) => {
	loading.value = true;
	error.value = '';

	try {
		const success = await authStore.register(values.username, values.email, values.password);
		if (success) {
			router.push('/login?registered=true');
		}
		else {
			error.value = authStore.error || 'Registration failed. Please try again.';
		}
	}
	catch {
		error.value = 'An unexpected error occurred. Please try again.';
	}
	finally {
		loading.value = false;
	}
};
</script>
