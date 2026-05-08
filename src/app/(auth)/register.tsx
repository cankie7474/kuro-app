import { useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  colors,
  fontSize,
  fontWeight,
  globalStyles,
  spacing,
} from "../../styles/global";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setSubmitting(true);
    const response = await register(name, email, password);
    setSubmitting(false);

    if (response.error) {
      Alert.alert("Register failed", response.error);
      return;
    }

    router.replace("/decks");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colors.textDisabled}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textDisabled}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textDisabled}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[styles.button, submitting && globalStyles.buttonDisabled]}
          onPress={handleRegister}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Creating..." : "Create account"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already registered? Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing["2xl"],
    gap: 14,
  },
  title: {
    ...globalStyles.title,
    color: colors.white,
    marginBottom: spacing.md,
  },
  input: { ...globalStyles.input, padding: spacing.lg },
  button: {
    ...globalStyles.primaryButton,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  link: { color: colors.textSubtle, textAlign: "center", marginTop: 10 },
});
