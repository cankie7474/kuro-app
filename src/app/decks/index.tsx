import {useEffect, useState} from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import deckService from "../../../services/deckService";

export default function DeckScreen() {
    const [decks, setDecks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        setLoading(true);
        const response = await deckService.getDecks();

        if (response.error) {
            setError(response.error);
            Alert.alert("Decks konnten nicht geladen werden.", 
              response.error);
        } else  {
            setDecks(response.data);
            setError(null);
        }
        setLoading(false);
        

    }

  return (
    <View style={styles.container}>
      {decks.length === 0 ? (
        <Text>Keine Decks gefunden.</Text>
      ) : (
      decks.map((item) => (
      <View key={item.$id} style={styles.card}>
        <Text>{item.title}</Text>
      </View>
    ))
  )}
      </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
  }
});
