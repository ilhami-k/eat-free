import { ipcRenderer } from "electron";
import IJournalService from "../../shared/interfaces/IJournalService";

export function journalService(): IJournalService {
  return {
    getJournalEntries: (userId: bigint, startDate?: Date, endDate?: Date) =>
      ipcRenderer.invoke("journalRepository:getJournalEntries", userId, startDate, endDate),
    getJournalEntryById: (id: bigint) => ipcRenderer.invoke("journalRepository:getJournalEntryById", id),
    createJournalEntry: (user_id: bigint, recipe_id: bigint, servings_eaten: number, kcal: number, protein_g: number, carbs_g: number, fat_g: number) =>
      ipcRenderer.invoke("journalRepository:createJournalEntry", user_id, recipe_id, servings_eaten, kcal, protein_g, carbs_g, fat_g),
    updateJournalEntry: (id: bigint, data: { servings_eaten?: number; kcal?: number; protein_g?: number; carbs_g?: number; fat_g?: number }) =>
      ipcRenderer.invoke("journalRepository:updateJournalEntry", id, data),
    deleteJournalEntry: (id: bigint) => ipcRenderer.invoke("journalRepository:deleteJournalEntry", id),
  };
}
