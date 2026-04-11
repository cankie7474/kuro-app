import databaseService from "./databaseService";
import { Query } from "react-native-appwrite";

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_CARDS_ID;

const cardService = {
    // this gets all cards
    async getCards() {
        return await databaseService.listDocuments(dbId, colId);
    },

    async getCardsByDeck(deckId) {
        return await databaseService.listDocuments(dbId, colId, [
            Query.equal("deckId", [deckId]),
        ]);
    },
};

export default cardService;