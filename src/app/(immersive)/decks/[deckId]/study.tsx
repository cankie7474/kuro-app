import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import laravelCardService from "../../../../../services/laravelCardService";
import {
  colors,
  fontWeight,
  globalStyles,
  radius,
  spacing,
} from "../../../../styles/global";

type Card = {
  id: number;
  front: string;
  back: string;
  deck_id: number;
};

export default function StudyScreen() {
  const params = useLocalSearchParams();
  const deckId = params.deckId;

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const translateX = useSharedValue(0);
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    fetchCards();
  }, [deckId]);

  const fetchCards = async () => {
    if (!deckId) return;

    setLoading(true);

    const response = await laravelCardService.getCardsByDeck(String(deckId));

    if (response.error) {
      console.error("Failed to load study cards:", response.error);
      Alert.alert("Failed to load study cards", response.error);
      setCards([]);
    } else {
      setCards(response.data as Card[]);
    }

    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const finishCardTransition = (nextIndex: number, enterFrom: number) => {
    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    translateX.value = enterFrom;
    translateX.value = withTiming(0, { duration: 220 });
  };

  const animateToCard = (nextIndex: number, direction: "next" | "previous") => {
    const exitTo = direction === "next" ? -320 : 320;
    const enterFrom = direction === "next" ? 320 : -320;

    translateX.value = withTiming(exitTo, { duration: 180 }, () => {
      runOnJS(finishCardTransition)(nextIndex, enterFrom);
    });
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      animateToCard(currentIndex - 1, "previous");
    }
  };

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      animateToCard(currentIndex + 1, "next");
    } else {
      router.back();
      console.log("study finished");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.centerState}>
            <Text style={styles.stateText}>Loading study session...</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.centerState}>
            <Text style={styles.stateTitle}>No cards available</Text>
            <Text style={styles.stateText}>
              Add cards to this deck before starting a study session.
            </Text>

            <TouchableOpacity
              style={styles.emptyBackButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBackButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <MaterialIcons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.progressText}>
              {currentIndex + 1} / {cards.length}
            </Text>
          </View>

          <Animated.View style={[styles.card, animatedCardStyle]}>
            <Text style={styles.cardLabel}>Question</Text>
            <Text style={styles.cardFront}>{currentCard.front}</Text>

            <View style={styles.answerBlock}>
              <Text style={styles.cardLabel}>Answer</Text>
              <Text style={styles.cardBack}>
                {showAnswer
                  ? currentCard.back
                  : "Tap below to reveal the answer."}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.actions}>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  currentIndex === 0 && globalStyles.buttonDisabledStrong,
                ]}
                onPress={handlePreviousCard}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    currentIndex === 0 && globalStyles.textDisabled,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              {!showAnswer ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleShowAnswer}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Show Answer</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleNextCard}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLastCard ? "Finish" : "Next Card"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: globalStyles.safeArea,
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 28,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  stateText: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: spacing.xl,
    maxWidth: 290,
  },
  emptyBackButton: {
    ...globalStyles.secondaryButton,
    minWidth: 120,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
  },
  emptyBackButtonText: {
    ...globalStyles.secondaryButtonText,
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  iconButton: globalStyles.iconButton,
  progressText: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: colors.textSubtle,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    color: colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  cardFront: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.text,
    lineHeight: 38,
  },
  answerBlock: {
    marginTop: 32,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  cardBack: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: 18,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfacePrevious,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textButtonSecondary,
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});
