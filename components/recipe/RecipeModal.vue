<template>
	<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
	  <div
		class="bg-white rounded-lg relative overflow-hidden"
		style="width: 1200px; max-height: 90vh;"
	  >
		<div class="overflow-y-auto p-6 max-h-full">
		  <!-- Close Button -->
		  <button
			class="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
			@click="closeRecipeModal"
		  >
			<svg
			  class="w-6 h-6"
			  fill="none"
			  stroke="currentColor"
			  viewBox="0 0 24 24"
			>
			  <path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			  />
			</svg>
		  </button>
  
		  <!-- Recipe Title -->
		  <h2 class="text-2xl font-bold mb-4">
			{{ selectedRecipe.name }}
		  </h2>
		  <img
			:src="selectedRecipe.image_url || ''"
			:alt="selectedRecipe.name"
			class="w-full h-64 object-cover rounded mb-4"
			@error="(e) => e.target.src = ''"
		  >
  
		  <!-- Tab Navigation -->
		  <div class="flex border-b mb-4">
			<button
			  :class="tabButtonClass('description')"
			  @click="setTab('description')"
			>
			  Description
			</button>
			<button
			  :class="tabButtonClass('categoryYield')"
			  @click="setTab('categoryYield')"
			>
			  Category-Yield
			</button>
			<button
			  :class="tabButtonClass('ingredient')"
			  @click="setTab('ingredient')"
			>
			  Ingredients
			</button>
			<button
			  :class="tabButtonClass('instructions')"
			  @click="setTab('instructions')"
			>
			  Instructions
			</button>
		  </div>
  
		  <!-- Tab Content Container -->
		  <div class="tab-content-container">
			<!-- Description -->
			<div
			  v-show="currentTab === 'description'"
			  class="tab-content transition-all duration-300"
			>
			  <p class="text-gray-700 mb-4">
				{{ selectedRecipe.description }}
			  </p>
			</div>
  
			<!-- Category Yield -->
			<div
			  v-show="currentTab === 'categoryYield'"
			  class="tab-content transition-all duration-300"
			>
			  <div class="space-y-2">
				<p><strong>Category:</strong> {{ selectedRecipe.category || 'N/A' }}</p>
				<p><strong>Prep Time:</strong> {{ selectedRecipe.prep_time ? `${selectedRecipe.prep_time} min` : 'N/A' }}</p>
				<p><strong>Cook Time:</strong> {{ selectedRecipe.cook_time ? `${selectedRecipe.cook_time} min` : 'N/A' }}</p>
				<p><strong>Total Time:</strong> {{ selectedRecipe.total_time ? `${selectedRecipe.total_time} min` : 'N/A' }}</p>
				<p><strong>Servings:</strong> {{ selectedRecipe.servings || 'N/A' }}</p>
				<p><strong>Yield:</strong> {{ selectedRecipe.yield || 'N/A' }}</p>
			  </div>
			</div>
  
			<!-- Ingredients -->
			<div
			  v-show="currentTab === 'ingredient'"
			  class="tab-content transition-all duration-300"
			>
			  <ul class="list-disc pl-5 mb-4">
				<li
				  v-for="(ingredient, index) in selectedRecipe.ingredients"
				  :key="index"
				>
				  {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
				  <span v-if="ingredient.preparation_note"> ({{ ingredient.preparation_note }})</span>
				</li>
			  </ul>
			</div>
  
			<!-- Instructions -->
			<div
			  v-show="currentTab === 'instructions'"
			  class="tab-content transition-all duration-300"
			>
			  <ol class="list-decimal pl-5">
				<li
				  v-for="instruction in selectedRecipe.instructions"
				  :key="instruction.step_number"
				>
				  {{ instruction.text }}
				</li>
			  </ol>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, toRef } from 'vue';
  
  const props = defineProps({
	selectedRecipe: {
	  type: Object,
	  required: true,
	},
  });
  
  // Create a reactive reference for selectedRecipe
  const selectedRecipe = toRef(props, 'selectedRecipe');
  
  const emit = defineEmits(['close']);
  const currentTab = ref('description');
  const isTransitioning = ref(false);
  
  const closeRecipeModal = () => {
	emit('close');
  };
  
  const tabButtonClass = (tab) => {
	return [
	  'px-4 py-2 -mb-px text-sm font-medium transition-all duration-200 ease-in-out',
	  currentTab.value === tab
		? 'border-b-2 border-blue-500 text-blue-500 scale-105'
		: 'text-gray-500 hover:text-blue-500',
	].join(' ');
  };
  
  const setTab = (tab) => {
	if (isTransitioning.value || currentTab.value === tab) return;
  
	isTransitioning.value = true;
	currentTab.value = tab;
  
	setTimeout(() => {
	  isTransitioning.value = false;
	}, 300);
  };
  </script>
  
  <style scoped>
  .tab-content-container {
	position: relative;
	width: 100%;
  }
  
  .tab-content {
	transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .tab-content-enter-active,
  .tab-content-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .tab-content-enter-from,
  .tab-content-leave-to {
	opacity: 0;
	transform: translateY(1rem);
  }
  </style>