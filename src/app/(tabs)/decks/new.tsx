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
import laravelDeckService from "../../../../services/laravelDeckService";
import {
  colors,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../../styles/global";

export default function CreateDeckScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");

  const handleCreateDeck = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a title.");
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
              <MaterialIcons name="arrow-back" size={22} color={colors.text} />
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
                placeholderTextColor={colors.textSubtle}
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Wortarten und Grammatik"
                placeholderTextColor={colors.textSubtle}
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
                placeholder={colors.deckInputPlaceholder}
                placeholderTextColor={colors.textSubtle}
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
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing["2xl"],
    paddingBottom: 28,
  },
  topBar: {
    marginBottom: spacing["2xl"],
  },
  backButton: {
    ...globalStyles.iconButton,
    alignSelf: "flex-start",
  },
  header: {
    marginBottom: 28,
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
    fontSize: 32,
    fontWeight: fontWeight.extraBold,
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: colors.textStrong,
  },
  input: {
    ...globalStyles.input,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
  },
  textArea: {
    minHeight: 130,
  },
  button: {
    marginTop: "auto",
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
});
