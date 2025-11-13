import { ipcMain } from "electron";
import { JournalRepository } from "./journalRepository";

export function registerJournalRepository() {
  const journalRepository = new JournalRepository();

  ipcMain.handle(
    "journalRepository:getJournalEntries",
    (e, userId: number, startDate?: Date, endDate?: Date) => {
      return journalRepository.getJournalEntries(userId, startDate, endDate);
    }
  );

  ipcMain.handle("journalRepository:getJournalEntryById", (e, id: number) => {
    return journalRepository.getJournalEntryById(id);
  });

  ipcMain.handle(
    "journalRepository:createJournalEntry",
    (e, user_id: number, recipe_id: number, servings_eaten: number, kcal: number, protein_g: number, carbs_g: number, fat_g: number) => {
      return journalRepository.createJournalEntry(user_id, recipe_id, servings_eaten, kcal, protein_g, carbs_g, fat_g);
    }
  );

  ipcMain.handle(
    "journalRepository:updateJournalEntry",
    (e, id: number, data: { servings_eaten?: number; kcal?: number; protein_g?: number; carbs_g?: number; fat_g?: number }) => {
      return journalRepository.updateJournalEntry(id, data);
    }
  );

  ipcMain.handle("journalRepository:deleteJournalEntry", (e, id: number) => {
    return journalRepository.deleteJournalEntry(id);
  });
}
