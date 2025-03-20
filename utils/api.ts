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
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => Promise.reject(error),
);

// Response interceptor to handle common errors
api.interceptors.response.use(
	response => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = localStorage.getItem('refreshToken');
				if (refreshToken) {
					const res = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
					if (res.data.access_token) {
						localStorage.setItem('token', res.data.access_token);
						api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
						return api(originalRequest);
					}
				}
			}
			catch {
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
	logout: () => api.post('/auth/logout'),
	getCurrentUser: () => api.get('/auth/me'),
};

// Search related API calls
export const searchApi = {
	search: (query: string, page: number, limit: number) =>
		api.get('/search', { params: { q: query, page, per_page: limit } }),
	getRecipe: (recipeId: number) => api.get(`/recipe/${recipeId}`),
};

// Folder related API calls
export const folderApi = {
	getFolders: () => api.get('/folder'),
	getFolderDetails: (folderId: number) => api.get(`/folder/${folderId}`),
	createFolder: (formData: FormData) => api.post('/folder', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	}),
	updateFolder: (folderId: number, formData: FormData) => api.put(`/folder/${folderId}`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	}),
	deleteFolder: (folderId: number) => api.delete(`/folder/${folderId}`),
};

// Bookmark related API calls
export const bookmarkApi = {
	createBookmark: (recipeId: number, folderId: number, rating: number) =>
		api.post('/bookmark', { recipe_id: recipeId, folder_id: folderId, rating }),
};
