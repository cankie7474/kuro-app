import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadows } from "../../styles/global";

const TABS = [
  { name: "index", icon: "home" as const, label: "Home" },
  { name: "decks", icon: "library-books" as const, label: "Decks" },
  { name: "profile", icon: "account-circle" as const, label: "Profile" },
];

type TabIconProps = {
  focused: boolean;
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

function TabIcon({ focused, iconName, label }: TabIconProps) {
  const color = focused ? colors.accent : colors.tabInactive;

  return (
    <View style={[styles.tabContent, focused && styles.tabContentActive]}>
      <MaterialIcons name={iconName} size={20} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const bottomOffset = Math.max(insets.bottom, 12);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const hideTabBar =
    keyboardVisible || pathname === "/decks/new" || pathname.endsWith("/edit");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
          paddingBottom: hideTabBar ? 0 : 66 + bottomOffset,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: [
          styles.tabBar,
          { bottom: bottomOffset },
          hideTabBar && styles.tabBarHidden,
        ],
      }}
    >
      {TABS.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} iconName={icon} label={label} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 62,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 6,
    backgroundColor: colors.tabBar,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.tabBar,
  },
  tabBarHidden: {
    display: "none",
  },
  tabBarItem: {
    flex: 1,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarIcon: {
    width: "100%",
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    minWidth: 64,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: colors.transparent,
    position: "relative",
  },
  tabContentActive: {
    backgroundColor: colors.accentSurface,
    borderColor: colors.accentBorder,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
