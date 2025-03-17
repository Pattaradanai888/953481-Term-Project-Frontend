<!-- pages/register.vue -->
<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Create your account
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					Or
					<NuxtLink
						to="/login"
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						sign in to existing account
					</NuxtLink>
				</p>
			</div>

			<div
				v-if="error"
				class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
			>
				{{ error }}
			</div>

			<form
				class="mt-8 space-y-6"
				@submit.prevent="handleRegister"
			>
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label
							for="username"
							class="sr-only"
						>Username</label>
						<input
							id="username"
							v-model="username"
							name="username"
							type="username"
							autocomplete="username"
							required
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Username"
						>
					</div>
					<div>
						<label
							for="email-address"
							class="sr-only"
						>Email address</label>
						<input
							id="email-address"
							v-model="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Email address"
						>
					</div>
					<div>
						<label
							for="password"
							class="sr-only"
						>Password</label>
						<input
							id="password"
							v-model="password"
							name="password"
							type="password"
							autocomplete="new-password"
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
							<!-- Loading spinner -->
							<svg
								class="animate-spin h-5 w-5 text-white"
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
						{{ loading ? 'Creating account...' : 'Create account' }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

// Redirect if already logged in
onMounted(async () => {
	if (authStore.isLoggedIn) {
		router.push('/');
	}
});


const handleRegister = async () => {
	loading.value = true;
	error.value = '';

	try {
		const success = await authStore.register(username.value, email.value, password.value);
		if (success) {
			// Redirect to login page after successful registration
			router.push('/login?registered=true');
		}
		else {
			error.value = authStore.error || 'Registration failed. Please try again.';
		}
	}
	catch (_err) {
		// Renamed parameter to avoid conflict with error.value
		error.value = 'An unexpected error occurred. Please try again.';
	}
	finally {
		loading.value = false;
	}
};
</script>
