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

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await login(email, password);

    if (response.error) {
      Alert.alert("Login failed", response.error);
      return;
    }

    router.replace("/decks");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

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

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.link}>No account? Register</Text>
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
