<template>
	<div>
		<!-- Hero Banner Section -->
		<section class="relative">
			<img
				src="/premium_photo-1673108852141-e8c3c22a4a22.jpg"
				alt="Table of food"
				class="w-full h-[375px] object-cover"
			>
			<div class="absolute inset-0 bg-black opacity-40" />
			<div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
				<h1 class="text-4xl font-extrabold text-white sm:text-5xl">
					Find and save your favorite dishes
				</h1>
				<p class="mt-4 max-w-xl text-xl text-white">
					Get personalized recipe recommendations and bookmark your favorites.
				</p>
			</div>
		</section>

		<!-- Main Content Section -->
		<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<!-- Recommendations for Logged-In Users -->
			<div v-if="isLoggedIn">
				<h1 class="text-3xl font-bold text-gray-900 mb-8">
					Your Personalized Recommendations
				</h1>

				<!-- Refresh Button for Recommendations -->
				<button
					class="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
					@click="refreshRecommendations"
				>
					<span
						v-if="loading"
						class="inline-block mr-2"
					>
						<svg
							class="animate-spin h-5 w-5 text-white"
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
					</span>
					{{ loading ? 'Loading...' : 'Refresh Recommendations' }}
				</button>

				<!-- Folder Selection -->
				<div
					v-if="folders.length > 0"
					class="mb-6"
				>
					<label
						for="folder-select"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Filter recommendations by folder:
					</label>
					<select
						id="folder-select"
						v-model="selectedFolder"
						class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						@change="getRecommendationsByFolder"
					>
						<option value="">
							All Folders
						</option>
						<option
							v-for="folder in folders"
							:key="folder.folder_id"
							:value="folder.folder_id"
						>
							{{ folder.name }}
						</option>
					</select>
				</div>

				<!-- Recommendation Lists -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					<div
						v-for="(list, index) in recommendationLists"
						:key="index"
						class="space-y-6"
					>
						<h2 class="text-xl font-semibold text-gray-900 mb-3">
							{{ list.title }}
						</h2>
						<div
							v-if="list.recipes.length === 0 && !loading"
							class="bg-gray-50 rounded-lg p-6 text-center"
						>
							<p class="text-gray-500">
								No recipes found in this category.
							</p>
						</div>
						<div
							v-for="recipe in list.recipes"
							:key="recipe.recipe_id"
							class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition cursor-pointer"
							@click="viewRecipeDetails(recipe)"
						>
							<img
								:src="recipe.image_url || '/IMG_6538.jpg'"
								:alt="recipe.name"
								class="w-full h-48 object-cover"
								loading="lazy"
								@error="(e) => e.target.src = '/IMG_6538.jpg'"
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
											:class="i <= Math.round(recipe.aggregated_rating) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
										>
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											/>
										</svg>
									</div>
									<span class="ml-1 text-sm text-gray-500">
										{{ recipe.aggregated_rating.toFixed(1) }} ({{ recipe.review_count }})
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Blocked Content for Non-Signed-In Users -->
			<div
				v-else
				class="relative"
			>
				<h1 class="text-3xl font-bold text-gray-900 mb-8">
					Featured Recipes
				</h1>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					<div
						v-for="recipe in previewRecipes"
						:key="recipe.id"
						class="bg-white rounded-lg shadow overflow-hidden relative"
					>
						<img
							:src="recipe.image || ''"
							:alt="recipe.title"
							class="w-full h-48 object-cover filter blur-sm"
							loading="lazy"
						>
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-800">
								{{ recipe.title }}
							</h3>
							<p class="text-gray-600">
								{{ recipe.description }}
							</p>
						</div>
					</div>
				</div>
				<!-- Medium-Style Blocker Overlay -->
				<div class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
					<h2 class="text-3xl font-bold text-white">
						Join FoodBookmark Today
					</h2>
					<p class="mt-4 text-lg text-white">
						Unlock 200k+ recipes and personalized recommendations.
					</p>
					<div class="mt-6 flex flex-col sm:flex-row justify-center">
						<NuxtLink
							to="/register"
							class="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
						>
							Sign Up
						</NuxtLink>
						<NuxtLink
							to="/login"
							class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-3 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
						>
							Sign In
						</NuxtLink>
					</div>
				</div>
			</div>
		</section>

		<!-- Recipe Detail Modal -->
		<div
			v-if="showModal"
			class="fixed inset-0 z-50 overflow-y-auto"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<!-- Background overlay -->
				<div
					class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
					@click="closeModal"
				/>
				<!-- Modal panel -->
				<div
					class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
				>
					<div
						v-if="selectedRecipe"
						class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
					>
						<div class="sm:flex sm:items-start">
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
								<h3
									id="modal-title"
									class="text-lg leading-6 font-medium text-gray-900"
								>
									{{ selectedRecipe.name }}
								</h3>
								<div class="mt-4">
									<img
										:src="selectedRecipe.image_url || '/IMG_6538.jpg'"
										:alt="selectedRecipe.name"
										class="w-full h-48 object-cover rounded-md"
									>
									<div class="mt-4 space-y-4">
										<p class="text-sm text-gray-500">
											{{ selectedRecipe.description }}
										</p>
										<!-- Recipe details -->
										<div v-if="recipeDetails">
											<!-- Ingredients -->
											<h4 class="font-medium text-gray-900 mt-4">
												Ingredients
											</h4>
											<ul class="list-disc pl-5 mt-2 text-sm text-gray-600">
												<li
													v-for="ingredient in recipeDetails.ingredients"
													:key="ingredient.ingredient_id"
												>
													{{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.ingredient_name }} {{ ingredient.preparation_note }}
												</li>
											</ul>
											<!-- Instructions -->
											<h4 class="font-medium text-gray-900 mt-4">
												Instructions
											</h4>
											<ol class="list-decimal pl-5 mt-2 text-sm text-gray-600">
												<li
													v-for="instruction in recipeDetails.instructions"
													:key="instruction.instruction_id"
													class="mb-2"
												>
													{{ instruction.instruction_text }}
												</li>
											</ol>
										</div>
										<div
											v-else
											class="text-center py-4"
										>
											<svg
												class="animate-spin h-5 w-5 text-indigo-500 mx-auto"
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
											<p class="mt-2 text-sm text-gray-500">
												Loading recipe details...
											</p>
										</div>
										<!-- Bookmark Controls -->
										<div class="mt-4 border-t pt-4">
											<div class="flex flex-col space-y-3">
												<label
													for="folder-dropdown"
													class="block text-sm font-medium text-gray-700"
												>
													Bookmark to folder:
												</label>
												<select
													id="folder-dropdown"
													v-model="selectedFolderForBookmark"
													class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
												>
													<option
														disabled
														value=""
													>
														Select a folder
													</option>
													<option
														v-for="folder in folders"
														:key="folder.folder_id"
														:value="folder.folder_id"
													>
														{{ folder.name }}
													</option>
												</select>
												<div>
													<label class="block text-sm font-medium text-gray-700">
														Rating:
													</label>
													<div class="flex items-center mt-1">
														<button
															v-for="star in 5"
															:key="star"
															type="button"
															class="focus:outline-none"
															@click="bookmarkRating = star"
														>
															<svg
																class="h-6 w-6"
																:class="star <= bookmarkRating ? 'text-amber-400' : 'text-gray-300'"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
																/>
															</svg>
														</button>
													</div>
													<button
														class="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
														@click="bookmarkRecipe"
													>
														Bookmark Recipe
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<button
							type="button"
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							@click="closeModal"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const loading = ref(false);

