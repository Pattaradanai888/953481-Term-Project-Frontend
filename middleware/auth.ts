import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();

	// Initialize auth state if not already done
	if (!authStore.isAuthenticated && !authStore.loading) {
		await authStore.initAuth();
	}

	// Check if route requires authentication
	const requiresAuth = to.meta.requiresAuth !== false;

	// If route requires auth and user is not authenticated, redirect to login
	if (requiresAuth && !authStore.isAuthenticated) {
		return navigateTo('/login', {
			query: { redirect: to.fullPath },
		});
	}

	// If user is already authenticated and tries to access login/register pages, redirect to home
	if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
		return navigateTo('/');
	}

	return;
});
