import { Text, View, StyleSheet } from "react-native";

export default function DeckScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the deck screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
