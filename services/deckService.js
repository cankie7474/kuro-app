import databaseService from "./databaseService";
import { Query } from "react-native-appwrite";

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_DECKS_ID;

const deckService = {
  async getDecks() {
    return await databaseService.listDocuments(dbId, colId);
  },

  async getDeckById(deckId) {
    const response = await databaseService.listDocuments(dbId, colId, [
      Query.equal("$id", [deckId]),
    ]);

    return {
      data: response.data[0] || null,
      error: response.error,
    };
  },
};

export default deckService;
