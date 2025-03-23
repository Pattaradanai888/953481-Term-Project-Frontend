<template>
	<div class="mb-8">
		<Carousel
			:items-to-show="carouselItems"
			:items-to-scroll="carouselItems"
			:wrap-around="true"
			:autoplay="10000"
			:mouse-drag="true"
			:pause-autoplay-on-hover="true"
			:transition="500"
			:snap-align="'start'"
			class="rounded-lg overflow-hidden shadow"
		>
			<Slide
				v-for="recipe in recipes"
				:key="recipe.recipe_id"
			>
				<div class="carousel-item px-2">
					<RecommendationCard
						:recipe="recipe"
						@view-recipe="openRecipeModal(recipe)"
					/>
				</div>
			</Slide>

			<template #addons>
				<Navigation />
				<Pagination class="pagination-bottom" />
			</template>
		</Carousel>

		<!-- Recipe Modal -->
		<RecipeModal
			v-if="showRecipeModal"
			:selected-recipe="selectedRecipe"
			@close="closeRecipeModal"
		/>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import RecommendationCard from '~/components/RecommendationCard.vue';
import RecipeModal from '~/components/recipe/RecipeModal.vue';

const props = defineProps({
	recipes: {
		type: Array,
		required: true,
	},
});

// Reactive window width to handle resizing
const windowWidth = ref(window.innerWidth);

// Recipe modal state
const showRecipeModal = ref(false);
const selectedRecipe = ref(null);

const carouselItems = computed(() => {
	if (windowWidth.value < 640) return 1;
	else if (windowWidth.value < 1024) return 2;
	else return 3;
});

// Update windowWidth when the window is resized
const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

// Modal handlers
const openRecipeModal = (recipe) => {
	selectedRecipe.value = recipe;
	showRecipeModal.value = true;
};

const closeRecipeModal = () => {
	showRecipeModal.value = false;
};

onMounted(() => {
	window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
});
</script>

  <style scoped>
  .carousel-item {
	height: 100%;
	display: flex;
	flex-direction: column;
  }

  /* Custom navigation and pagination styles */
  :deep(.carousel__prev),
  :deep(.carousel__next) {
	background-color: rgba(79, 70, 229, 0.7);
	border-radius: 9999px;
	color: white;
	width: 36px;
	height: 36px;
	font-size: 1rem;
	transition: background-color 0.3s;
  }

  :deep(.carousel__prev:hover),
  :deep(.carousel__next:hover) {
	background-color: rgba(79, 70, 229, 0.9);
  }

  /* Adjusted pagination to avoid overlapping with the View Recipe button */
  :deep(.pagination-bottom) {
	position: relative;
	margin-top: 1rem;
	padding-top: 0.5rem;
	bottom: auto;
  }

  :deep(.carousel__pagination-button) {
	background-color: rgba(209, 213, 219, 0.5);
	width: 8px;
	height: 8px;
	border-radius: 9999px;
	transition: all 0.3s;
  }

  :deep(.carousel__pagination-button--active) {
	background-color: rgba(79, 70, 229, 0.8);
	width: 32px;
	border-radius: 9999px;
  }
  </style>
