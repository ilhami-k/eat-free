import { ipcRenderer } from "electron";
import IInventoryService from "../../shared/interfaces/IInventoryService";

export function inventoryService(): IInventoryService {
  return {
    getInventories: () => ipcRenderer.invoke("inventoryRepository:getInventories"),
    getInventoryById: (id: number) => ipcRenderer.invoke("inventoryRepository:getInventoryById", id),
    getInventoryByUserId: (user_id: number) => ipcRenderer.invoke("inventoryRepository:getInventoryByUserId", user_id),
    createInventory: (user_id: number) => ipcRenderer.invoke("inventoryRepository:createInventory", user_id),
    deleteInventory: (id: number) => ipcRenderer.invoke("inventoryRepository:deleteInventory", id),
    addIngredientToInventory: (inventory_id: number, ingredient_id: number, qty_grams: number) =>
      ipcRenderer.invoke("inventoryRepository:addIngredientToInventory", inventory_id, ingredient_id, qty_grams),
    updateIngredientInInventory: (inventory_id: number, ingredient_id: number, qty_grams: number) =>
      ipcRenderer.invoke("inventoryRepository:updateIngredientInInventory", inventory_id, ingredient_id, qty_grams),
    removeIngredientFromInventory: (inventory_id: number, ingredient_id: number) =>
      ipcRenderer.invoke("inventoryRepository:removeIngredientFromInventory", inventory_id, ingredient_id),
  };
}
