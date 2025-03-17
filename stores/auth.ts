import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { authApi } from '~/utils/api';
import type { User } from '~/types';

interface AuthState {
	user: User | null;
	token: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		user: null,
		token: null,
		refreshToken: null,
		isAuthenticated: false,
		loading: false,
		error: null,
	}),

	getters: {
		getUser: state => state.user,
		isLoggedIn: state => state.isAuthenticated,
	},

	actions: {
		async initAuth() {
			this.loading = true;
			this.error = null;

			// Get token from localStorage
			const token = localStorage.getItem('token');
			const refreshToken = localStorage.getItem('refreshToken');

			if (token) {
				this.token = token;
				this.refreshToken = refreshToken;
				this.isAuthenticated = true;

				try {
					// Get current user data
					const response = await authApi.getCurrentUser();
					this.user = response.data;
				}
				catch (_error: unknown) {
					this.logout();
				}
			}

			this.loading = false;
		},

		async login(username: string, password: string) {
			this.loading = true;
			this.error = null;

			try {
				const response = await authApi.login(username, password);
				const { access_token, refresh_token, user } = response.data;

				this.token = access_token;
				this.refreshToken = refresh_token;
				this.user = user;
				this.isAuthenticated = true;

				// Store tokens in localStorage
				localStorage.setItem('token', access_token);
				localStorage.setItem('refreshToken', refresh_token);

				return true;
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Login failed';
				}
				else {
					this.error = 'Login failed';
				}
				return false;
			}
			finally {
				this.loading = false;
			}
		},

		async register(username: string, email: string, password: string) {
			this.loading = true;
			this.error = null;

			try {
				const response = await authApi.register(username, email, password);
				const { access_token, refresh_token, user } = response.data;

				this.token = access_token;
				this.refreshToken = refresh_token;
				this.user = user;
				this.isAuthenticated = true;

				// Store tokens in localStorage
				localStorage.setItem('token', access_token);
				localStorage.setItem('refreshToken', refresh_token);

				return true;
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Registration failed';
				}
				else {
					this.error = 'Registration failed';
				}
				return false;
			}
			finally {
				this.loading = false;
			}
		},

		async logout() {
			this.loading = true;

			try {
				if (this.isAuthenticated) {
					await authApi.logout();
				}
			}
			catch (_error: unknown) {
				// Continue with logout even if API call fails
			}
			finally {
				// Clear state and localStorage
				this.user = null;
				this.token = null;
				this.refreshToken = null;
				this.isAuthenticated = false;
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				this.loading = false;
			}
		},

	},
});
