import { apiRequest } from "./laravelApi";

const laravelDeckService = {
    async getDecks() {
        return await apiRequest("/api/decks");
    },

    async getDeckById(deckId) {
        return await apiRequest(`/api/decks/${deckId}`);
    },

    async createDeck(deckData)  {
        return await apiRequest("/api/decks", {
            method: "POST",
            body: JSON.stringify(deckData),
        });
    },
};

export default laravelDeckService;