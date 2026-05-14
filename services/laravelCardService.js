import { apiRequest } from "./laravelApi";

const laravelCardService = {
  async getCardsByDeck(deckId) {
    return await apiRequest(`/api/decks/${deckId}/cards`);
  },

  async getStudyCards(deckId) {
    return await apiRequest(`/api/decks/${deckId}/study`);
  },

  async createCard(cardData, deckId) {
    return await apiRequest(`/api/decks/${deckId}/cards`, {
      method: "POST",
      body: JSON.stringify(cardData),
    });
  },

  async updateCard(cardData, deckId, cardId) {
    return await apiRequest(`/api/decks/${deckId}/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify(cardData),
    });
  },
  async deleteCard(cardId, deckId) {
    return await apiRequest(`/api/decks/${deckId}/cards/${cardId}`, {
      method: "DELETE",
    });
  },

  async reviewCard(cardId, rating) {
    return await apiRequest(`/api/cards/${cardId}/review`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
  },
};

export default laravelCardService;