// For Recommendations (Logged-In Users)
const recommendationLists = ref([
	{ title: 'From Your Bookmarks', recipes: [] },
	{ title: 'From a Favorite Category', recipes: [] },
	{ title: 'Random Suggestions', recipes: [] },
]);

// Sample preview recipes for non-signed-in users
const previewRecipes = ref([
	{ id: 1, title: 'Spaghetti Carbonara', description: 'Classic Italian pasta dish.', image: '' },
	{ id: 2, title: 'Chicken Salad', description: 'Healthy mix of greens.', image: '' },
	{ id: 3, title: 'Beef Burger', description: 'Juicy burger with toppings.', image: '' },
]);

// Folder data for bookmarking
const folders = ref([
	{ folder_id: 1, name: 'Favorites' },
	{ folder_id: 2, name: 'To Try' },
	{ folder_id: 3, name: 'Healthy Choices' },
]);

// Selected folder for filtering recommendations and bookmarking
const selectedFolder = ref('');
const selectedFolderForBookmark = ref('');

// Bookmark rating
const bookmarkRating = ref(0);

// For Recipe Modal
const showModal = ref(false);
const selectedRecipe = ref(null);
const recipeDetails = ref(null);

function refreshRecommendations() {
	loading.value = true;
	// Simulate API call delay
	setTimeout(() => {
		recommendationLists.value = [
			{ title: 'From Your Bookmarks', recipes: getSampleRecipes() },
			{ title: 'From a Favorite Category', recipes: getSampleRecipes() },
			{ title: 'Random Suggestions', recipes: getSampleRecipes() },
		];
		loading.value = false;
	}, 1500);
}

