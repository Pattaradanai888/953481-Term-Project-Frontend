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
					Refresh Recommendations
				</button>

				<!-- Recommendation Lists -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					<div
						v-for="(list, index) in recommendations"
						:key="index"
					>
						<h2 class="text-xl font-semibold text-gray-900 mb-3">
							{{ list.title }}
						</h2>
						<div
							v-for="recipe in list.recipes"
							:key="recipe.id"
							class="bg-white rounded-lg shadow overflow-hidden"
						>
							<img
								:src="recipe.image || '/IMG_6538.jpg'"
								:alt="recipe.title"
								class="w-full h-48 object-cover"
								loading="lazy"
								@error="(e) => e.target.src = '/images/placeholder.jpg'"
							>
							<div class="p-4">
								<h3 class="text-lg font-semibold">
									{{ recipe.title }}
								</h3>
								<p class="text-gray-600">
									{{ recipe.description }}
								</p>
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
							:src="recipe.image || '/images/placeholder.jpg'"
							:alt="recipe.title"
							class="w-full h-48 object-cover filter blur-md"
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

				<!-- Medium-Style Blocker -->
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
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const loading = ref(true);

// Sample preview recipes (For Non-Logged-In Users)
const previewRecipes = ref([
	{ id: 1, title: 'Spaghetti Carbonara', description: 'Classic Italian pasta dish.', image: '/IMG_6538.jpg' },
	{ id: 2, title: 'Chicken Salad', description: 'Healthy mix of greens.', image: '/IMG_6538.jpg' },
	{ id: 3, title: 'Beef Burger', description: 'Juicy burger with toppings.', image: '/IMG_6538.jpg' },
]);

// Recommendations for Logged-In Users
const recommendations = ref([
	{ title: 'From Your Bookmarks', recipes: [] },
	{ title: 'From a Favorite Category', recipes: [] },
	{ title: 'Random Suggestions', recipes: [] },
]);

function refreshRecommendations() {
	loading.value = true;
	setTimeout(() => {
		recommendations.value = [
			{ title: 'From Your Bookmarks', recipes: getSampleRecipes() },
			{ title: 'From a Favorite Category', recipes: getSampleRecipes() },
			{ title: 'Random Suggestions', recipes: getSampleRecipes() },
		];
		loading.value = false;
	}, 1500);
}

// Simulating API response
function getSampleRecipes() {
	return [
		{ id: 1, title: 'Vegan Bowl', description: 'A plant-based meal.', image: '/images/vegan-bowl.jpg' },
		{ id: 2, title: 'Taco Fiesta', description: 'Spicy and delicious.', image: '/images/taco.jpg' },
		{ id: 3, title: 'Berry Smoothie', description: 'Refreshing fruit smoothie.', image: '/images/smoothie.jpg' },
	];
}

onMounted(() => {
	if (isLoggedIn.value) refreshRecommendations();
});
</script>
