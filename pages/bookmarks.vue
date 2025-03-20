<template>
	<div class="container mx-auto p-4">
		<h1 class="text-2xl font-bold mb-4">
			Your Bookmarks
		</h1>
		<button
			class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
			@click="openModal(false)"
		>
			Create New Folder
		</button>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
import { ref, computed, onMounted } from 'vue';
import { useFolderStore } from '~/stores/folder';
import FolderCard from '~/components/bookmark/FolderCard.vue';
import FolderModal from '~/components/bookmark/FolderModal.vue';

const folderStore = useFolderStore();
const folders = computed(() => folderStore.folders);
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
		}
		else {
			await folderStore.createFolder(folderData);
		}
		closeModal();
	}
	catch (error) {
		console.error('Folder submission failed:', error);
	}
};

const deleteFolder = async (id) => {
	if (confirm('Are you sure you want to delete this folder?')) {
		try {
			await folderStore.deleteFolder(id);
		}
		catch (error) {
			console.error('Folder deletion failed:', error);
		}
	}
};

onMounted(() => {
	folderStore.fetchFolders();
});
</script>
