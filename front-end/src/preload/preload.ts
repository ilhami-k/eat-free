
import { contextBridge } from "electron";
import { userService } from "./services/userService";
import { recipeService } from "./services/recipeService";
import { ingredientsService } from "./services/ingredientsService";
import { inventoryService } from "./services/inventoryService";
import { journalService } from "./services/journalService";
import { mealPlanService } from "./services/mealPlanService";
import { savedRecipeService } from "./services/savedRecipeService";
import IElectronService from "../shared/interfaces/IElectronService";

contextBridge.exposeInMainWorld("electronService", {
  users: userService(),
  recipes: recipeService(),
  ingredients: ingredientsService(),
  inventory: inventoryService(),
  journal: journalService(),
  mealPlans: mealPlanService(),
  savedRecipes: savedRecipeService(),
} as IElectronService);