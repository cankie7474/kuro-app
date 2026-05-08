import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import laravelDeckService from "../../../../../services/laravelDeckService";
import {
  colors,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../../../styles/global";

type Deck = {
  id: number;
  title: string;
  description?: string | null;
  color?: string | null;
};

export default function EditDeckScreen() {
  const params = useLocalSearchParams();
  const deckId = params.deckId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    fetchDeck();
  }, [deckId]);

  const fetchDeck = async () => {
    if (!deckId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const response = await laravelDeckService.getDeckById(String(deckId));

    if (response.error) {
      console.error("Failed to load deck:", response.error);
      Alert.alert("Failed to load deck", response.error);
    } else if (response.data) {
      const deck = response.data as Deck;
      setTitle(deck.title || "");
      setDescription(deck.description || "");
      setColor(deck.color || "");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!deckId) {
      console.error("Failed to update deck: missing deck ID");
      Alert.alert("Error", "No deck ID found.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a title.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      color: color.trim() || null,
    };

    setSaving(true);

    const response = await laravelDeckService.updateDeck(
      String(deckId),
      payload
    );

    if (response.error) {
      console.error("Failed to update deck:", response.error);
      Alert.alert("Failed to update deck", response.error);
      setSaving(false);
      return;
    }

    setSaving(false);
    Alert.alert("Success", "Deck was updated.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>Manage Details</Text>
              <Text style={styles.title}>Edit Deck</Text>
              <Text style={styles.subtitle}>
                Refine the deck name, description, and visual color.
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.field}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  placeholder="German"
                  placeholderTextColor={colors.textSubtle}
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  editable={!loading}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  placeholder="Grammar, vocabulary, and sentence structure"
                  placeholderTextColor={colors.textSubtle}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                  editable={!loading}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                  placeholder={colors.deckInputPlaceholder}
                  placeholderTextColor={colors.textSubtle}
                  style={styles.input}
                  value={color}
                  onChangeText={setColor}
                  editable={!loading}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </ScrollView>

          <Pressable
            style={[
              styles.saveButton,
              (loading || saving) && globalStyles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={loading || saving}
          >
            <Text style={styles.saveButtonText}>
              {loading
                ? "Loading Deck..."
                : saving
                  ? "Saving..."
                  : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  topBar: {
    marginBottom: spacing.xl,
  },
  iconButton: {
    ...globalStyles.iconButton,
    alignSelf: "flex-start",
  },
  scrollContent: {
    paddingBottom: spacing["2xl"],
  },
  heroCard: {
    ...globalStyles.card,
    borderRadius: radius["2xl"],
    padding: 22,
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: fontWeight.extraBold,
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  formCard: {
    ...globalStyles.card,
    borderRadius: radius["2xl"],
    padding: 18,
    gap: 16,
    marginBottom: spacing.xl,
  },
  field: {
    gap: 10,
  },
  label: {
    color: colors.textStrong,
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  input: {
    ...globalStyles.input,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
  },
  textArea: {
    minHeight: 130,
  },
  saveButton: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: "auto",
  },
  saveButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: fontWeight.bold,
  },
});
