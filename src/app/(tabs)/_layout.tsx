import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "index", icon: "home" as const, label: "Home" },
  { name: "decks", icon: "library-books" as const, label: "Decks" },
  { name: "profile", icon: "account-circle" as const, label: "Profile" },
];

const PURPLE = "#b987ff";
const INACTIVE = "#7d8498";

type TabIconProps = {
  focused: boolean;
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

function TabIcon({ focused, iconName, label }: TabIconProps) {
  const color = focused ? PURPLE : INACTIVE;

  return (
    <View style={[styles.tabContent, focused && styles.tabContentActive]}>
      <MaterialIcons name={iconName} size={20} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#090b10",
          paddingBottom: 66 + bottomOffset,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: [styles.tabBar, { bottom: bottomOffset }],
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
    backgroundColor: "#090b10",
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "#24293a",
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
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
    borderColor: "transparent",
    position: "relative",
  },
  tabContentActive: {
    backgroundColor: "#2a2140",
    borderColor: "#4e3b72",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
