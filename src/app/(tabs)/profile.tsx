import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  colors,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../styles/global";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const initials = getInitials(user?.name || user?.email);

  const handleLogout = () => {
    Alert.alert("Logout?", "You will need to login again.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Account</Text>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.name || "No name"}</Text>
            <Text style={styles.email}>{user?.email || "No email found"}</Text>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={colors.danger} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function getInitials(value?: string) {
  if (!value) return "?";

  const parts = value.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

const styles = StyleSheet.create({
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: fontWeight.extraBold,
  },
  profileCard: {
    ...globalStyles.card,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSurface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    marginBottom: spacing.lg,
  },
  avatarText: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: fontWeight.extraBold,
  },
  userInfo: {
    alignItems: "center",
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  email: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
  },
  logoutButton: {
    ...globalStyles.secondaryButton,
    flexDirection: "row",
    gap: spacing.sm,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});
