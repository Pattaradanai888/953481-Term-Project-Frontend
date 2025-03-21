<!-- components/RecipeCard.vue -->
<template>
	<div
		class="recipe-card group"
		@click="handleClick"
	>
		<img
			:src="recipe.image_url || '/maxres2.jpg'"
			:alt="recipe.name"
			class="w-full h-48 object-cover rounded group-hover:scale-105 transition-transform duration-300"
			loading="lazy"
		>
		<div class="p-4">
			<h3 class="text-lg font-medium">
				{{ recipe.name }}
			</h3>
			<p class="text-sm text-gray-600 truncate">
				{{ recipe.description }}
			</p>
			<div class="flex flex-wrap gap-2 mt-2">
				<span
					v-for="tag in recipe.tags"
					:key="tag"
					class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
				>{{ tag }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	recipe: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(['click']);

const handleClick = () => {
	emit('click', props.recipe);
};
</script>

<style scoped>
.recipe-card {
  @apply bg-white rounded-lg shadow overflow-hidden cursor-pointer;
}
.recipe-card:hover {
  @apply shadow-lg;
}
</style>
