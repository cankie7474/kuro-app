import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontWeight, globalStyles, spacing } from "../../styles/global";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.demoText}>Hier erscheint bald Profile.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: fontWeight.extraBold,
    marginBottom: spacing.md,
  },
  demoText: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 26,
  },
});
