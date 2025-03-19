<template>
	<div
		class="recipe-card"
		@click="handleClick"
	>
		<img
			:src="recipe.image"
			:alt="recipe.name"
		>
		<h3>{{ recipe.name }}</h3>
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
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: scale(1.05);
}

img {
  width: 100%;
  height: 200px; /* Adjust as needed */
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

h3 {
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