function getSampleRecipes() {
	return [
		{
			recipe_id: 1,
			name: 'Vegan Bowl',
			description: 'A plant-based meal.',
			image_url: '',
			aggregated_rating: 4.2,
			review_count: 120,
		},
		{
			recipe_id: 2,
			name: 'Taco Fiesta',
			description: 'Spicy and delicious.',
			image_url: '',
			aggregated_rating: 4.5,
			review_count: 200,
		},
		{
			recipe_id: 3,
			name: 'Berry Smoothie',
			description: 'Refreshing fruit smoothie.',
			image_url: '',
			aggregated_rating: 4.0,
			review_count: 85,
		},
	];
}

function getRecommendationsByFolder() {
	// Filter recommendations based on selected folder.
	// For demonstration, we'll simply refresh recommendations.
	refreshRecommendations();
}

function viewRecipeDetails(recipe) {
	selectedRecipe.value = recipe;
	showModal.value = true;
	// Simulate fetching detailed recipe info
	recipeDetails.value = null;
	setTimeout(() => {
		recipeDetails.value = {
			ingredients: [
				{ ingredient_id: 1, quantity: '200', unit: 'g', ingredient_name: 'Pasta', preparation_note: '' },
				{ ingredient_id: 2, quantity: '100', unit: 'g', ingredient_name: 'Pancetta', preparation_note: 'diced' },
				{ ingredient_id: 3, quantity: '2', unit: '', ingredient_name: 'Eggs', preparation_note: 'beaten' },
			],
			instructions: [
				{ instruction_id: 1, instruction_text: 'Boil pasta until al dente.' },
				{ instruction_id: 2, instruction_text: 'Fry pancetta until crispy.' },
				{ instruction_id: 3, instruction_text: 'Mix eggs with cheese and combine with pasta and pancetta.' },
			],
		};
	}, 1000);
}

function closeModal() {
	showModal.value = false;
	selectedRecipe.value = null;
	recipeDetails.value = null;
}

function bookmarkRecipe() {
	// Logic to bookmark the recipe with selectedFolderForBookmark and bookmarkRating
	alert(`Recipe bookmarked in folder ${selectedFolderForBookmark.value} with rating ${bookmarkRating.value}`);
	// Reset selection after bookmarking
	selectedFolderForBookmark.value = '';
	bookmarkRating.value = 0;
}

onMounted(() => {
	if (isLoggedIn.value) {
		refreshRecommendations();
	}
});
</script>

  <style scoped>
  /* Optional custom style for line-clamp (if not using Tailwind's plugin) */
  .line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
  }
  </style>
