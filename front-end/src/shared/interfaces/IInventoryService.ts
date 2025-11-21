import Inventory, { InventoryIngredient } from "../inventory";

export default interface IInventoryService {
  getInventories: () => Promise<Inventory[]>;
  getInventoryById: (id: number) => Promise<Inventory | null>;
  getInventoryByUserId: (user_id: number) => Promise<Inventory | null>;
  createInventory: (user_id: number) => Promise<Inventory>;
  deleteInventory: (id: number) => Promise<void>;
  addIngredientToInventory: (
    inventory_id: number,
    ingredient_id: number,
    qty_grams: number
  ) => Promise<InventoryIngredient>;
  updateIngredientInInventory: (
    inventory_id: number,
    ingredient_id: number,
    qty_grams: number
  ) => Promise<InventoryIngredient>;
  removeIngredientFromInventory: (
    inventory_id: number,
    ingredient_id: number
  ) => Promise<void>;
}
