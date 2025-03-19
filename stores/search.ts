import { defineStore } from 'pinia';
import { searchApi } from '~/utils/api';

export const useSearchStore = defineStore('search', {
	state: () => ({
		query: '',
		results: [],
		loading: false,
		error: null,
		correctedQuery: null,
		selectedRecipe: null,
		recipeLoading: false,
		recipeError: null,
		total: 0, // Add total results
		page: 1, // Current page
		perPage: 24, // Results per page
	}),
	actions: {
		async searchRecipes(query: string, page: number, per_page: number) {
			this.loading = true;
			this.error = null;
			this.correctedQuery = null;
			this.query = query;

			try {
				const response = await searchApi.search(query, page, per_page);
				this.results = response.data.results;
				this.total = response.data.total;
				this.page = response.data.page;
				this.perPage = response.data.per_page;
				this.correctedQuery = response.data.correctedQuery || null;
			}
			catch (error) {
				this.error = error.response?.data?.error || 'An error occurred while searching';
			}
			finally {
				this.loading = false;
			}
		},
		async fetchRecipe(recipeId: number) {
			this.recipeLoading = true;
			this.recipeError = null;
			this.selectedRecipe = null;

			try {
				const response = await searchApi.getRecipe(recipeId);
				this.selectedRecipe = response.data;
			}
			catch (error) {
				this.recipeError = error.response?.data?.error || 'Failed to load recipe details';
			}
			finally {
				this.recipeLoading = false;
			}
		},
		clearSearch() {
			this.query = '';
			this.results = [];
			this.correctedQuery = null;
			this.error = null;
		},
		clearRecipe() {
			this.selectedRecipe = null;
			this.recipeError = null;
		},
	},
});
