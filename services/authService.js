import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./laravelApi";

const TOKEN_KEY = "auth_token";

const authService = {
  async saveToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async register(payload) {
    const response = await apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  },

  async login(payload) {
    const response = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  },

  async me() {
    return await apiRequest("/api/me");
  },

  async logout() {
    const response = await apiRequest("/api/logout", {
      method: "POST",
    });

    await this.removeToken();
    return response;
  },
};

export default authService;
