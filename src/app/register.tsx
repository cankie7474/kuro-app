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
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const response = await register(name, email, password);

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
          placeholderTextColor="#7c8596"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7c8596"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7c8596"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create account</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already registered? Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#090b10" },
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 14 },
  title: { color: "#fff", fontSize: 32, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#121722",
    color: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#232a36",
  },
  button: {
    backgroundColor: "#f4f7fb",
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#0c0f14", fontSize: 16, fontWeight: "600" },
  link: { color: "#8f9bb2", textAlign: "center", marginTop: 10 },
});
