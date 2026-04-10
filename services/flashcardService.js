import databaseService from "./databaseService";
import { ID } from "react-native-appwrite";

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_CARDS_ID;

const flashcardService = {
    // get Flashcards
    async getFlashcards() {
        const response = await databaseService.listFlashcards(dbId, colId);
        if (response.error) {
            return {error: response.error}
        }
        return {data:response};
}

}

export default flashcardService;