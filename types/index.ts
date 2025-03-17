// types/index.ts

export interface User {
	user_id: number;
	username: string;
	email: string;
	created_at: string;
	last_login: string;
}

export interface Author {
	author_id: number;
	name: string;
	created_at: string;
}

export interface Recipe {
	recipe_id: number;
	name: string;
	author_id: number;
	description: string;
	category: string;
	date_published: string;
	cook_time: number;
	prep_time: number;
	total_time: number;
	aggregated_rating: number;
	review_count: number;
	recipe_servings: number;
	recipe_yield: string;
	nutrition_id: number;
	created_at: string;
	updated_at: string;
	image_url?: string; // Added for convenience, derived from recipe_images
}

export interface RecipeDetail extends Recipe {
	author?: Author;
	nutrition?: NutritionInfo;
	ingredients: RecipeIngredient[];
	instructions: RecipeInstruction[];
	categories: Category[];
	keywords: Keyword[];
	images: RecipeImage[];
	reviews?: Review[];
}

export interface NutritionInfo {
	nutrition_id: number;
	calories: number;
	fat_content: number;
	saturated_fat_content: number;
	cholesterol_content: number;
	sodium_content: number;
	carbohydrate_content: number;
	fiber_content: number;
	sugar_content: number;
	protein_content: number;
	created_at: string;
}

export interface Category {
	category_id: number;
	name: string;
}

export interface Ingredient {
	ingredient_id: number;
	name: string;
}

export interface RecipeIngredient {
	recipe_id: number;
	ingredient_id: number;
	ingredient_name: string; // Convenience field
	quantity: string;
	unit: string;
	preparation_note: string;
	display_order: number;
}

export interface Keyword {
	keyword_id: number;
	name: string;
}

export interface RecipeImage {
	image_id: number;
	recipe_id: number;
	url: string;
	is_primary: boolean;
	created_at: string;
}

export interface RecipeInstruction {
	instruction_id: number;
	recipe_id: number;
	step_number: number;
	instruction_text: string;
	created_at: string;
}

export interface Folder {
	folder_id: number;
	user_id: number;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	recipe_count?: number; // Added for convenience
}

export interface Bookmark {
	bookmark_id: number;
	user_id: number;
	recipe_id: number;
	folder_id: number;
	user_rating: number;
	notes: string;
	created_at: string;
	updated_at: string;
	recipe?: Recipe; // Added for convenience
	folder?: Folder; // Added for convenience
}

export interface Review {
	review_id: number;
	recipe_id: number;
	author_id: number;
	rating: number;
	review_text: string;
	date_submitted: string;
	date_modified: string;
	created_at: string;
	author?: Author; // Added for convenience
}

export interface Recommendation {
	recommendation_id: number;
	user_id: number;
	recipe_id: number;
	folder_id: number | null;
	score: number;
	type: string; // 'all', 'category', 'random'
	created_at: string;
	is_displayed: boolean;
	displayed_at: string | null;
	recipe?: Recipe; // Added for convenience
}

export interface SearchHistory {
	history_id: number;
	user_id: number;
	query: string;
	created_at: string;
}

export interface SpellingDictionary {
	term_id: number;
	term: string;
	frequency: number;
	created_at: string;
}

export interface SearchResponse {
	results: Recipe[];
	correctedQuery?: string;
	originalQuery: string;
	total: number;
	page: number;
	perPage: number;
}

export interface RecommendationsResponse {
	all: Recommendation[];
	byCategory: { [categoryId: number]: Recommendation[] };
	random: Recommendation[];
}
