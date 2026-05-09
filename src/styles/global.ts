import { StyleSheet } from "react-native";

export const colors = {
  background: "#090b10",
  surface: "#121722",
  surfacePrevious: "#131824",
  surfaceMuted: "#0f141d",
  surfaceElevated: "#171d29",
  tabBar: "#090b10",
  tabBarSurface: "#070916",
  tabInactive: "#7d8498",
  deckFallback: "#4b5563",
  deckInputPlaceholder: "#3B82F6",

  border: "#232a36",
  borderMuted: "#1d2430",
  tabBarBorder: "#1d2335",

  text: "#f5f7fb",
  textStrong: "#dfe5f2",
  textSecondary: "#c5cbda",
  textButtonSecondary: "#d8deeb",
  textMuted: "#a7afbd",
  textSubtle: "#8f9bb2",
  textDisabled: "#7c8596",
  textInverse: "#0c0f14",

  primary: "#f4f7fb",
  primaryText: "#0c111b",
  accent: "#b987ff",
  accentBlue: "#8aa0ff",
  accentSurface: "#2a2140",
  accentBorder: "#4e3b72",

  danger: "#ff8f8f",
  success: "#8ee6a8",
  warning: "#ffd166",

  black: "#000000",
  white: "#ffffff",
  transparent: "transparent",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  "2xl": 24,
  "3xl": 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  "2xl": 28,
  pill: 999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 22,
  "3xl": 28,
  "4xl": 32,
} as const;

export const fontWeight = {
  medium: "500",
  semibold: "600",
  bold: "700",
  extraBold: "800",
} as const;

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
  },
  tabBar: {
    shadowColor: colors.black,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
  },
} as const;

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: fontSize.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonDisabledStrong: {
    opacity: 0.45,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
  title: {
    color: colors.text,
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
  },
  body: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    lineHeight: 24,
  },
  caption: {
    color: colors.textSubtle,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
