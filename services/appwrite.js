import { Platform } from "react-native";
import { Client, Databases } from "react-native-appwrite";

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  db: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
  col: {
    cards: process.env.EXPO_PUBLIC_APPWRITE_COL_CARDS_ID,
    decks: process.env.EXPO_PUBLIC_APPWRITE_COL_DECKS_ID
  }
};

const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

const database = new Databases(client);

switch(Platform.OS){
    case "ios":
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID);
        break;
    case "android":
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_ID);
        break;
}


export { client, config, database};

