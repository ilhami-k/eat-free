/**
 * Preload Script
 * Secure bridge between Renderer and Main processes
 * Exposes individual service namespaces via contextBridge
 */

import { contextBridge } from 'electron';
import { userService } from './services/userService';
import { ingredientService } from './services/ingredientService';
import { recipeService } from './services/recipeService';
import { inventoryService } from './services/inventoryService';
import { mealPlanService } from './services/mealPlanService';
import { journalService } from './services/journalService';
import { savedMealService } from './services/savedMealService';
import { databaseService } from './services/databaseService';

/**
 * Expose services to renderer process
 * Each service handles one domain (user, recipe, etc.)
 * 
 * Usage in Vue:
 * await window.electronAPI.user.getById(id)
 * await window.electronAPI.recipe.getAll()
 */
contextBridge.exposeInMainWorld('electronAPI', {
  user: userService,
  ingredient: ingredientService,
  recipe: recipeService,
  inventory: inventoryService,
  mealPlan: mealPlanService,
  journal: journalService,
  savedMeal: savedMealService,
  database: databaseService,
});

console.log('[Preload] Electron API exposed to renderer');
