import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  colors,
  fontSize,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../styles/global";

// TODO: Replace this object with real dashboard data from the backend.
// Example idea: GET /api/dashboard -> { deckCount, cardCount, latestDeck, dueCards }
const dashboardDemoData = {
  deckCount: 4,
  cardCount: 128,
  dueCards: 18,
  studyStreak: 5,
  latestDeck: {
    id: 1,
    title: "Deutsch Grundlagen",
    description: "Artikel, Verben und wichtige Alltagssätze.",
    progress: 62,
  },
};

export default function DashboardScreen() {
  const { user } = useAuth();

  const handleOpenDecks = () => {
    router.push("/decks");
  };

  const handleCreateDeck = () => {
    router.push("/decks/new");
  };

  const handleContinueStudy = () => {
    // TODO: Replace latestDeck.id with the real recommended deck/study route.
    router.push(`/decks/${dashboardDemoData.latestDeck.id}/study`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Dashboard</Text>
          <Text style={styles.title}>
            Ready to learn{user?.name ? `, ${user.name}` : ""}?
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="library-books"
            label="Decks"
            value={dashboardDemoData.deckCount}
          />
          <StatCard
            icon="style"
            label="Cards"
            value={dashboardDemoData.cardCount}
          />
          <StatCard
            icon="schedule"
            label="Due today"
            value={dashboardDemoData.dueCards}
          />
          <StatCard
            icon="local-fire-department"
            label="Streak"
            value={`${dashboardDemoData.studyStreak}d`}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue studying</Text>
            <Text style={styles.sectionMeta}>
              {dashboardDemoData.latestDeck.progress}% done
            </Text>
          </View>

          <View style={styles.continueCard}>
            <View style={styles.continueIcon}>
              <MaterialIcons name="school" size={24} color={colors.accent} />
            </View>

            <View style={styles.continueContent}>
              <Text style={styles.deckTitle}>
                {dashboardDemoData.latestDeck.title}
              </Text>
              <Text style={styles.deckDescription}>
                {dashboardDemoData.latestDeck.description}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${dashboardDemoData.latestDeck.progress}%` },
                  ]}
                />
              </View>
            </View>

            <Pressable style={styles.studyButton} onPress={handleContinueStudy}>
              <MaterialIcons
                name="play-arrow"
                size={20}
                color={colors.textInverse}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Pressable style={styles.primaryAction} onPress={handleCreateDeck}>
            <MaterialIcons name="add" size={20} color={colors.textInverse} />
            <Text style={styles.primaryActionText}>Create Deck</Text>
          </Pressable>

          <Pressable style={styles.secondaryAction} onPress={handleOpenDecks}>
            <MaterialIcons name="folder-open" size={20} color={colors.text} />
            <Text style={styles.secondaryActionText}>Open Decks</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <MaterialIcons name={icon} size={20} color={colors.accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: globalStyles.safeArea,
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 110,
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
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing["2xl"],
  },
  statCard: {
    ...globalStyles.card,
    width: "48%",
    padding: spacing.lg,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSurface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    marginBottom: spacing.md,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.extraBold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSubtle,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionHeader: {
    ...globalStyles.rowBetween,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  sectionMeta: {
    color: colors.textSubtle,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  continueCard: {
    ...globalStyles.card,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius["2xl"],
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSurface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  continueContent: {
    flex: 1,
  },
  deckTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  deckDescription: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  studyButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  quickActions: {
    gap: spacing.md,
  },
  primaryAction: {
    ...globalStyles.primaryButton,
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryActionText: globalStyles.primaryButtonText,
  secondaryAction: {
    ...globalStyles.secondaryButton,
    flexDirection: "row",
    gap: spacing.sm,
  },
  secondaryActionText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
