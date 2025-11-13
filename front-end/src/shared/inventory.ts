export interface InventoryIngredient {
  inventory_id: number;
  ingredient_id: number;
  qty_grams: number;
}

export default interface Inventory {
  id: number;
  user_id: number;
  created_at: string;
  inventory_ingredient?: InventoryIngredient[];
}
