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
              <MaterialIcons name="arrow-back" size={22} color="#f5f7fb" />
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
                  placeholderTextColor="#8f9bb2"
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
                  placeholderTextColor="#8f9bb2"
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
                  placeholder="#3B82F6"
                  placeholderTextColor="#8f9bb2"
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
              (loading || saving) && styles.saveButtonDisabled,
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
  safeArea: {
    flex: 1,
    backgroundColor: "#090b10",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  topBar: {
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
    alignSelf: "flex-start",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: "#121722",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#232a36",
    marginBottom: 18,
  },
  eyebrow: {
    color: "#8f9bb2",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    color: "#f5f7fb",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#a7afbd",
    fontSize: 15,
    lineHeight: 23,
  },
  formCard: {
    backgroundColor: "#121722",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#232a36",
    gap: 16,
    marginBottom: 18,
  },
  field: {
    gap: 10,
  },
  label: {
    color: "#dfe5f2",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0f141d",
    borderWidth: 1,
    borderColor: "#232a36",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: "#f5f7fb",
  },
  textArea: {
    minHeight: 130,
  },
  saveButton: {
    backgroundColor: "#f5f7fb",
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: "auto",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#0c111b",
    fontSize: 16,
    fontWeight: "700",
  },
});
