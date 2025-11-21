import Journal from "../journal";

export default interface IJournalService {
  getJournalEntries: (
    userId: number,
    startDate?: Date,
    endDate?: Date
  ) => Promise<Journal[]>;
  getJournalEntryById: (id: number) => Promise<Journal | null>;
  createJournalEntry: (
    user_id: number,
    recipe_id: number,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number
  ) => Promise<Journal>;
  createJournalEntryWithTime: (
    user_id: number,
    recipe_id: number,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number,
    logged_at: Date
  ) => Promise<Journal>;
  updateJournalEntry: (
    id: number,
    data: {
      servings_eaten?: number;
      kcal?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
    }
  ) => Promise<Journal>;
  deleteJournalEntry: (id: number) => Promise<void>;
}
