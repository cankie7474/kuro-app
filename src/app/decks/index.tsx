import { useCallback, useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import laravelDeckService from "../../../services/laravelDeckService";
import { router, useFocusEffect } from "expo-router";

export default function DeckScreen() {
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDecks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [])
  );

  const fetchDecks = async () => {
    setLoading(true);
    const response = await laravelDeckService.getDecks();

    if (response.error) {
      console.error("Failed to load decks:", response.error);
      setError(response.error);
      Alert.alert("Decks konnten nicht geladen werden.", response.error);
    } else {
      setDecks(response.data);
      setError(null);
    }
    setLoading(false);
  };

  const handleDeckPress = (deck: any) => {
    router.push(`/decks/${deck.id}`);
  };

  const handleAddDeck = () => {
    router.push(`/decks/new`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.centerLoading}>
            <Text style={styles.stateText}>Loading decks...</Text>
            <ActivityIndicator
              size="large"
              style={styles.activityIndicator}
            ></ActivityIndicator>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.stateText}>{error}</Text>
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
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleDeckPress(item)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.colorBadge,
                    { backgroundColor: item.color || "#4b5563" },
                  ]}
                />
                <Text style={styles.cardMeta}>Deck</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>
                  {item.description || "No description"}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>Open deck</Text>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <View style={styles.headerCopy}>
                  <Text style={styles.eyebrow}>Library</Text>
                  <Text style={styles.title}>Your Decks</Text>
                  <Text style={styles.subtitle}>
                    Review your subjects and continue where you left off.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddDeck}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="add" size={24} color="#f5f7fb" />
                </TouchableOpacity>
              </View>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.stateText}>No decks found.</Text>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 22,
    paddingTop: 8,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#8f9bb2",
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#f5f7fb",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#a7afbd",
    lineHeight: 24,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#121722",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#232a36",
  },
  card: {
    backgroundColor: "#121722",
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    minHeight: 156,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#232a36",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorBadge: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  cardMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8f9bb2",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardBody: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f5f7fb",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 15,
    color: "#a7afbd",
    lineHeight: 22,
  },
  cardFooter: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1d2430",
  },
  cardAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dfe5f2",
  },
  stateText: {
    fontSize: 16,
    color: "#a7afbd",
    textAlign: "center",
  },
  activityIndicator: {
    padding: 20,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
