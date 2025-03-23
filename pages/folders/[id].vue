<template>
	<div class="container mx-auto p-6 space-y-8">
	  <!-- Back Navigation -->
	  <div>
		<NuxtLink
		  to="/bookmarks"
		  class="text-blue-500 hover:underline inline-block"
		>
		  ← Back to Bookmarks
		</NuxtLink>
	  </div>
  
	  <!-- Folder Details Card -->
	  <div
		v-if="folder"
		class="relative bg-white rounded-lg shadow-lg overflow-hidden"
	  >
		<img
		  :src="folder.coverUrl || '/maxres2.jpg'"
		  alt="Folder cover"
		  class="w-full h-64 object-cover"
		>
		<div class="absolute inset-0 bg-black opacity-40" />
		<div class="absolute bottom-0 left-0 p-6 text-white">
		  <h1 class="text-3xl font-bold">
			{{ folder.name }}
		  </h1>
		  <p class="mt-2 text-lg">
			{{ folder.description }}
		  </p>
		</div>
		<button
		  class="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
		  @click="handleRemoveFolder"
		>
		  Remove Folder
		</button>
	  </div>
  
	  <!-- Generate Suggestions Button -->
	  <div class="flex justify-end">
		<button
		  class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
		  @click="fetchFolderSuggestions"
		>
		  Generate Suggestions
		</button>
	  </div>
  
	  <!-- Suggestions Section -->
	  <div
		v-if="loadingSuggestions"
		class="text-center py-4"
	  >
		<span class="text-gray-500">Loading suggestions...</span>
	  </div>
	  <div
		v-else-if="errorSuggestions"
		class="text-center py-4 text-red-500"
	  >
		{{ errorSuggestions }}
	  </div>
	  <div
		v-else-if="suggestions && suggestions.length > 0"
		class="space-y-4"
	  >
		<h2 class="text-2xl font-semibold">
		  Suggested Recipes for this Folder
		</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		  <div
			v-for="(rec, index) in suggestions"
			:key="rec.recipe_id || index"
			class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
			@click="openRecipeModal(rec.recipe_id)"
		  >
			<img
			  :src="rec.image_url || ''"
			  :alt="rec.name"
			  class="w-full h-48 object-cover"
			  @error="(e) => {
				const target = e.target as HTMLImageElement;
				target.src = '';
			  }"
			>
			<div class="p-4">
			  <h3 class="text-lg font-semibold truncate">
				{{ rec.name }}
			  </h3>
			  <p class="text-gray-600 text-sm mt-1 line-clamp-2">
				{{ rec.description }}
			  </p>
			  <div class="flex items-center mt-2">
				<div class="flex">
				  <svg
					v-for="i in 5"
					:key="i"
					class="h-5 w-5"
					:class="i <= Math.round(rec.aggregated_rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				  >
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				  </svg>
				</div>
				<span class="ml-1 text-sm text-gray-500">
				  {{ rec.aggregated_rating ? rec.aggregated_rating.toFixed(1) : 'N/A' }}
				</span>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
  
	  <!-- Bookmarked Recipes Section -->
	  <div>
		<h2 class="text-2xl font-semibold mb-4">
		  Bookmarked Recipes
		</h2>
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
		<div
		  v-else-if="error"
		  class="text-center py-4 text-red-500"
		>
		  {{ error }}
		</div>
		<div
		  v-else-if="sortedRecipes.length > 0"
		  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
		>
		  <div
			v-for="recipe in sortedRecipes"
			:key="recipe.recipe_id"
			class="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
			@click="openRecipeModal(recipe.recipe_id)"
		  >
			<img
			  :src="recipe.image_url || ''"
			  :alt="recipe.name"
			  class="w-full h-48 object-cover"
			  @error="(e) => {
				const target = e.target as HTMLImageElement;
				target.src = '';
			  }"
			>
			<button
			  v-if="recipe.bookmark_id"
			  class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
			  @click.stop="removeBookmark(recipe.bookmark_id)"
			>
			  <svg
				class="h-4 w-4 text-red-600"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			  >
				<path
				  stroke-linecap="round"
				  stroke-linejoin="round"
				  stroke-width="2"
				  d="M6 18L18 6M6 6l12 12"
				/>
			  </svg>
			</button>
			<div class="p-4">
			  <h3 class="text-lg font-semibold truncate">
				{{ recipe.name }}
			  </h3>
			  <p class="text-gray-600 text-sm mt-1 line-clamp-2">
				{{ recipe.description }}
			  </p>
			  <div class="flex items-center mt-2">
				<div class="flex">
				  <svg
					v-for="i in 5"
					:key="i"
					class="h-5 w-5"
					:class="i <= Math.round(recipe.user_rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				  >
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				  </svg>
				</div>
				<span class="ml-1 text-sm text-gray-500">
				  {{ recipe.user_rating ? recipe.user_rating.toFixed(1) : 'N/A' }}
				</span>
			  </div>
			</div>
		  </div>
		</div>
		<div
		  v-else
		  class="text-center py-4 text-gray-500"
		>
		  <p>No recipes bookmarked in this folder yet.</p>
		  <p>
			<NuxtLink
			  to="/search"
			  class="text-blue-500 hover:underline"
			>
			  Explore recipes
			</NuxtLink>
			to add some!
		  </p>
		</div>
	  </div>
  
	  <!-- Recipe Modal -->
	  <RecipeModal
		v-if="selectedRecipe"
		:selected-recipe="selectedRecipe"
		@close="closeRecipeModal"
	  />
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { Folder, Recipe } from '~/types';
  import { useAuthStore } from '~/stores/auth';
  import { useFolderStore } from '~/stores/folder';
  import { useBookmarkStore } from '~/stores/bookmark';
  import RecipeModal from '~/components/recipe/RecipeModal.vue';
  import { searchApi, folderApi } from '~/utils/api';
  
  const folder = ref<Folder | null>(null);
  const recipes = ref<(Recipe & { bookmark_id?: number })[]>([]);
  
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const folderStore = useFolderStore();
  const bookmarkStore = useBookmarkStore();
  
  const loading = computed(() => folderStore.loading);
  const error = computed(() => folderStore.error);
  const selectedRecipe = ref(null);
  
  const sortedRecipes = computed(() => {
	return recipes.value.slice().sort((a, b) => {
	  const ratingA = a.user_rating || 0;
	  const ratingB = b.user_rating || 0;
	  return ratingB - ratingA;
	});
  });
  
  const fetchFolderDetails = async () => {
	if (!authStore.isLoggedIn) {
	  error.value = 'Please log in to view folder details.';
	  return;
	}
	try {
	  const folderId = Number(route.params.id);
	  recipes.value = await folderStore.fetchFolderDetails(folderId);
	  folder.value = folderStore.currentFolder;
	  await bookmarkStore.fetchBookmarksForFolder(folderId);
	} catch (err) {
	  console.error(err);
	}
  };
  
  const openRecipeModal = async (recipeId: number) => {
	try {
	  const response = await searchApi.getRecipe(recipeId);
	  selectedRecipe.value = response.data;
	} catch (err) {
	  console.error('Error fetching recipe:', err);
	}
  };
  
  const closeRecipeModal = () => {
	selectedRecipe.value = null;
	fetchFolderDetails();
  };
  
  onMounted(() => {
	fetchFolderDetails();
  });
  
  const suggestions = ref([]);
  const loadingSuggestions = ref(false);
  const errorSuggestions = ref<string | null>(null);
  
  const fetchFolderSuggestions = async () => {
	loadingSuggestions.value = true;
	errorSuggestions.value = null;
	suggestions.value = [];
	try {
	  const folderId = route.params.id;
	  const res = await folderApi.getFolderSuggestions(folderId);
	  suggestions.value = res.data.suggestions || [];
	} catch (err) {
	  console.error(err);
	  errorSuggestions.value = 'Failed to load suggestions.';
	} finally {
	  loadingSuggestions.value = false;
	}
  };
  
  const handleRemoveFolder = async () => {
	if (!folder.value) return;
	if (confirm('Are you sure you want to remove this folder?')) {
	  try {
		await folderApi.deleteFolder(folder.value.id);
		folderStore.deleteFolder(folder.value.id);
		router.push('/bookmarks');
	  } catch (err) {
		console.error('Error removing folder:', err);
	  }
	}
  };
  
  const removeBookmark = async (bookmarkId: number) => {
	if (confirm('Remove this recipe from the folder?')) {
	  try {
		await bookmarkStore.removeBookmark(bookmarkId);
		recipes.value = recipes.value.filter(r => r.bookmark_id !== bookmarkId);
	  } catch (err) {
		console.error('Error removing bookmark:', err);
	  }
	}
  };
  </script>