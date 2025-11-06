/**
 * Recipe Repository IPC Handler Registration
 * 
 * Registers all recipe-related IPC handlers for the Main process.
 * Follows the "Waiter" pattern: receives requests, calls repository (Chef),
 * wraps responses in ApiResponse format.
 */

import { ipcMain } from 'electron';
import { recipeRepository } from '../repositories/recipeRepository';
import type {
  ApiResponse,
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  RecipeDetailResponse,
  RecipeListResponse,
  AddRecipeIngredientRequest,
  RecipeIngredient,
} from '../../src/shared/types';

/**
 * Register all Recipe IPC handlers
 */
export function registerRecipeRepository(): void {
  /**
   * Create a new recipe
   * IPC Channel: recipe:create
   */
  ipcMain.handle(
    'recipe:create',
    async (
      _event,
      data: CreateRecipeRequest
    ): Promise<ApiResponse<Recipe>> => {
      try {
        const result = await recipeRepository.create(data);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get recipe by ID
   * IPC Channel: recipe:getById
   */
  ipcMain.handle(
    'recipe:getById',
    async (_event, id: bigint): Promise<ApiResponse<RecipeDetailResponse | null>> => {
      try {
        const result = await recipeRepository.getById(id);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get all recipes
   * IPC Channel: recipe:getAll
   */
  ipcMain.handle(
    'recipe:getAll',
    async (): Promise<ApiResponse<RecipeListResponse>> => {
      try {
        const recipes = await recipeRepository.getAll();
        return {
          success: true,
          data: {
            recipes,
            count: recipes.length,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get recipes by user ID
   * IPC Channel: recipe:getByUser
   */
  ipcMain.handle(
    'recipe:getByUser',
    async (_event, userId: bigint): Promise<ApiResponse<RecipeListResponse>> => {
      try {
        const recipes = await recipeRepository.getByUser(userId);
        return {
          success: true,
          data: {
            recipes,
            count: recipes.length,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Update recipe
   * IPC Channel: recipe:update
   */
  ipcMain.handle(
    'recipe:update',
    async (
      _event,
      data: UpdateRecipeRequest
    ): Promise<ApiResponse<Recipe>> => {
      try {
        const { id, ...updateData } = data;
        const result = await recipeRepository.update(id, updateData);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Delete recipe
   * IPC Channel: recipe:delete
   */
  ipcMain.handle(
    'recipe:delete',
    async (_event, id: bigint): Promise<ApiResponse<boolean>> => {
      try {
        await recipeRepository.delete(id);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Add ingredient to recipe
   * IPC Channel: recipe:addIngredient
   */
  ipcMain.handle(
    'recipe:addIngredient',
    async (
      _event,
      data: AddRecipeIngredientRequest
    ): Promise<ApiResponse<RecipeIngredient>> => {
      try {
        const result = await recipeRepository.addIngredient(
          data.recipeId,
          data.ingredientId,
          data.qtyGrams,
          data.notes
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Remove ingredient from recipe
   * IPC Channel: recipe:removeIngredient
   */
  ipcMain.handle(
    'recipe:removeIngredient',
    async (
      _event,
      data: { recipeId: bigint; ingredientId: bigint }
    ): Promise<ApiResponse<boolean>> => {
      try {
        await recipeRepository.removeIngredient(data.recipeId, data.ingredientId);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get recipe details with ingredients and user
   * IPC Channel: recipe:getDetails
   */
  ipcMain.handle(
    'recipe:getDetails',
    async (_event, id: bigint): Promise<ApiResponse<Record<string, unknown> | null>> => {
      try {
        const result = await recipeRepository.getWithDetails(id);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Search recipes by name
   * IPC Channel: recipe:searchByName
   */
  ipcMain.handle(
    'recipe:searchByName',
    async (_event, query: string): Promise<ApiResponse<RecipeListResponse>> => {
      try {
        const recipes = await recipeRepository.searchByName(query);
        return {
          success: true,
          data: {
            recipes,
            count: recipes.length,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get high protein recipes
   * IPC Channel: recipe:getHighProtein
   */
  ipcMain.handle(
    'recipe:getHighProtein',
    async (_event, minProtein = 30): Promise<ApiResponse<RecipeListResponse>> => {
      try {
        const recipes = await recipeRepository.getHighProteinRecipes(minProtein);
        return {
          success: true,
          data: {
            recipes,
            count: recipes.length,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get low calorie recipes
   * IPC Channel: recipe:getLowCalorie
   */
  ipcMain.handle(
    'recipe:getLowCalorie',
    async (_event, maxKcal = 400): Promise<ApiResponse<RecipeListResponse>> => {
      try {
        const recipes = await recipeRepository.getLowCalorieRecipes(maxKcal);
        return {
          success: true,
          data: {
            recipes,
            count: recipes.length,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get public recipes (not user-specific)
   * IPC Channel: recipe:getPublic
   */
  ipcMain.handle(
    'recipe:getPublic',
    async (): Promise<ApiResponse<RecipeListResponse>> => {
      try {
        const recipes = await recipeRepository.getPublicRecipes();
        return {
          success: true,
          data: {
            recipes,
            count: recipes.length,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get recipes with ingredient count
   * IPC Channel: recipe:getWithCount
   */
  ipcMain.handle(
    'recipe:getWithCount',
    async (): Promise<ApiResponse<Record<string, unknown>[]>> => {
      try {
        const result = await recipeRepository.getRecipesWithIngredientsCount();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
