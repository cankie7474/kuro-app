import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topAccent} />
        <View style={styles.bottomAccent} />

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Study Better</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>Kuro</Text>
            <Text style={styles.subtitle}>
              A minimal flashcard app for focused review sessions and clean deck
              organization.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </Pressable>

            <Pressable style={styles.loginLink} onPress={handleLogin}>
              <Text style={styles.loginLinkText}>Login</Text>
            </Pressable>
          </View>
        </View>
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
    backgroundColor: "#090b10",
  },
  topAccent: {
    position: "absolute",
    top: 72,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "#18233a",
    opacity: 0.8,
  },
  bottomAccent: {
    position: "absolute",
    bottom: 120,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#2b1735",
    opacity: 0.55,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#121722",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#232a36",
    marginBottom: 24,
  },
  badgeText: {
    color: "#aeb8ca",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  hero: {
    marginBottom: 28,
  },
  title: {
    fontSize: 56,
    fontWeight: "800",
    color: "#f5f7fb",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: "#a7afbd",
    maxWidth: 320,
    marginBottom: 28,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#f4f7fb",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#0c0f14",
    fontSize: 17,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    paddingVertical: 4,
  },
  loginLinkText: {
    color: "#8f9bb2",
    fontSize: 14,
    fontWeight: "500",
  },
});
