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
				console.log('Token found in localStorage:', token.substring(0, 10) + '...');
				this.token = token;
				this.refreshToken = refreshToken;
				this.isAuthenticated = true;

				try {
					// Get current user data
					console.log('Attempting to fetch user data with token');
					const response = await authApi.getCurrentUser();
					this.user = response.data.user; // Note: the backend returns data wrapped in a "user" field
				}
				catch (error) {
					console.error('Error fetching user data:', error);
					if (error instanceof AxiosError) {
						console.error('Status:', error.response?.status);
						console.error('Response data:', error.response?.data);
					}
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
			catch (error) {
				console.error('Logout API call failed:', error);
				// Log more details about the error
				if (error instanceof AxiosError && error.response) {
					console.error('Response data:', error.response.data);
				}
			}
			finally {
				// Clear state and localStorage
				this.user = null;
				this.token = null;
				this.refreshToken = null;
				this.isAuthenticated = false;
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				console.log('Clearing localStorage on logout');
				this.loading = false;
			}
		},

	},
});
