import Journal from "../journal";

export default interface IJournalService {
  getJournalEntries: (
    userId: bigint,
    startDate?: Date,
    endDate?: Date
  ) => Promise<Journal[]>;
  getJournalEntryById: (id: bigint) => Promise<Journal | null>;
  createJournalEntry: (
    user_id: bigint,
    recipe_id: bigint,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number
  ) => Promise<Journal>;
  updateJournalEntry: (
    id: bigint,
    data: {
      servings_eaten?: number;
      kcal?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
    }
  ) => Promise<Journal>;
  deleteJournalEntry: (id: bigint) => Promise<void>;
}
