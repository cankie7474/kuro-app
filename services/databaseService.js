import { database } from "./appwrite";

const databaseService = {
    async listFlashcards(dbId, colId) {
        try {
            const response = await database.listDocuments(dbId, colId);
            return response.documents ||[];
        } catch (error) {
            console.error("Error listing flashcards:", error);
            return {error: error.message};
        }
    }
}

export default databaseService;