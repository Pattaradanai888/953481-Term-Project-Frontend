<template>
	<div class="bg-white rounded-lg shadow hover:shadow-xl transition duration-300 flex flex-col h-full">
		<div class="relative h-48">
			<img
				:src="recipe.image_url || '/maxres2.jpg'"
				alt="Recipe Image"
				class="absolute w-full h-full object-cover rounded-t-lg"
				loading="lazy"
			>
		</div>
		<div class="p-4 flex-grow flex flex-col">
			<h4 class="text-lg font-medium text-gray-800 mb-1 line-clamp-1">
				{{ recipe.name }}
			</h4>
			<p class="text-sm text-gray-600 mb-3 line-clamp-2">
				{{ recipe.description }}
			</p>
			<div class="mt-auto flex items-center">
				<div class="flex items-center">
					<svg
						v-for="i in 5"
						:key="i"
						class="h-4 w-4"
						:class="i <= Math.round(recipe.aggregated_rating || 0) ? 'text-amber-400' : 'text-gray-300'"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.908c.969 0 1.372 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.176 0l-3.977 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.085 10.1c-.784-.57-.381-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
					</svg>
				</div>
				<span class="ml-2 text-xs text-gray-500">
					{{ recipe.aggregated_rating ? recipe.aggregated_rating.toFixed(1) : 'N/A' }}
				</span>
			</div>
		</div>
		<button
			class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 transition rounded-b-lg"
			@click="$emit('view-recipe')"
		>
			View Recipe
		</button>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
	recipe: {
		type: Object,
		required: true,
	},
});

defineEmits(['view-recipe']);
</script>

  <style scoped>
  .line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
  }
  .line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
  }
  </style>
