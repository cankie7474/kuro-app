import { database } from "./appwrite";

const databaseService = {
  async listDocuments(dbId, colId) {
    try {
      const response = await database.listDocuments(dbId, colId);

      return {
        data: response.documents || [],
        error: null,
      };
    } catch (error) {
      console.error("Error listing documents:", error);

      return {
        data: [],
        error: error.message,
      };
    }
  },
};

export default databaseService;
