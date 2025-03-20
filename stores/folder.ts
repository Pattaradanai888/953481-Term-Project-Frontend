// stores/folder.ts
import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { folderApi } from '~/utils/api';

interface Folder {
	id: number;
	name: string;
	description?: string;
	coverUrl?: string;
	recipe_count: number;
}

interface FolderState {
	folders: Folder[];
	currentFolder: Folder | null;
	loading: boolean;
	error: string | null;
}

export const useFolderStore = defineStore('folder', {
	state: (): FolderState => ({
		folders: [],
		currentFolder: null,
		loading: false,
		error: null,
	}),

	getters: {
		getFolders: state => state.folders,
		getCurrentFolder: state => state.currentFolder,
	},

	actions: {
		async fetchFolders() {
			this.loading = true;
			this.error = null;
			try {
				const response = await folderApi.getFolders();
				this.folders = response.data; // Axios wraps response in `data`
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to fetch folders';
				}
				else {
					this.error = 'Failed to fetch folders';
				}
				console.error('Error fetching folders:', error);
			}
			finally {
				this.loading = false;
			}
		},

		async fetchFolderDetails(folderId: number) {
			this.loading = true;
			this.error = null;
			try {
				const response = await folderApi.getFolderDetails(folderId);
				this.currentFolder = response.data.folder;
				return response.data.recipes; // Return recipes for the component
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to fetch folder details';
				}
				else {
					this.error = 'Failed to fetch folder details';
				}
				console.error('Error fetching folder details:', error);
				throw error;
			}
			finally {
				this.loading = false;
			}
		},

		async createFolder(folderData: { name: string; description?: string; coverFile?: File }) {
			this.loading = true;
			this.error = null;
			const formData = new FormData();
			formData.append('name', folderData.name);
			formData.append('description', folderData.description || '');
			if (folderData.coverFile) formData.append('cover', folderData.coverFile);
			try {
				const response = await folderApi.createFolder(formData);
				this.folders.push(response.data);
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to create folder';
				}
				else {
					this.error = 'Failed to create folder';
				}
				console.error('Error creating folder:', error);
				throw error;
			}
			finally {
				this.loading = false;
			}
		},

		async updateFolder(folderId: number, folderData: { name: string; description?: string; coverFile?: File }) {
			this.loading = true;
			this.error = null;
			const formData = new FormData();
			formData.append('name', folderData.name);
			formData.append('description', folderData.description || '');
			if (folderData.coverFile) formData.append('cover', folderData.coverFile);
			try {
				const response = await folderApi.updateFolder(folderId, formData);
				const index = this.folders.findIndex(f => f.id === folderId);
				if (index !== -1) this.folders[index] = response.data;
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to update folder';
				}
				else {
					this.error = 'Failed to update folder';
				}
				console.error('Error updating folder:', error);
				throw error;
			}
			finally {
				this.loading = false;
			}
		},

		async deleteFolder(folderId: number) {
			this.loading = true;
			this.error = null;
			try {
				await folderApi.deleteFolder(folderId);
				this.folders = this.folders.filter(f => f.id !== folderId);
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to delete folder';
				}
				else {
					this.error = 'Failed to delete folder';
				}
				console.error('Error deleting folder:', error);
				throw error;
			}
			finally {
				this.loading = false;
			}
		},
	},
});
