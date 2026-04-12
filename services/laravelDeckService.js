import { apiRequest } from "./laravelApi";

const laravelDeckService = {
    async getDecks() {
        return await apiRequest("/api/decks");
    },

    async getDeckById(deckId) {
        return await apiRequest(`/api/decks/${deckId}`);
    }
};

export default laravelDeckService;