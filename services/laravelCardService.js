import { apiRequest } from "./laravelApi";

const laravelCardService = {
  async getCardsByDeck(deckId) {
    return await apiRequest(`/api/decks/${deckId}/cards`);
  },
};

export default laravelCardService;
