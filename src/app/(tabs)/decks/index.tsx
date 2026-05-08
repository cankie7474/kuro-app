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
import laravelDeckService from "../../../../services/laravelDeckService";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import {
  colors,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../../styles/global";

export default function DeckScreen() {
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }

    if (user) {
      fetchDecks();
    }
  }, [authLoading, user]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchDecks();
      }
    }, [user])
  );

  const fetchDecks = async () => {
    setLoading(true);
    const response = await laravelDeckService.getDecks();

    if (response.error) {
      console.error("Failed to load decks:", response.error);
      setError(response.error);
      Alert.alert("Failed to load decks", response.error);
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

  if (authLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.centerLoading}>
            <Text style={styles.stateText}>Checking session...</Text>
            <ActivityIndicator size="large" style={styles.activityIndicator} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
                    { backgroundColor: item.color || colors.deckFallback },
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

                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleAddDeck}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons name="add" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
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
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
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
    gap: spacing.lg,
  },
  headerCopy: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textSubtle,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: fontWeight.extraBold,
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 24,
  },
  iconButton: {
    ...globalStyles.iconButton,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    minHeight: 156,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
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
    borderRadius: radius.pill,
  },
  cardMeta: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    color: colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardBody: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  cardFooter: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: colors.textStrong,
  },
  stateText: {
    fontSize: 16,
    color: colors.textMuted,
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
