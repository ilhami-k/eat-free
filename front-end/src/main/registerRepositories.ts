// moved from front-end/main/registerRepositories.ts

import { registerUserRepository } from "./repositories/registerUserRepository";
import { registerRecipeRepository } from "./repositories/registerRecipeRepository";

export function registerAllRepositories() {
  registerUserRepository();
  registerRecipeRepository();
}