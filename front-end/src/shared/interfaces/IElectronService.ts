import IUserService from "./IUserService";
import IRecipeService from "./IRecipeService";
import IIngredientsService from "./IIngredientsService";
import IInventoryService from "./IInventoryService";
import IJournalService from "./IJournalService";
import IMealPlanService from "./IMealPlanService";
import ISavedRecipeService from "./ISavedRecipeService";

export default interface IElectronService {
  users: IUserService;
  recipes: IRecipeService;
  ingredients: IIngredientsService;
  inventory: IInventoryService;
  journal: IJournalService;
  mealPlans: IMealPlanService;
  savedRecipes: ISavedRecipeService;
}

declare global {
  interface Window {
    electronService: IElectronService;
  }
}