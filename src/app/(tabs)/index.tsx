import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import laravelDashboardService from "../../../services/laravelDashboardService";
import { useAuth } from "../../context/AuthContext";
import {
  colors,
  fontSize,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../styles/global";

type LatestDeck = {
  id: number;
  title: string;
  description: string | null;
  progress: number;
};

type DashboardData = {
  deck_count: number;
  card_count: number;
  due_cards: number;
  study_streak: number;
  latest_deck: LatestDeck | null;
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    const response = await laravelDashboardService.getDashboard();

    if (response.error) {
      setError(response.error);
      setDashboard(null);
    } else {
      setDashboard(response.data as DashboardData);
      setError(null);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  const handleOpenDecks = () => {
    router.push("/decks");
  };

  const handleCreateDeck = () => {
    router.push("/decks/new");
  };

  const handleContinueStudy = () => {
    if (!dashboard?.latest_deck) {
      router.push("/decks/new");
      return;
    }

    router.push(`/decks/${dashboard.latest_deck.id}/study`);
  };

  const latestDeck = dashboard?.latest_deck;

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

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" />
            <Text style={styles.stateText}>Loading dashboard...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Could not load dashboard</Text>
            <Text style={styles.stateText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchDashboard}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                icon="library-books"
                label="Decks"
                value={dashboard?.deck_count ?? 0}
              />
              <StatCard
                icon="style"
                label="Cards"
                value={dashboard?.card_count ?? 0}
              />
              <StatCard
                icon="schedule"
                label="Due today"
                value={dashboard?.due_cards ?? 0}
              />
              <StatCard
                icon="local-fire-department"
                label="Streak"
                value={`${dashboard?.study_streak ?? 0}d`}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Continue studying</Text>
                {latestDeck && (
                  <Text style={styles.sectionMeta}>
                    {latestDeck.progress}% done
                  </Text>
                )}
              </View>

              {latestDeck ? (
                <View style={styles.continueCard}>
                  <View style={styles.continueIcon}>
                    <MaterialIcons
                      name="school"
                      size={24}
                      color={colors.accent}
                    />
                  </View>

                  <View style={styles.continueContent}>
                    <Text style={styles.deckTitle}>{latestDeck.title}</Text>
                    <Text style={styles.deckDescription}>
                      {latestDeck.description || "No description yet."}
                    </Text>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${latestDeck.progress}%` },
                        ]}
                      />
                    </View>
                  </View>

                  <Pressable
                    style={styles.studyButton}
                    onPress={handleContinueStudy}
                  >
                    <MaterialIcons
                      name="play-arrow"
                      size={20}
                      color={colors.textInverse}
                    />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.emptyDeckCard}>
                  <Text style={styles.emptyDeckTitle}>No deck yet</Text>
                  <Text style={styles.emptyDeckText}>
                    Create your first deck to start learning.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.quickActions}>
              <Pressable
                style={styles.primaryAction}
                onPress={handleCreateDeck}
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={colors.textInverse}
                />
                <Text style={styles.primaryActionText}>Create Deck</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryAction}
                onPress={handleOpenDecks}
              >
                <MaterialIcons
                  name="folder-open"
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.secondaryActionText}>Open Decks</Text>
              </Pressable>
            </View>
          </>
        )}
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
    paddingBottom: 50,
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
  stateCard: {
    ...globalStyles.card,
    alignItems: "center",
    gap: spacing.md,
    padding: spacing["2xl"],
  },
  stateTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  stateText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: 22,
    textAlign: "center",
  },
  retryButton: {
    ...globalStyles.secondaryButton,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
  },
  retryButtonText: globalStyles.secondaryButtonText,
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
  emptyDeckCard: {
    ...globalStyles.card,
    padding: spacing.lg,
    borderRadius: radius["2xl"],
  },
  emptyDeckTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  emptyDeckText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: 20,
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
