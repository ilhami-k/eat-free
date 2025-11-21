import { ipcRenderer } from "electron";
import IJournalService from "../../shared/interfaces/IJournalService";

export function journalService(): IJournalService {
  return {
    getJournalEntries: (userId: number, startDate?: Date, endDate?: Date) =>
      ipcRenderer.invoke("journalRepository:getJournalEntries", userId, startDate, endDate),
    getJournalEntryById: (id: number) => ipcRenderer.invoke("journalRepository:getJournalEntryById", id),
    createJournalEntry: (user_id: number, recipe_id: number, servings_eaten: number, kcal: number, protein_g: number, carbs_g: number, fat_g: number) =>
      ipcRenderer.invoke("journalRepository:createJournalEntry", user_id, recipe_id, servings_eaten, kcal, protein_g, carbs_g, fat_g),
    createJournalEntryWithTime: (user_id: number, recipe_id: number, servings_eaten: number, kcal: number, protein_g: number, carbs_g: number, fat_g: number, logged_at: Date) =>
      ipcRenderer.invoke("journalRepository:createJournalEntryWithTime", user_id, recipe_id, servings_eaten, kcal, protein_g, carbs_g, fat_g, logged_at),
    updateJournalEntry: (id: number, data: { servings_eaten?: number; kcal?: number; protein_g?: number; carbs_g?: number; fat_g?: number }) =>
      ipcRenderer.invoke("journalRepository:updateJournalEntry", id, data),
    deleteJournalEntry: (id: number) => ipcRenderer.invoke("journalRepository:deleteJournalEntry", id),
  };
}
