<template>
	<transition name="modal">
		<div
			v-if="isOpen"
			class="fixed z-50 inset-0 overflow-y-auto"
		>
			<div class="flex items-center justify-center min-h-screen px-4">
				<!-- Overlay -->
				<div
					class="fixed inset-0 bg-gray-900 opacity-40"
					@click="close"
				/>

				<!-- Modal Content -->
				<div class="relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full z-50 p-6">
					<h3 class="text-xl font-semibold text-gray-900 mb-6">
						{{ isEditing ? 'Edit Folder' : 'Create New Folder' }}
					</h3>

					<form
						class="space-y-6"
						@submit.prevent="submit"
					>
						<!-- Current Cover (if editing) -->
						<div
							v-if="isEditing && folder?.coverUrl"
							class="space-y-2"
						>
							<label class="block text-sm font-medium text-gray-700">Current Cover</label>
							<img
								:src="folder.coverUrl"
								alt="Current cover"
								class="w-32 h-32 object-cover rounded-md border border-gray-300"
							>
						</div>

						<!-- Folder Name -->
						<div class="space-y-2">
							<label class="block text-sm font-medium text-gray-700">Folder Name</label>
							<input
								v-model="localFolderName"
								type="text"
								required
								class="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								placeholder="Enter folder name"
							>
						</div>

						<!-- Description -->
						<div class="space-y-2">
							<label class="block text-sm font-medium text-gray-700">Description</label>
							<textarea
								v-model="localFolderDesc"
								class="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								rows="3"
								placeholder="Add a description (optional)"
							/>
						</div>

						<!-- Cover Image -->
						<div class="space-y-2">
							<label class="block text-sm font-medium text-gray-700">Cover Image</label>
							<input
								type="file"
								accept="image/*"
								class="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
								@change="handleFileChange"
							>
							<!-- Preview if file selected -->
							<div
								v-if="coverPreview"
								class="mt-2"
							>
								<img
									:src="coverPreview"
									alt="Cover preview"
									class="w-32 h-32 object-cover rounded-md border border-gray-300"
								>
							</div>
						</div>

						<!-- Buttons -->
						<div class="flex justify-end space-x-3">
							<button
								type="button"
								class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
								@click="close"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
								:disabled="!localFolderName"
							>
								{{ isEditing ? 'Update' : 'Create' }}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	isOpen: { type: Boolean, required: true },
	isEditing: { type: Boolean, default: false },
	folder: { type: Object, default: null },
});

const emit = defineEmits(['close', 'submit']);

const localFolderName = ref('');
const localFolderDesc = ref('');
const coverFile = ref(null);
const coverPreview = ref(null);

watch(() => props.isOpen, (newIsOpen) => {
	if (newIsOpen) {
		if (props.folder && props.isEditing) {
			localFolderName.value = props.folder.name || '';
			localFolderDesc.value = props.folder.description || '';
		}
	}
	else {
		localFolderName.value = '';
		localFolderDesc.value = '';
		coverFile.value = null;
		coverPreview.value = null;
	}
});

const handleFileChange = (e) => {
	const file = e.target.files[0];
	coverFile.value = file;
	if (file) {
		coverPreview.value = URL.createObjectURL(file);
	}
	else {
		coverPreview.value = null;
	}
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
  .modal-enter-active,
  .modal-leave-active {
	transition: opacity 0.3s ease;
  }
  .modal-enter-from,
  .modal-leave-to {
	opacity: 0;
  }
  </style>
