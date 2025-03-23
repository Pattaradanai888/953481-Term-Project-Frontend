<template>
	<div class="container mx-auto p-4">
	  <h1 class="text-2xl font-bold mb-4">
		Search Recipes
	  </h1>
  
	  <!-- Search Form -->
	  <div class="flex mb-4">
		<input
		  v-model="searchQuery"
		  type="text"
		  placeholder="Search by name, ingredient, or cooking process"
		  class="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
		  @keyup.enter="performSearch"
		>
		<button
		  class="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition"
		  :disabled="loading"
		  @click="performSearch"
		>
		  {{ loading ? 'Searching...' : 'Search' }}
		</button>
	  </div>
  
	  <!-- Loading State -->
	  <div
		v-if="loading"
		class="text-center py-4"
	  >
		<svg
		  class="animate-spin h-6 w-6 text-blue-500 mx-auto"
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
		<p class="mt-2 text-gray-600">
		  Loading...
		</p>
	  </div>
  
	  <!-- Error Message -->
	  <div
		v-else-if="error"
		class="text-red-500 text-center py-4"
	  >
		<p>{{ error }}</p>
	  </div>
  
	  <!-- Typo Correction Suggestion -->
	  <div
		v-if="correctedQuery"
		class="mb-4 bg-yellow-50 p-4 rounded"
	  >
		<p>
		  Did you mean: <span class="font-bold">{{ correctedQuery }}</span>?
		</p>
		<button
		  class="text-blue-500 underline hover:text-blue-700 mt-2"
		  @click="searchWithCorrectedQuery"
		>
		  Search with corrected query
		</button>
	  </div>
  
	  <!-- Search Results -->
	  <div
		v-if="results.length > 0"
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
	  >
		<div
		  v-for="recipe in results"
		  :key="recipe.recipe_id"
		  class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer"
		  @click="openRecipeModal(recipe.recipe_id)"
		>
		  <img
			:src="recipe.image_url || ''"
			:alt="recipe.name"
			class="w-full h-48 object-cover"
			loading="lazy"
			@error="(e) => e.target.src = ''"
		  >
		  <div class="p-4">
			<h2 class="text-lg font-semibold truncate">
			  {{ recipe.name }}
			</h2>
			<p class="text-gray-600 text-sm mt-1 line-clamp-2">
			  {{ recipe.description }}
			</p>
			<div class="flex flex-wrap gap-2 mt-2">
			  <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{{ recipe.category }}</span>
			</div>
		  </div>
		</div>
	  </div>
  
	  <!-- No Results -->
	  <div
		v-else-if="!loading && !error"
		class="text-gray-500 text-center py-4"
	  >
		<p>No results found. Try a different search term!</p>
	  </div>
  
	  <!-- Recipe Detail Modal -->
	  <RecipeModal
		v-if="selectedRecipe"
		:selected-recipe="selectedRecipe"
		@close="closeRecipeModal"
	  />
  
	  <!-- Pagination Component -->
	  <Pagination
		v-if="results.length > 0 && total > perPage"
		:current-page="searchStore.page"
		:total="total"
		:per-page="perPage"
		@page-changed="handlePageChange"
	  />
	</div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useSearchStore } from '~/stores/search';
  import { useAuthStore } from '~/stores/auth';
  import Pagination from '~/components/Pagination.vue';
  import RecipeModal from '~/components/recipe/RecipeModal.vue';
  
  const searchStore = useSearchStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();
  
  // Sync searchQuery with URL query parameter 'q'
  const searchQuery = ref(route.query.q || '');
  
  const loading = computed(() => searchStore.loading);
  const error = computed(() => searchStore.error);
  const results = computed(() => searchStore.results);
  const correctedQuery = computed(() => searchStore.correctedQuery);
  const selectedRecipe = computed(() => searchStore.selectedRecipe);
  const total = computed(() => searchStore.total);
  const perPage = computed(() => searchStore.perPage);
  
  const performSearch = async () => {
	if (!authStore.isLoggedIn) {
	  alert('Please log in to search for recipes.');
	  router.push('/login');
	  return;
	}
	if (!searchQuery.value.trim()) {
	  searchStore.error = 'Please enter a search query.';
	  return;
	}
	// Update URL with query and page
	await router.push({
	  path: '/search',
	  query: { q: searchQuery.value, page: '1' },
	});
	// Search will be triggered by the watch below
  };
  
  const handlePageChange = async (page) => {
	await router.push({
	  path: '/search',
	  query: { q: searchQuery.value, page: String(page) },
	});
	// Search will be triggered by the watch below
  };
  
  const searchWithCorrectedQuery = async () => {
	searchQuery.value = correctedQuery.value;
	await performSearch();
  };
  
  const openRecipeModal = async (recipeId) => {
	await searchStore.fetchRecipe(recipeId);
  };
  
  const closeRecipeModal = () => {
	searchStore.clearRecipe();
  };
  
  // Watch URL query changes and trigger search
  watch(
	() => [route.query.q, route.query.page],
	async ([newQuery, newPage]) => {
	  if (newQuery && newQuery !== searchQuery.value) {
		searchQuery.value = newQuery; // Sync input with URL
	  }
	  if (newQuery) {
		const page = newPage ? parseInt(newPage, 10) : 1;
		await searchStore.searchRecipes(newQuery, page, searchStore.perPage);
	  }
	},
	{ immediate: true } // Trigger on initial load
  );
  
  // Clear search store on mount (optional, depending on UX)
  onMounted(() => {
	if (!route.query.q) {
	  searchStore.clearSearch();
	}
  });
  </script>
  
  <style scoped>
  .line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
  }
  </style>