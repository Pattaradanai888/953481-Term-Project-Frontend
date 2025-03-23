<template>
	<div
		class="relative group rounded-lg overflow-hidden shadow-xl cursor-pointer transform transition duration-300 hover:scale-105"
		:class="{ 'ring-2 ring-indigo-500 ring-offset-2': selected }"
		@click="handleClick"
	>
		<div
			class="w-full h-48 bg-cover bg-center"
			:style="{ backgroundImage: 'url(' + (folder.coverUrl || defaultCover) + ')' }"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition" />
		<div class="absolute bottom-0 left-0 p-4">
			<h2 class="text-xl font-bold text-white">
				{{ folder.name }}
			</h2>
			<p class="text-sm text-gray-200">
				{{ folder.description }}
			</p>
			<p class="text-sm text-gray-200">
				{{ folder.recipe_count }} recipes
			</p>
		</div>
		<div class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
			<button
				class="text-white hover:text-blue-300"
				@click.stop="$emit('edit', folder)"
			>
				<i class="fas fa-edit" />
			</button>
			<button
				class="text-white hover:text-red-300"
				@click.stop="$emit('delete', folder.id)"
			>
				<i class="fas fa-trash" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
	folder: { type: Object, required: true },
	defaultCover: { type: String, default: '/default-cover.jpg' },
	selected: { type: Boolean, default: false },
	mode: { type: String, default: 'navigate' }, // 'navigate' or 'select'
});

const emit = defineEmits(['edit', 'delete', 'select']);
const router = useRouter();

const handleClick = () => {
	if (props.mode === 'select') {
		// For index page: emit select event to filter recommendations
		emit('select', props.folder.id);
	}
	else {
		// For bookmark page: navigate to folder details
		router.push(`/folders/${props.folder.id}`);
	}
};
</script>
