<template>
	<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
		<div
			class="bg-white rounded-lg relative flex flex-col"
			style="width: 1200px; max-height: 90vh;"
		>
			<!-- Close Button -->
			<button
				class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-10"
				@click="closeRecipeModal"
			>
				<svg
					class="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Header and Scrollable Content -->
			<div
				class="p-6 overflow-y-auto"
				style="flex-grow: 1;"
			>
				<!-- Recipe Header -->
				<h2 class="text-2xl font-bold mb-4">
					{{ selectedRecipe.name }}
				</h2>
				<img
					:src="selectedRecipe.image_url || ''"
					:alt="selectedRecipe.name"
					class="w-full h-64 object-cover rounded mb-4"
					@error="(e) => e.target.src = ''"
				>
				<!-- Tab Navigation -->
				<div class="flex border-b mb-4">
					<button
						:class="tabButtonClass('description')"
						@click="setTab('description')"
					>
						Description
					</button>
					<button
						:class="tabButtonClass('categoryYield')"
						@click="setTab('categoryYield')"
					>
						Category-Yield
					</button>
					<button
						:class="tabButtonClass('ingredient')"
						@click="setTab('ingredient')"
					>
						Ingredients
					</button>
					<button
						:class="tabButtonClass('instructions')"
						@click="setTab('instructions')"
					>
						Instructions
					</button>
				</div>
				<!-- Tab Content -->
				<div class="tab-content-container">
					<div
						v-show="currentTab === 'description'"
						class="tab-content transition-all duration-300"
					>
						<p class="text-gray-700 mb-4">
							{{ displayedDescription }}
						</p>
						<button
							v-if="shouldShowToggle"
							class="text-blue-500 underline mb-4"
							@click="toggleDescription"
						>
							{{ descriptionExpanded ? 'Read Less' : 'Read More' }}
						</button>
					</div>
					<div
						v-show="currentTab === 'categoryYield'"
						class="tab-content transition-all duration-300"
					>
						<div class="space-y-2">
							<p><strong>Category:</strong> {{ selectedRecipe.category || 'N/A' }}</p>
							<p><strong>Prep Time:</strong> {{ selectedRecipe.prep_time ? `${selectedRecipe.prep_time} sec` : 'N/A' }}</p>
							<p><strong>Cook Time:</strong> {{ selectedRecipe.cook_time ? `${selectedRecipe.cook_time} sec` : 'N/A' }}</p>
							<p><strong>Total Time:</strong> {{ selectedRecipe.total_time ? `${selectedRecipe.total_time} sec` : 'N/A' }}</p>
							<p><strong>Servings:</strong> {{ selectedRecipe.servings || 'N/A' }}</p>
							<p><strong>Yield:</strong> {{ selectedRecipe.yield || 'N/A' }}</p>
						</div>
					</div>
					<div
						v-show="currentTab === 'ingredient'"
						class="tab-content transition-all duration-300"
					>
						<ul class="list-disc pl-5 mb-4">
							<li
								v-for="(ingredient, index) in selectedRecipe.ingredients"
								:key="index"
							>
								{{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
								<span v-if="ingredient.preparation_note"> ({{ ingredient.preparation_note }})</span>
							</li>
						</ul>
					</div>
					<div
						v-show="currentTab === 'instructions'"
						class="tab-content transition-all duration-300"
					>
						<ol class="list-decimal pl-5">
							<li
								v-for="instruction in selectedRecipe.instructions"
								:key="instruction.step_number"
							>
								{{ instruction.text }}
							</li>
						</ol>
					</div>
				</div>
			</div>

			<!-- Fixed Bookmark and Rating Footer -->
			<div class="p-6 border-t">
				<h3 class="text-lg font-semibold mb-2">
					Bookmark Recipe
				</h3>
				<div class="flex flex-col space-y-4">
					<div>
						<label
							for="folder-select"
							class="block text-sm font-medium text-gray-700"
						>Select Folder:</label>
						<select
							id="folder-select"
							v-model="selectedFolderId"
							class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						>
							<option
								value=""
								disabled
							>
								Select a folder
							</option>
							<option
								v-for="folder in folders"
								:key="folder.id"
								:value="folder.id"
							>
								{{ folder.name }} {{ isBookmarkedInFolder(folder.id) ? '(already bookmarked)' : '' }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Rating:</label>
						<div class="flex items-center mt-1">
							<button
								v-for="star in 5"
								:key="star"
								type="button"
								class="focus:outline-none"
								@click="rating = star"
							>
								<svg
									class="h-6 w-6"
									:class="star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</button>
						</div>
					</div>
					<button
						class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
						:disabled="!selectedFolderId || rating === 0 || (selectedFolderHasBookmark && rating === currentRating) || bookmarkLoading"
						@click="saveBookmark"
					>
						{{ bookmarkLoading ? 'Saving...' : (selectedFolderHasBookmark ? 'Update Rating' : 'Bookmark Recipe') }}
					</button>
					<button
						v-if="selectedFolderHasBookmark"
						class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
						:disabled="bookmarkLoading"
						@click="removeBookmark"
					>
						{{ bookmarkLoading ? 'Removing...' : 'Remove Bookmark' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, toRef, computed } from 'vue';
import { useFolderStore } from '~/stores/folder';
import { bookmarkApi } from '~/utils/api';

const props = defineProps({
	selectedRecipe: { type: Object, required: true },
});
const selectedRecipe = toRef(props, 'selectedRecipe');
const emit = defineEmits(['close']);
const folderStore = useFolderStore();

// State
const currentTab = ref('description');
const isTransitioning = ref(false);
const selectedFolderId = ref('');
const rating = ref(0);
const bookmarkLoading = ref(false);
const bookmarks = ref([]);

// Computed Properties
const folders = computed(() => folderStore.folders);
const selectedFolderHasBookmark = computed(() => {
	if (!selectedFolderId.value) return false;
	return bookmarks.value.some(b => b.folder_id === Number(selectedFolderId.value));
});
const currentRating = computed(() => {
	if (!selectedFolderId.value) return 0;
	const bookmark = bookmarks.value.find(b => b.folder_id === Number(selectedFolderId.value));
	return bookmark ? bookmark.user_rating : 0;
});

// Description Toggle Logic
const descriptionExpanded = ref(false);
const maxDescriptionChars = 300;
const displayedDescription = computed(() => {
	const desc = selectedRecipe.value.description || '';
	if (!descriptionExpanded.value && desc.length > maxDescriptionChars) {
		return desc.substring(0, maxDescriptionChars) + '...';
	}
	return desc;
});
const shouldShowToggle = computed(() => {
	return (selectedRecipe.value.description || '').length > maxDescriptionChars;
});
const toggleDescription = () => {
	descriptionExpanded.value = !descriptionExpanded.value;
};

// Tab Navigation
const tabButtonClass = (tab) => {
	return [
		'px-4 py-2 -mb-px text-sm font-medium transition-all duration-200 ease-in-out',
		currentTab.value === tab ? 'border-b-2 border-blue-500 text-blue-500 scale-105' : 'text-gray-500 hover:text-blue-500',
	].join(' ');
};
const setTab = (tab) => {
	if (isTransitioning.value || currentTab.value === tab) return;
	isTransitioning.value = true;
	currentTab.value = tab;
	setTimeout(() => (isTransitioning.value = false), 300);
};

// Bookmark Helpers
const isBookmarkedInFolder = (folderId) => {
	return bookmarks.value.some(b => b.folder_id === folderId);
};

// Bookmark Actions
const saveBookmark = async () => {
	if (!selectedFolderId.value || rating.value === 0) return;
	bookmarkLoading.value = true;
	try {
		const response = await bookmarkApi.createBookmark(
			selectedRecipe.value.recipe_id,
			Number(selectedFolderId.value),
			rating.value,
		);
		const updatedBookmark = response.data.bookmark;
		const index = bookmarks.value.findIndex(b => b.id === updatedBookmark.id);
		if (index !== -1) {
			bookmarks.value[index] = updatedBookmark;
		}
		else {
			bookmarks.value.push(updatedBookmark);
		}
		emit('close'); // Close modal after success
	}
	catch (error) {
		console.error('Error saving bookmark:', error);
		alert('Failed to save bookmark.');
	}
	finally {
		bookmarkLoading.value = false;
	}
};

const removeBookmark = async () => {
	if (!selectedFolderId.value) return;
	const bookmark = bookmarks.value.find(b => b.folder_id === Number(selectedFolderId.value));
	if (!bookmark) return;
	bookmarkLoading.value = true;
	try {
		await bookmarkApi.removeBookmark(bookmark.id);
		bookmarks.value = bookmarks.value.filter(b => b.id !== bookmark.id);
		emit('close'); // Close modal after success
	}
	catch (error) {
		console.error('Error removing bookmark:', error);
		alert('Failed to remove bookmark.');
	}
	finally {
		bookmarkLoading.value = false;
	}
};

// Watchers
watch(selectedFolderId, (newFolderId) => {
	const bookmark = bookmarks.value.find(b => b.folder_id === Number(newFolderId));
	rating.value = bookmark ? bookmark.user_rating : 0;
});

watch(() => selectedRecipe.value, async () => {
	if (selectedRecipe.value) {
		await folderStore.fetchFolders();
		try {
			const response = await bookmarkApi.getBookmarksForRecipe(selectedRecipe.value.recipe_id);
			bookmarks.value = response.data;
		}
		catch (err) {
			console.error('Error fetching bookmarks:', err);
		}
	}
});

// Methods
const closeRecipeModal = () => {
	emit('close');
};
</script>

  <style scoped>
  .tab-content-container { position: relative; width: 100%; }
  .tab-content { transition: opacity 0.3s ease, transform 0.3s ease; }
  </style>
