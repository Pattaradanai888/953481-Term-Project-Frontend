<template>
	<div class="container mx-auto p-4">
		<NuxtLink
			to="/bookmarks"
			class="text-blue-500 hover:underline mb-4 inline-block"
		>&larr; Back to Bookmarks</NuxtLink>
		<div
			v-if="folder"
			class="mb-6"
		>
			<h1 class="text-3xl font-bold mb-2">
				{{ folder.name }}
			</h1>
			<p class="text-gray-600">
				{{ folder.description }}
			</p>
			<img
				:src="folder.coverUrl || '/default-cover.jpg'"
				alt="Folder cover"
				class="w-full h-64 object-cover rounded mt-4"
			>
		</div>
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
			class="text-red-500 text-center py-4"
		>
			{{ error }}
		</div>
		<div
			v-else-if="recipes.length > 0"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
		>
			<div
				v-for="recipe in recipes"
				:key="recipe.recipe_id"
				class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer"
				@click="openRecipeModal(recipe.recipe_id)"
			>
				<img
					:src="recipe.image_url || ''"
					:alt="recipe.name"
					class="w-full h-48 object-cover"
					@error="(e) => e.target.src = '/placeholder.jpg'"
				>
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
						<span class="ml-1 text-sm text-gray-500">{{ recipe.user_rating ? recipe.user_rating.toFixed(1) : 'N/A' }}</span>
					</div>
				</div>
			</div>
		</div>
		<div
			v-else
			class="text-gray-500 text-center py-4"
		>
			No recipes bookmarked in this folder yet.
		</div>
		<RecipeModal
			v-if="selectedRecipe"
			:selected-recipe="selectedRecipe"
			@close="closeRecipeModal"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useFolderStore } from '~/stores/folder';
import RecipeModal from '~/components/recipe/RecipeModal.vue';
import { searchApi } from '~/utils/api';

const route = useRoute();
const authStore = useAuthStore();
const folderStore = useFolderStore();

const folder = ref(null);
const recipes = ref([]);
const loading = computed(() => folderStore.loading);
const error = computed(() => folderStore.error);
const selectedRecipe = ref(null);

const fetchFolderDetails = async () => {
	if (!authStore.isLoggedIn) {
		error.value = 'Please log in to view folder details.';
		return;
	}
	try {
		const folderId = Number(route.params.id);
		recipes.value = await folderStore.fetchFolderDetails(folderId);
		folder.value = folderStore.currentFolder;
	}
	catch (err) {
		console.error(err);
	}
};

const openRecipeModal = async (recipeId) => {
	try {
		const response = await searchApi.getRecipe(recipeId);
		selectedRecipe.value = response.data;
	}
	catch (err) {
		console.error('Error fetching recipe:', err);
	}
};

const closeRecipeModal = () => {
	selectedRecipe.value = null;
};

onMounted(() => {
	fetchFolderDetails();
});
</script>
