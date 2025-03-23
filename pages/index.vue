<template>
	<div>
		<!-- Hero Banner (unchanged) -->
		<section class="relative">
			<img
				src="/premium_photo-1673108852141-e8c3c22a4a22.jpg"
				alt="Delicious dishes"
				class="w-full h-80 object-cover"
			>
			<div class="absolute inset-0 bg-black opacity-50" />
			<div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
				<h1 class="text-4xl font-bold">
					Discover Your Next Favorite Dish
				</h1>
				<p class="mt-2 text-lg">
					Personalized recommendations tailored just for you.
				</p>
			</div>
		</section>

		<!-- Main Content -->
		<section class="max-w-6xl mx-auto px-4 py-8">
			<div v-if="isLoggedIn">
				<!-- Welcome Section -->
				<div class="text-center mb-8">
					<h1 class="text-3xl font-bold text-gray-800">
						Welcome back, {{ user?.username || 'User' }}!
					</h1>
					<p class="text-gray-600 mt-2">
						Ready to explore more recipes?
					</p>
				</div>

				<!-- Folder Selection -->
				<div
					v-if="folders.length > 0"
					class="mb-8"
				>
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-xl font-semibold">
							Your Folders
						</h2>
						<div class="flex items-center space-x-4">
							<button
								v-if="selectedFolder"
								class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
								@click="clearFolderSelection"
							>
								<span class="mr-1">Clear Selection</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
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
							<NuxtLink
								to="/bookmarks"
								class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
							>
								<span class="mr-1">View All Bookmarks</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
									/>
								</svg>
							</NuxtLink>
						</div>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						<FolderCard
							v-for="folder in folders"
							:key="folder.id"
							:folder="folder"
							:selected="selectedFolder === folder.id"
							mode="select"
							@select="selectFolder"
						/>
					</div>
				</div>

				<!-- Recommendations Section -->
				<div
					v-if="isLoggedIn"
					class="mb-12"
				>
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-2xl font-bold text-gray-800">
							{{ selectedFolder ? 'Recommendations for Your Selected Folder' : 'Your Personalized Recommendations' }}
						</h2>
						<button
							:disabled="loading"
							class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center transition-all"
							@click="refreshRecommendations"
						>
							<svg
								v-if="loading"
								class="animate-spin h-5 w-5 mr-2"
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
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
							{{ loading ? 'Refreshing...' : 'Refresh' }}
						</button>
					</div>

					<!-- Recommendation Lists: each displayed in a carousel -->
					<div v-if="recommendationLists.length">
						<div
							v-for="(list, index) in recommendationLists"
							:key="index"
							class="mb-12"
						>
							<h3 class="text-xl font-semibold text-gray-700 mb-4">
								{{ list.title }}
							</h3>
							<!-- Use the carousel component for each recommendation list -->
							<RecommendationCarousel :recipes="list.recipes" />
						</div>
					</div>
					<!-- Loading, No Recommendations, and Error States as before... -->
					<div
						v-else-if="loading"
						class="bg-white rounded-lg shadow-lg p-8 text-center"
					>
						<div class="flex flex-col items-center justify-center py-8">
							<svg
								class="animate-spin h-12 w-12 text-indigo-500 mb-4"
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
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
							<p class="text-lg text-gray-600">
								Preparing your personalized recommendations...
							</p>
						</div>
					</div>
					<div
						v-else-if="!loading && !recommendationLists.length"
						class="bg-white rounded-lg shadow-lg p-8 text-center"
					>
						<div class="flex flex-col items-center py-8">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-16 w-16 text-gray-400 mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
							<h3 class="text-xl font-semibold text-gray-700 mb-2">
								No recommendations available yet
							</h3>
							<p class="text-gray-600 mb-6">
								Start bookmarking dishes you like to see personalized recommendations!
							</p>
							<NuxtLink
								to="/explore"
								class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
							>
								Explore Recipes
							</NuxtLink>
						</div>
					</div>
					<div
						v-if="error"
						class="mt-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-start"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mr-2 mt-0.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{{ error }}
					</div>
				</div>
			</div>

			<!-- Non-Logged-In Content (unchanged) -->
			<div
				v-else
				class="text-center py-12"
			>
				<h1 class="text-2xl font-bold text-gray-800 mb-4">
					Welcome to FoodBookmark
				</h1>
				<p class="text-gray-600 mb-6">
					Sign up to unlock personalized recipe recommendations.
				</p>
				<NuxtLink
					to="/register"
					class="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
				>
					Sign Up Now
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRecommendationsStore } from '~/stores/recommendations';
import FolderCard from '~/components/bookmark/FolderCard.vue';
import { useFolderStore } from '~/stores/folder';
import RecommendationCard from '~/components/RecommendationCard.vue'; // New component for individual recipe cards

const authStore = useAuthStore();
const recommendationsStore = useRecommendationsStore();
const folderStore = useFolderStore();

const user = computed(() => authStore.user);
const isLoggedIn = computed(() => authStore.isLoggedIn);
const selectedFolder = ref<number | null>(null);

// RecommendationLists object structure: { all: Recipe[], folder: Recipe[], random: Recipe[] }
const recommendationLists = computed(() => recommendationsStore.recommendationLists);
const loading = computed(() => recommendationsStore.loading);
const error = computed(() => recommendationsStore.error);
const folders = computed(() => folderStore.folders);

// Watch for auth state changes
watch(() => isLoggedIn.value, async (newValue) => {
	if (newValue) {
		await loadInitialData();
	}
}, { immediate: true });

async function loadInitialData() {
	try {
		recommendationsStore.$patch({ loading: true });
		await Promise.all([
			folderStore.fetchFolders(),
			recommendationsStore.fetchRecommendations(),
		]);
	}
	catch (error) {
		console.error('Error loading initial data:', error);
	}
}

async function selectFolder(folderId: number) {
	if (selectedFolder.value === folderId) return;
	selectedFolder.value = folderId;
	await recommendationsStore.fetchRecommendations(folderId);
}

async function clearFolderSelection() {
	selectedFolder.value = null;
	await recommendationsStore.fetchRecommendations();
}

async function refreshRecommendations() {
	const folderId = selectedFolder.value;
	await recommendationsStore.refreshRecommendations(folderId || undefined);
}

onMounted(async () => {
	if (isLoggedIn.value) {
		await loadInitialData();
	}
});
</script>

  <style scoped>
  .line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
  }

  .line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
  }
  </style>
