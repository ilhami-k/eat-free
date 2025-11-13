import { ipcMain } from "electron";
import { InventoryRepository } from "./inventoryRepository";

export function registerInventoryRepository() {
  const inventoryRepository = new InventoryRepository();

  ipcMain.handle("inventoryRepository:getInventories", () => {
    return inventoryRepository.getInventories();
  });

  ipcMain.handle("inventoryRepository:getInventoryById", (e, id: number) => {
    return inventoryRepository.getInventoryById(id);
  });

  ipcMain.handle("inventoryRepository:getInventoryByUserId", (e, user_id: number) => {
    return inventoryRepository.getInventoryByUserId(user_id);
  });

  ipcMain.handle("inventoryRepository:createInventory", (e, user_id: number) => {
    return inventoryRepository.createInventory(user_id);
  });

  ipcMain.handle("inventoryRepository:deleteInventory", (e, id: number) => {
    return inventoryRepository.deleteInventory(id);
  });

  ipcMain.handle(
    "inventoryRepository:addIngredientToInventory",
    (e, inventory_id: number, ingredient_id: number, qty_grams: number) => {
      return inventoryRepository.addIngredientToInventory(inventory_id, ingredient_id, qty_grams);
    }
  );

  ipcMain.handle(
    "inventoryRepository:updateIngredientInInventory",
    (e, inventory_id: number, ingredient_id: number, qty_grams: number) => {
      return inventoryRepository.updateIngredientInInventory(inventory_id, ingredient_id, qty_grams);
    }
  );

  ipcMain.handle(
    "inventoryRepository:removeIngredientFromInventory",
    (e, inventory_id: number, ingredient_id: number) => {
      return inventoryRepository.removeIngredientFromInventory(inventory_id, ingredient_id);
    }
  );
}
