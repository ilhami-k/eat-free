/**
 * Repository Registry
 * Central registry for all repositories in the application
 */

import { userRepository, UserRepository } from './userRepository';
import { ingredientRepository, IngredientRepository } from './ingredientRepository';
import { recipeRepository, RecipeRepository } from './recipeRepository';
import { inventoryRepository, InventoryRepository } from './inventoryRepository';
import { mealPlanRepository, MealPlanRepository } from './mealPlanRepository';
import { journalRepository, JournalRepository } from './journalRepository';
import { savedMealRepository, SavedMealRepository } from './savedMealRepository';
import { databaseRepository, DatabaseRepository } from './databaseRepository';

/**
 * Central registry for all repositories
 * Provides singleton access to all data repositories
 */
export class RepositoryRegistry {
  private static instance: RepositoryRegistry;

  // Repository instances
  public readonly user: UserRepository;
  public readonly ingredient: IngredientRepository;
  public readonly recipe: RecipeRepository;
  public readonly inventory: InventoryRepository;
  public readonly mealPlan: MealPlanRepository;
  public readonly journal: JournalRepository;
  public readonly savedMeal: SavedMealRepository;
  public readonly database: DatabaseRepository;

  private constructor() {
    this.user = userRepository;
    this.ingredient = ingredientRepository;
    this.recipe = recipeRepository;
    this.inventory = inventoryRepository;
    this.mealPlan = mealPlanRepository;
    this.journal = journalRepository;
    this.savedMeal = savedMealRepository;
    this.database = databaseRepository;
  }

  /**
   * Get the singleton instance of the registry
   */
  public static getInstance(): RepositoryRegistry {
    if (!RepositoryRegistry.instance) {
      RepositoryRegistry.instance = new RepositoryRegistry();
    }
    return RepositoryRegistry.instance;
  }

  /**
   * Get all repositories as an object
   */
  public getAllRepositories() {
    return {
      user: this.user,
      ingredient: this.ingredient,
      recipe: this.recipe,
      inventory: this.inventory,
      mealPlan: this.mealPlan,
      journal: this.journal,
      savedMeal: this.savedMeal,
      database: this.database,
    };
  }
}

// Export singleton instance
export const repositories = RepositoryRegistry.getInstance();

// Export types for use in other modules
export type { UserRepository };
export type { IngredientRepository };
export type { RecipeRepository };
export type { InventoryRepository };
export type { MealPlanRepository };
export type { JournalRepository };
export type { SavedMealRepository };
export type { DatabaseRepository };
