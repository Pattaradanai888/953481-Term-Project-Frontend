<template>
	<div class="container mx-auto p-4">
	  <h1 class="text-2xl font-bold mb-4">Your Bookmarks</h1>
	  <button
		class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
		@click="openModal(false)"
	  >
		Create New Folder
	  </button>
  
	  <!-- Loading State -->
	  <div v-if="pending" class="text-center py-4">
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
		<p class="mt-2 text-gray-600">Loading folders...</p>
	  </div>
  
	  <!-- Error State -->
	  <div v-else-if="error" class="text-red-500 text-center py-4">
		{{ error.message || 'Failed to load folders.' }}
	  </div>
  
	  <!-- Folders Grid -->
	  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		<FolderCard
		  v-for="folder in folders"
		  :key="folder.id"
		  :folder="folder"
		  @edit="openModal(true, folder)"
		  @delete="deleteFolder(folder.id)"
		/>
	  </div>
  
	  <FolderModal
		:is-open="modalOpen"
		:is-editing="isEditing"
		:folder="selectedFolder"
		@close="closeModal"
		@submit="submitFolder"
	  />
	</div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useFolderStore } from '~/stores/folder';
  import FolderCard from '~/components/bookmark/FolderCard.vue';
  import FolderModal from '~/components/bookmark/FolderModal.vue';
  import { useAsyncData } from '#app';
  
  const folderStore = useFolderStore();
  
  // Fetch folders with useAsyncData for SSR compatibility
  const { data: folders, pending, error, refresh } = useAsyncData('folders', async () => {
	await folderStore.fetchFolders();
	return folderStore.getFolders;
  });
  
  const modalOpen = ref(false);
  const isEditing = ref(false);
  const selectedFolder = ref(null);
  
  const openModal = (editing, folder = null) => {
	isEditing.value = editing;
	selectedFolder.value = folder;
	modalOpen.value = true;
  };
  
  const closeModal = () => {
	modalOpen.value = false;
	selectedFolder.value = null;
  };
  
  const submitFolder = async (folderData) => {
	try {
	  if (isEditing.value) {
		await folderStore.updateFolder(selectedFolder.value.id, folderData);
	  } else {
		await folderStore.createFolder(folderData);
	  }
	  closeModal();
	  await refresh(); // Refresh folders after submission
	} catch (error) {
	  console.error('Folder submission failed:', error);
	}
  };
  
  const deleteFolder = async (id) => {
	if (confirm('Are you sure you want to delete this folder?')) {
	  try {
		await folderStore.deleteFolder(id);
		await refresh(); // Refresh folders after deletion
	  } catch (error) {
		console.error('Folder deletion failed:', error);
	  }
	}
  };
  </script>