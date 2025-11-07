import IUserService from "./IUserService";
import IRecipeService from "./IRecipeService";

export default interface IElectronService {
    users: IUserService
    recipes: IRecipeService
}

declare global {
    interface Window {
        electronService: IElectronService
    }
}