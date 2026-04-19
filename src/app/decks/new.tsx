import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import laravelDeckService from "../../../services/laravelDeckService";

export default function CreateDeckScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");

  const handleCreateDeck = async () => {
    if (!title.trim()) {
      Alert.alert("Titel fehlt", "Bitte gib einen Titel ein.");
      return;
    }

    const newDeck = {
      title: title.trim(),
      description: description.trim() || null,
      color: color.trim() || null,
    };

    const response = await laravelDeckService.createDeck(newDeck);

    if (response.error) {
      console.error("Failed to create deck:", response.error);
      Alert.alert("Failed to create deck:", response.error);
      return;
    }

    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <MaterialIcons name="arrow-back" size={22} color="#f5f7fb" />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>New Deck</Text>
            <Text style={styles.title}>Create Deck</Text>
            <Text style={styles.subtitle}>
              Add a title, description and color for your new deck.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                placeholder="Deutsch"
                placeholderTextColor="#8f9bb2"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Wortarten und Grammatik"
                placeholderTextColor="#8f9bb2"
                style={[styles.input, styles.textArea]}
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
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
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => handleCreateDeck()}
          >
            <Text style={styles.buttonText}>Create Deck</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  topBar: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#121722",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#232a36",
    alignSelf: "flex-start",
  },
  header: {
    marginBottom: 28,
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
    fontSize: 32,
    fontWeight: "800",
    color: "#f5f7fb",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#a7afbd",
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dfe5f2",
  },
  input: {
    backgroundColor: "#121722",
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
  button: {
    marginTop: "auto",
    backgroundColor: "#f5f7fb",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0c111b",
  },
});
