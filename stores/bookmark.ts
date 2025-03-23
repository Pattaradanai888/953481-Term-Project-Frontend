// stores/bookmark.ts
import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { bookmarkApi } from '~/utils/api';

interface Bookmark {
	id: number;
	recipe_id: number;
	folder_id: number;
	rating: number;
}

interface BookmarkState {
	bookmarks: Bookmark[];
	loading: boolean;
	error: string | null;
}

export const useBookmarkStore = defineStore('bookmark', {
	state: (): BookmarkState => ({
		bookmarks: [],
		loading: false,
		error: null,
	}),
	getters: {
		getBookmarks: state => state.bookmarks,
	},
	actions: {
		async fetchBookmarksForFolder(folderId: number) {
			this.loading = true;
			this.error = null;
			try {
				const response = await bookmarkApi.getBookmarksForFolder(folderId);
				this.bookmarks = response.data.bookmarks;
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to fetch bookmarks';
				}
				else {
					this.error = 'Failed to fetch bookmarks';
				}
			}
			finally {
				this.loading = false;
			}
		},
		async removeBookmark(bookmarkId: number) {
			this.loading = true;
			this.error = null;
			try {
				await bookmarkApi.removeBookmark(bookmarkId);
				this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
			}
			catch (error: unknown) {
				if (error instanceof AxiosError) {
					this.error = error.response?.data?.message || 'Failed to remove bookmark';
				}
				else {
					this.error = 'Failed to remove bookmark';
				}
				throw error;
			}
			finally {
				this.loading = false;
			}
		},
	},
});
