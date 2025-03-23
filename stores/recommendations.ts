// stores/recommendations.ts
import { defineStore } from 'pinia';
import api from '~/utils/api';

interface Recipe {
	recipe_id: number;
	name: string;
	description: string;
	image_url: string;
	aggregated_rating: number;
	review_count: number;
}

interface RecipeList {
	title: string;
	recipes: Recipe[];
}

export const useRecommendationsStore = defineStore('recommendations', {
	state: () => ({
		recommendationLists: [] as RecipeList[],
		loading: false,
		error: null as string | null,
	}),

	actions: {
		/**
     * Fetch recommendations from the Flask backend.
     * @param folderId Optional folder ID to filter recommendations.
     */
		async fetchRecommendations(folderId?: number) {
			this.loading = true;
			this.error = null;
			try {
				const params = folderId ? { folder_id: folderId } : {};
				const response = await api.get('/recommendations', { params });
				this.recommendationLists = response.data;
			}
			catch (err: any) {
				this.error = err.response?.data?.message || 'Failed to fetch recommendations';
				console.error('Error fetching recommendations:', err);
			}
			finally {
				this.loading = false;
			}
		},

		/**
     * Refresh recommendations by calling the refresh endpoint.
     * @param folderId Optional folder ID to refresh recommendations for.
     */
		async refreshRecommendations(folderId?: number) {
			this.loading = true;
			this.error = null;
			try {
				const body = folderId ? { folder_id: folderId } : {};
				const response = await api.post('/recommendations/refresh', body);
				this.recommendationLists = response.data;
			}
			catch (err: any) {
				this.error = err.response?.data?.message || 'Failed to refresh recommendations';
				console.error('Error refreshing recommendations:', err);
			}
			finally {
				this.loading = false;
			}
		},
	},
});
