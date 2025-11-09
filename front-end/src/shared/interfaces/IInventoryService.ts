import Inventory, { InventoryIngredient } from "../inventory";

export default interface IInventoryService {
  getInventories: () => Promise<Inventory[]>;
  getInventoryById: (id: bigint) => Promise<Inventory | null>;
  getInventoryByUserId: (user_id: bigint) => Promise<Inventory | null>;
  createInventory: (user_id: bigint) => Promise<Inventory>;
  deleteInventory: (id: bigint) => Promise<void>;
  addIngredientToInventory: (
    inventory_id: bigint,
    ingredient_id: bigint,
    qty_grams: number
  ) => Promise<InventoryIngredient>;
  updateIngredientInInventory: (
    inventory_id: bigint,
    ingredient_id: bigint,
    qty_grams: number
  ) => Promise<InventoryIngredient>;
  removeIngredientFromInventory: (
    inventory_id: bigint,
    ingredient_id: bigint
  ) => Promise<void>;
}
