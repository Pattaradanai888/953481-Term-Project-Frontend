<template>
	<transition name="modal">
		<div
			v-if="isOpen"
			class="fixed z-50 inset-0 overflow-y-auto"
		>
			<div class="flex items-center justify-center min-h-screen px-4">
				<div
					class="fixed inset-0 bg-black opacity-50"
					@click="close"
				/>
				<div class="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full z-50">
					<div class="px-6 py-4">
						<h3 class="text-xl leading-6 font-medium text-white mb-4">
							{{ isEditing ? 'Edit Folder' : 'Create New Folder' }}
						</h3>
						<form @submit.prevent="submit">
							<div
								v-if="isEditing && folder?.coverUrl"
								class="mb-4"
							>
								<label class="block text-sm font-medium text-gray-300 mb-1">Current Cover</label>
								<img
									:src="folder.coverUrl"
									alt="Current cover"
									class="w-32 h-32 object-cover"
								>
							</div>
							<div class="mb-4">
								<label class="block text-sm font-medium text-gray-300 mb-1">Folder Name</label>
								<input
									v-model="localFolderName"
									type="text"
									required
									class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
								>
							</div>
							<div class="mb-4">
								<label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
								<textarea
									v-model="localFolderDesc"
									class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
								/>
							</div>
							<div class="mb-4">
								<label class="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
								<input
									type="file"
									accept="image/*"
									class="w-full text-white"
									@change="handleFileChange"
								>
							</div>
							<div class="flex justify-end">
								<button
									type="button"
									class="mr-3 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
									@click="close"
								>
									Cancel
								</button>
								<button
									type="submit"
									class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
								>
									{{ isEditing ? 'Update' : 'Create' }}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const { isOpen, isEditing = false, folder = null } = defineProps({
	isOpen: { type: Boolean, required: true },
	isEditing: { type: Boolean, default: false },
	folder: { type: Object, default: null },
});

const emit = defineEmits(['close', 'submit']);

const localFolderName = ref('');
const localFolderDesc = ref('');
const coverFile = ref(null);

watch(() => isOpen, (newIsOpen) => {
	if (newIsOpen) {
		if (folder && isEditing) {
			localFolderName.value = folder.name || '';
			localFolderDesc.value = folder.description || '';
		}
	}
	else {
		localFolderName.value = '';
		localFolderDesc.value = '';
		coverFile.value = null;
	}
});

const handleFileChange = (e) => {
	coverFile.value = e.target.files[0];
};

const close = () => {
	emit('close');
};

const submit = () => {
	emit('submit', {
		name: localFolderName.value,
		description: localFolderDesc.value,
		coverFile: coverFile.value,
	});
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
