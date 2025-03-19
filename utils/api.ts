// ~/utils/api.ts
import axios from 'axios';

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token && config.headers) {
		// Make sure the token is properly formatted
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor to handle common errors
api.interceptors.response.use(
	response => response,
	async (error) => {
		const originalRequest = error.config;

		// If 401 Unauthorized and not already retrying
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Try to refresh token
				const refreshToken = localStorage.getItem('refreshToken');
				if (refreshToken) {
					const res = await axios.post(`${API_URL}/auth/refresh`, {
						refresh_token: refreshToken,
					});

					if (res.data.access_token) {
						localStorage.setItem('token', res.data.access_token);
						api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
						return api(originalRequest);
					}
				}
			}
			catch {
				// If refresh fails, redirect to login
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	},
);

export default api;

// Auth related API calls
export const authApi = {
	login: (username: string, password: string) =>
		api.post('/auth/login', { username, password }),

	register: (username: string, email: string, password: string) =>
		api.post('/auth/register', { username, email, password }),

	logout: () =>
		api.post('/auth/logout'),

	getCurrentUser: () =>
		api.get('/auth/me'),
};

export const searchApi = {
	search: (query: string, page: number, limit: number) =>
		api.get('/search', { params: { q: query, page, per_page: limit } }),
	getRecipe: (recipeId: number) =>
		api.get(`/recipe/${recipeId}`),
};
