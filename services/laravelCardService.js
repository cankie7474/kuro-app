import { apiRequest } from "./laravelApi";

const laravelCardService = {
  async getCardsByDeck(deckId) {
    return await apiRequest(`/api/decks/${deckId}/cards`);
  },

  async createCard(cardData, deckId) {
    return await apiRequest(`/api/decks/${deckId}/cards`, {
      method: "POST",
      body: JSON.stringify(cardData),
    });
  },
};

export default laravelCardService;
