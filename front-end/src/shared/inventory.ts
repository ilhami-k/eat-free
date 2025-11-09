export interface InventoryIngredient {
  inventory_id: bigint;
  ingredient_id: bigint;
  qty_grams: number;
}

export default interface Inventory {
  id: bigint;
  user_id: bigint;
  created_at: Date;
  inventory_ingredient?: InventoryIngredient[];
}
