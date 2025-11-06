/**
 * Shared Interfaces & Types
 * Used across Renderer, Preload, and Main processes
 * 
 * NO 'any' types - fully type-safe throughout the application
 */

// ============ COMMON TYPES ============
/** Type-safe API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Error response with detailed information */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// ============ USER TYPES ============
export interface User {
  id: bigint;
  email: string;
  name: string;
  createdAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  id: bigint;
  name?: string;
  email?: string;
}

export interface UserListResponse {
  users: User[];
  count: number;
}

// ============ INGREDIENT TYPES ============
export interface Ingredient {
  id: bigint;
  name: string;
  kcalPer100g: number;
  proteinGPer100g: number;
  carbsGPer100g: number;
  fatGPer100g: number;
  createdAt: Date;
}

export interface CreateIngredientRequest {
  name: string;
  kcalPer100g: number;
  proteinGPer100g: number;
  carbsGPer100g: number;
  fatGPer100g: number;
}

export interface UpdateIngredientRequest {
  id: bigint;
  name?: string;
  kcalPer100g?: number;
  proteinGPer100g?: number;
  carbsGPer100g?: number;
  fatGPer100g?: number;
}

export interface NutritionRange {
  minKcal: number;
  maxKcal: number;
  minProtein: number;
  maxProtein: number;
}

export interface IngredientListResponse {
  ingredients: Ingredient[];
  count: number;
}

// ============ RECIPE TYPES ============
export interface Recipe {
  id: bigint;
  userId: bigint | null;
  name: string;
  servings: number;
  kcalPerServing: number;
  proteinGPerServing: number;
  carbsGPerServing: number;
  fatGPerServing: number;
  createdAt: Date;
}

export interface CreateRecipeRequest {
  name: string;
  servings: number;
  kcalPerServing: number;
  proteinGPerServing: number;
  carbsGPerServing: number;
  fatGPerServing: number;
  userId?: bigint;
}

export interface UpdateRecipeRequest {
  id: bigint;
  name?: string;
  servings?: number;
  kcalPerServing?: number;
  proteinGPerServing?: number;
  carbsGPerServing?: number;
  fatGPerServing?: number;
}

export interface RecipeIngredient {
  recipeId: bigint;
  ingredientId: bigint;
  qtyGrams: number;
  notes?: string;
}

export interface AddRecipeIngredientRequest {
  recipeId: bigint;
  ingredientId: bigint;
  qtyGrams: number;
  notes?: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  count: number;
}

export interface RecipeDetailResponse extends Recipe {
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[];
}

// ============ INVENTORY TYPES ============
export interface Inventory {
  id: bigint;
  userId: bigint;
  createdAt: Date;
}

export interface InventoryIngredient {
  inventaireId: bigint;
  ingredientId: bigint;
  qtyGrams: number;
}

export interface AddToInventoryRequest {
  userId: bigint;
  ingredientId: bigint;
  qtyGrams: number;
}

export interface UpdateInventoryRequest {
  userId: bigint;
  ingredientId: bigint;
  qtyGrams: number;
}

export interface InventoryListResponse {
  userId: bigint;
  ingredients: (InventoryIngredient & { ingredient: Ingredient })[];
  count: number;
}

// ============ MEAL PLAN TYPES ============
export interface MealPlan {
  id: bigint;
  userId: bigint;
  weekStartDate: Date;
  createdAt: Date;
}

export interface MealPlanRecipe {
  id: bigint;
  planId: bigint;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: bigint;
  plannedServings: number;
}

export interface CreateMealPlanRequest {
  userId: bigint;
  weekStartDate: Date;
}

export interface AddRecipeToMealPlanRequest {
  planId: bigint;
  recipeId: bigint;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  plannedServings: number;
}

export interface MealPlanDetailResponse extends MealPlan {
  recipes: (MealPlanRecipe & { recipe: Recipe })[];
}

// ============ JOURNAL TYPES ============
export interface JournalEntry {
  id: bigint;
  userId: bigint;
  recipeId: bigint;
  servingsEaten: number;
  loggedAt: Date;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface LogMealRequest {
  userId: bigint;
  recipeId: bigint;
  servingsEaten: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface JournalListResponse {
  userId: bigint;
  entries: JournalEntry[];
  count: number;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface NutritionSummary {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// ============ SAVED MEAL TYPES ============
export interface SavedMeal {
  id: bigint;
  userId: bigint;
  name: string;
  recipeId: bigint;
  defaultServings: number;
  createdAt: Date;
}

export interface CreateSavedMealRequest {
  userId: bigint;
  name: string;
  recipeId: bigint;
  defaultServings: number;
}

export interface UpdateSavedMealRequest {
  id: bigint;
  name?: string;
  defaultServings?: number;
}

export interface SavedMealListResponse {
  userId: bigint;
  meals: SavedMeal[];
  count: number;
}

// ============ DATABASE TYPES ============
export interface DatabaseStats {
  utilisateur: number;
  ingredients: number;
  recette: number;
  inventaire: number;
  plansRepas: number;
  journal: number;
  repasEnregistre: number;
  timestamp: Date;
}

export interface TableStats {
  tableName: string;
  rowCount: number;
  sizeKB: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  uptime?: number;
}
