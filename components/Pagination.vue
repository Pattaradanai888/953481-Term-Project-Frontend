<template>
	<div class="flex items-center justify-center space-x-2 mt-4">
		<button
			:disabled="currentPage === 1"
			class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
			@click="changePage(currentPage - 1)"
		>
			Prev
		</button>
		<template
			v-for="page in pages"
			:key="page"
		>
			<button
				v-if="page !== '...'"
				:class="[
					'px-3 py-1 rounded',
					page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200',
				]"
				@click="changePage(page)"
			>
				{{ page }}
			</button>
			<span
				v-else
				class="px-3 py-1"
			>...</span>
		</template>
		<button
			:disabled="currentPage === totalPages"
			class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
			@click="changePage(currentPage + 1)"
		>
			Next
		</button>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	currentPage: {
		type: Number,
		required: true,
	},
	total: {
		type: Number,
		required: true,
	},
	perPage: {
		type: Number,
		default: 20,
	},
});

const emit = defineEmits(['page-changed']);

// Calculate total pages
const totalPages = computed(() => Math.ceil(props.total / props.perPage));

// Generate an array of page numbers with ellipses
const pages = computed(() => {
	const total = totalPages.value;
	// If total pages are 7 or fewer, show all pages
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}
	const pagesArray = [];
	// Near the start: show first 5 pages, then ellipsis, then last page
	if (props.currentPage <= 4) {
		for (let i = 1; i <= 5; i++) {
			pagesArray.push(i);
		}
		pagesArray.push('...');
		pagesArray.push(total);
	}
	// Near the end: show first page, ellipsis, then last 5 pages
	else if (props.currentPage >= total - 3) {
		pagesArray.push(1);
		pagesArray.push('...');
		for (let i = total - 4; i <= total; i++) {
			pagesArray.push(i);
		}
	}
	// In the middle: show first page, ellipsis, 5 pages around current, ellipsis, last page
	else {
		pagesArray.push(1);
		pagesArray.push('...');
		for (let i = props.currentPage - 2; i <= props.currentPage + 2; i++) {
			pagesArray.push(i);
		}
		pagesArray.push('...');
		pagesArray.push(total);
	}
	return pagesArray;
});

const changePage = (page) => {
	if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
		emit('page-changed', page);
	}
};
</script>
