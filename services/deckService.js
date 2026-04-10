import databaseService from "./databaseService";

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_DECKS_ID;

const deckService = {
  async getDecks() {
    return await databaseService.listDocuments(dbId, colId);
  },
};

export default deckService;
