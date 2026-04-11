import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import cardService from "../../../services/cardService";

type Card = {
  $id: string;
  front: string;
  back: string;
  deckId: string;
};

export default function DeckDetailScreen() {
  // const { deckId } = useLocalSearchParams<{deckId: string}>(); // erwarte einen parameter namens deckId: string
  const params = useLocalSearchParams();
  const deckId = params.deckId;
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetchCards();
  }, [deckId]);

  const fetchCards = async () => {
    if (!deckId) return;

    const response = await cardService.getCardsByDeck(String(deckId));

    if (response.error) {
      console.log(response.error);
      return;
    }

    setCards(response.data as Card[]);
  };

  return (
    <View style={{padding: 100, position: "absolute"}}>
      <Text>Deck ID: {deckId}</Text>

      {cards.map((card) => (
        <View key={card.$id}>
          <Text>{card.front}</Text>
          <Text>{card.back}</Text>
        </View>
      ))}
    </View>
  );
}
