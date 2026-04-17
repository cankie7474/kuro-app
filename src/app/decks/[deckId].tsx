import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import laravelCardService from "../../../services/laravelCardService";
import laravelDeckService from "../../../services/laravelDeckService";

type Card = {
  id: number;
  front: string;
  back: string;
  deck_id: number;
};

type Deck = {
  id: number;
  title: string;
  description?: string;
  color?: string;
};

export default function DeckDetailScreen() {
  const params = useLocalSearchParams();
  const deckId = params.deckId;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsExpanded, setCardsExpanded] = useState(true);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    fetchDeckData();
  }, [deckId]);

  const fetchDeckData = async () => {
    if (!deckId) return;

    setLoading(true);

    const deckResponse = await laravelDeckService.getDeckById(String(deckId));
    const cardsResponse = await laravelCardService.getCardsByDeck(
      String(deckId)
    );

    if (deckResponse.error) {
      console.error("Failed to load deck:", deckResponse.error);
      Alert.alert("Deck konnte nicht geladen werden.", deckResponse.error);
      setDeck(null);
    } else if (deckResponse.data) {
      setDeck(deckResponse.data as Deck);
    } else {
      setDeck(null);
    }

    if (cardsResponse.error) {
      console.error("Failed to load cards:", cardsResponse.error);
      Alert.alert("Karten konnten nicht geladen werden.", cardsResponse.error);
      setCards([]);
    } else {
      setCards(cardsResponse.data as Card[]);
    }

    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    console.log("edit deck");
  };

  const handleDelete = () => {
    console.log("delete deck");
  };

  const handleBeginStudy = () => {
    if (!deckId) {
      return console.error();
    } else {
      router.push(`/decks/study/${deckId}`);
    }
  };

  const handleToggleCards = () => {
    setCardsExpanded((prev) => !prev);
  };

  const handleToggleCreateCard = () => {
    setShowCreateCard((prev) => !prev);
  };

  const handleCreateCard = async () => {
    if (!deckId) return;

    if (!front.trim() || !back.trim()) {
      Alert.alert("Missing fields", "Front and back are required.");
      return;
    }

    const data = {
      front: front.trim(),
      back: back.trim(),
    };

    const response = await laravelCardService.createCard(data, deckId);

    if (response.error) {
      console.error("Failed to create card", response.error);
    } else {
      setFront("");
      setBack("");
      await fetchDeckData();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.centerState}>
            <Text style={styles.stateText}>Loading deck...</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable style={styles.iconButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={22} color="#f5f7fb" />
            </Pressable>

            <View style={styles.topBarActions}>
              <Pressable style={styles.iconButton} onPress={handleEdit}>
                <MaterialIcons name="edit" size={20} color="#f5f7fb" />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={handleDelete}>
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color="#f5f7fb"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.headerCard}>
            <View
              style={[
                styles.deckAccent,
                { backgroundColor: deck?.color || "#8aa0ff" },
              ]}
            />
            <Text style={styles.title}>{deck?.title || "Deck"}</Text>
            <Text style={styles.description}>
              {deck?.description || "No description yet."}
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Pressable onPress={handleToggleCards} style={styles.sectionCopy}>
              <View>
                <Text style={styles.sectionTitle}>Cards</Text>
                <Text style={styles.sectionMeta}>{cards.length} total</Text>
              </View>
            </Pressable>

            <View style={styles.sectionActions}>
              <Pressable
                style={styles.addCardButton}
                onPress={handleToggleCreateCard}
              >
                <MaterialIcons
                  name={showCreateCard ? "close" : "add"}
                  size={20}
                  color="#f5f7fb"
                />
              </Pressable>

              <Pressable onPress={handleToggleCards}>
                <MaterialIcons
                  name={cardsExpanded ? "expand-less" : "expand-more"}
                  size={24}
                  color="#8f9bb2"
                />
              </Pressable>
            </View>
          </View>

          {showCreateCard && (
            <View style={styles.createCardBox}>
              <Text style={styles.createCardTitle}>Add a new Card</Text>

              <TextInput
                placeholder="Front"
                placeholderTextColor="#8f9bb2"
                style={styles.input}
                value={front}
                onChangeText={setFront}
              />

              <TextInput
                placeholder="Back"
                placeholderTextColor="#8f9bb2"
                style={[styles.input, styles.textArea]}
                multiline
                textAlignVertical="top"
                value={back}
                onChangeText={setBack}
              />

              <Pressable style={styles.createButton} onPress={handleCreateCard}>
                <Text style={styles.createButtonText}>Create Card</Text>
              </Pressable>
            </View>
          )}

          {cardsExpanded &&
            (cards.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No cards yet</Text>
                <Text style={styles.emptyText}>
                  Add your first cards to start studying this deck.
                </Text>
              </View>
            ) : (
              cards.map((card, index) => (
                <View key={card.id} style={styles.card}>
                  <Text style={styles.cardIndex}>Card {index + 1}</Text>
                  <Text style={styles.cardFront}>{card.front}</Text>
                  <Text style={styles.cardBack}>{card.back}</Text>
                </View>
              ))
            ))}

          <Pressable style={styles.studyButton} onPress={handleBeginStudy}>
            <Text style={styles.studyButtonText}>Begin Study</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090b10",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    color: "#a7afbd",
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  topBarActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#121722",
    borderWidth: 1,
    borderColor: "#232a36",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    backgroundColor: "#121722",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#232a36",
    marginBottom: 20,
  },
  deckAccent: {
    width: 16,
    height: 16,
    borderRadius: 999,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f5f7fb",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#a7afbd",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionCopy: {
    flex: 1,
  },
  sectionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f5f7fb",
  },
  sectionMeta: {
    fontSize: 14,
    color: "#8f9bb2",
  },
  addCardButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#121722",
    borderWidth: 1,
    borderColor: "#232a36",
    alignItems: "center",
    justifyContent: "center",
  },
  createCardBox: {
    backgroundColor: "#121722",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#232a36",
    marginBottom: 18,
  },
  createCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f5f7fb",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#0f141d",
    borderWidth: 1,
    borderColor: "#232a36",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#f5f7fb",
    marginBottom: 12,
  },
  textArea: {
    minHeight: 110,
  },
  createButton: {
    backgroundColor: "#f5f7fb",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  createButtonText: {
    color: "#0c111b",
    fontSize: 15,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#121722",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#232a36",
    marginBottom: 18,
  },
  emptyTitle: {
    color: "#f5f7fb",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#a7afbd",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#121722",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#232a36",
    marginBottom: 14,
  },
  cardIndex: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8f9bb2",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  cardFront: {
    fontSize: 19,
    fontWeight: "700",
    color: "#f5f7fb",
    marginBottom: 12,
  },
  cardBack: {
    fontSize: 15,
    lineHeight: 23,
    color: "#a7afbd",
  },
  studyButton: {
    backgroundColor: "#f4f7fb",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  studyButtonText: {
    color: "#0c0f14",
    fontSize: 17,
    fontWeight: "600",
  },
});
