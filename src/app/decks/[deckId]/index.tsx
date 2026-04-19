import { useCallback, useEffect, useState } from "react";
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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import laravelCardService from "../../../../services/laravelCardService";
import laravelDeckService from "../../../../services/laravelDeckService";

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
  const [showMenu, setShowMenu] = useState(false);
  const [openCardMenuId, setOpenCardMenuId] = useState<number | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [savingCardEdit, setSavingCardEdit] = useState(false);

  useEffect(() => {
    fetchDeckData();
  }, [deckId]);

  useFocusEffect(
    useCallback(() => {
      fetchDeckData();
    }, [deckId])
  );

  const fetchDeckData = async () => {
    if (!deckId) return;

    setLoading(true);

    const deckResponse = await laravelDeckService.getDeckById(String(deckId));
    const cardsResponse = await laravelCardService.getCardsByDeck(
      String(deckId)
    );

    if (deckResponse.error) {
      console.error("Failed to load deck:", deckResponse.error);
      Alert.alert("Deck could not be loaded.", deckResponse.error);
      setDeck(null);
    } else if (deckResponse.data) {
      setDeck(deckResponse.data as Deck);
    } else {
      setDeck(null);
    }

    if (cardsResponse.error) {
      console.error("Failed to load cards:", cardsResponse.error);
      Alert.alert("Cards could not be loaded.", cardsResponse.error);
      setCards([]);
    } else {
      setCards(cardsResponse.data as Card[]);
    }

    setLoading(false);
  };

  const handleBack = () => {
    setShowMenu(false);
    router.back();
  };

  const handleEditDeck = () => {
    setShowMenu(false);
    router.push(`/decks/${deckId}/edit`);
  };

  const confirmDelete = () => {
    setShowMenu(false);

    Alert.alert("Delete deck?", "This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: handleDelete,
      },
    ]);
  };

  const handleDelete = async () => {
    if (!deckId) {
      console.error("Failed to delete deck: missing deck ID");
      Alert.alert("Error", "No deck ID found.");
      return;
    }

    const response = await laravelDeckService.deleteDeck(String(deckId));

    if (response.error) {
      console.error("Failed to delete deck:", response.error);
      Alert.alert("Delete failed", response.error);
      return;
    }

    Alert.alert("Deleted", "The deck was removed.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleEditCard = (cardId: number) => {
    setOpenCardMenuId(null);

    const selectedCard = cards.find((card) => card.id === cardId);

    if (!selectedCard) {
      console.error("Failed to edit card: card not found", cardId);
      Alert.alert("Error", "Card not found.");
      return;
    }

    setEditingCardId(cardId);
    setEditFront(selectedCard.front);
    setEditBack(selectedCard.back);
  };

  const handleDeleteCard = async (cardId: number) => {
    setOpenCardMenuId(null);
    if (!deckId || !cardId) {
      console.error("Failed to delete card: missing deck or card ID", {
        deckId,
        cardId,
      });
      Alert.alert("Error", "Missing deck or card ID.");
      return;
    }

    const response = await laravelCardService.deleteCard(cardId, deckId);

    if (response.error) {
      console.error("Failed to delete card:", response.error);
      Alert.alert("Failed to delete card", response.error);
    } else {
      if (editingCardId === cardId) {
        handleCancelEditCard();
      }

      await fetchDeckData();
      Alert.alert("Card deleted.");
    }
  };

  const handleBeginStudy = () => {
    if (!deckId) {
      console.error("Failed to begin study: missing deck ID");
      return;
    } else {
      router.push(`/decks/${deckId}/study`);
    }
  };

  const handleToggleCards = () => {
    setCardsExpanded((prev) => !prev);
  };

  const handleToggleCreateCard = () => {
    setShowMenu(false);
    setOpenCardMenuId(null);
    setShowCreateCard((prev) => !prev);
  };

  const handleToggleMenu = () => {
    setOpenCardMenuId(null);
    setShowMenu((prev) => !prev);
  };

  const handleToggleCardMenu = (cardId: number) => {
    setShowMenu(false);
    setOpenCardMenuId((prev) => (prev === cardId ? null : cardId));
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
      console.error("Failed to create card:", response.error);
      Alert.alert("Failed to create card", response.error);
    } else {
      setFront("");
      setBack("");
      await fetchDeckData();
    }
  };

  const handleCancelEditCard = () => {
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
    setSavingCardEdit(false);
  };

  const handleSaveEditCard = async () => {
    if (!deckId || editingCardId === null) {
      console.error("Failed to update card: missing deck or card ID", {
        deckId,
        editingCardId,
      });
      Alert.alert("Error", "Missing deck or card ID.");
      return;
    }

    if (!editFront.trim() || !editBack.trim()) {
      Alert.alert("Missing fields", "Front and back are required.");
      return;
    }

    setSavingCardEdit(true);

    const response = await laravelCardService.updateCard(
      {
        front: editFront.trim(),
        back: editBack.trim(),
      },
      deckId,
      editingCardId
    );

    if (response.error) {
      console.error("Failed to update card:", response.error);
      Alert.alert("Failed to update card", response.error);
      setSavingCardEdit(false);
      return;
    }

    await fetchDeckData();
    handleCancelEditCard();
    Alert.alert("Card updated.");
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

            <View style={styles.menuWrapper}>
              <Pressable style={styles.iconButton} onPress={handleToggleMenu}>
                <MaterialIcons name="more-vert" size={22} color="#f5f7fb" />
              </Pressable>

              {showMenu && (
                <>
                  <Pressable
                    style={styles.menuBackdrop}
                    onPress={() => setShowMenu(false)}
                  />

                  <View style={styles.menuCard}>
                    <Pressable style={styles.menuItem} onPress={handleEditDeck}>
                      <MaterialIcons name="edit" size={18} color="#f5f7fb" />
                      <Text style={styles.menuText}>Edit deck</Text>
                    </Pressable>

                    <Pressable style={styles.menuItem} onPress={confirmDelete}>
                      <MaterialIcons
                        name="delete-outline"
                        size={18}
                        color="#ff8f8f"
                      />
                      <Text style={styles.menuTextDanger}>Delete deck</Text>
                    </Pressable>
                  </View>
                </>
              )}
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
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardIndex}>Card {index + 1}</Text>

                    <View style={styles.cardMenuWrapper}>
                      <Pressable onPress={() => handleToggleCardMenu(card.id)}>
                        <MaterialIcons
                          name="more-vert"
                          size={20}
                          color="#8f9bb2"
                        />
                      </Pressable>

                      {openCardMenuId === card.id && (
                        <View style={styles.cardMenu}>
                          <Pressable
                            style={styles.menuItem}
                            onPress={() => handleEditCard(card.id)}
                          >
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color="#f5f7fb"
                            />
                            <Text style={styles.menuText}>Edit card</Text>
                          </Pressable>

                          <Pressable
                            style={styles.menuItem}
                            onPress={() => handleDeleteCard(card.id)}
                          >
                            <MaterialIcons
                              name="delete-outline"
                              size={18}
                              color="#ff8f8f"
                            />
                            <Text style={styles.menuTextDanger}>
                              Delete card
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>

                  {editingCardId === card.id ? (
                    <View style={styles.editCardBox}>
                      <TextInput
                        placeholder="Front"
                        placeholderTextColor="#8f9bb2"
                        style={styles.input}
                        value={editFront}
                        onChangeText={setEditFront}
                      />

                      <TextInput
                        placeholder="Back"
                        placeholderTextColor="#8f9bb2"
                        style={[styles.input, styles.textArea]}
                        multiline
                        textAlignVertical="top"
                        value={editBack}
                        onChangeText={setEditBack}
                      />

                      <View style={styles.editCardActions}>
                        <Pressable
                          style={styles.editCancelButton}
                          onPress={handleCancelEditCard}
                          disabled={savingCardEdit}
                        >
                          <Text style={styles.editCancelButtonText}>
                            Cancel
                          </Text>
                        </Pressable>

                        <Pressable
                          style={[
                            styles.editSaveButton,
                            savingCardEdit && styles.saveButtonDisabled,
                          ]}
                          onPress={handleSaveEditCard}
                          disabled={savingCardEdit}
                        >
                          <Text style={styles.editSaveButtonText}>
                            {savingCardEdit ? "Saving..." : "Save Card"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.cardFront}>{card.front}</Text>
                      <Text style={styles.cardBack}>{card.back}</Text>
                    </>
                  )}
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
  menuWrapper: {
    position: "relative",
  },
  menuBackdrop: {
    position: "absolute",
    top: -24,
    right: -18,
    bottom: -600,
    left: -320,
    zIndex: 1,
  },
  menuCard: {
    position: "absolute",
    top: 52,
    right: 0,
    width: 170,
    backgroundColor: "#121722",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#232a36",
    paddingVertical: 8,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f5f7fb",
  },
  menuTextDanger: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ff8f8f",
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardMenuWrapper: {
    position: "relative",
  },
  cardMenu: {
    position: "absolute",
    top: 28,
    right: 0,
    width: 160,
    backgroundColor: "#0f141d",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#232a36",
    paddingVertical: 8,
    zIndex: 3,
  },
  cardIndex: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8f9bb2",
    textTransform: "uppercase",
    letterSpacing: 0.6,
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
  editCardBox: {
    marginTop: 4,
  },
  editCardActions: {
    flexDirection: "row",
    gap: 10,
  },
  editCancelButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#232a36",
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#0f141d",
  },
  editCancelButtonText: {
    color: "#dfe5f2",
    fontSize: 15,
    fontWeight: "600",
  },
  editSaveButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#f5f7fb",
  },
  editSaveButtonText: {
    color: "#0c111b",
    fontSize: 15,
    fontWeight: "700",
  },
  saveButtonDisabled: {
    opacity: 0.6,
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
