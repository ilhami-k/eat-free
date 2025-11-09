import { ipcMain } from "electron";
import { InventoryRepository } from "./inventoryRepository";

export function registerInventoryRepository() {
  const inventoryRepository = new InventoryRepository();

  ipcMain.handle("inventoryRepository:getInventories", () => {
    return inventoryRepository.getInventories();
  });

  ipcMain.handle("inventoryRepository:getInventoryById", (e, id: bigint) => {
    return inventoryRepository.getInventoryById(id);
  });

  ipcMain.handle("inventoryRepository:getInventoryByUserId", (e, user_id: bigint) => {
    return inventoryRepository.getInventoryByUserId(user_id);
  });

  ipcMain.handle("inventoryRepository:createInventory", (e, user_id: bigint) => {
    return inventoryRepository.createInventory(user_id);
  });

  ipcMain.handle("inventoryRepository:deleteInventory", (e, id: bigint) => {
    return inventoryRepository.deleteInventory(id);
  });

  ipcMain.handle(
    "inventoryRepository:addIngredientToInventory",
    (e, inventory_id: bigint, ingredient_id: bigint, qty_grams: number) => {
      return inventoryRepository.addIngredientToInventory(inventory_id, ingredient_id, qty_grams);
    }
  );

  ipcMain.handle(
    "inventoryRepository:updateIngredientInInventory",
    (e, inventory_id: bigint, ingredient_id: bigint, qty_grams: number) => {
      return inventoryRepository.updateIngredientInInventory(inventory_id, ingredient_id, qty_grams);
    }
  );

  ipcMain.handle(
    "inventoryRepository:removeIngredientFromInventory",
    (e, inventory_id: bigint, ingredient_id: bigint) => {
      return inventoryRepository.removeIngredientFromInventory(inventory_id, ingredient_id);
    }
  );
}
