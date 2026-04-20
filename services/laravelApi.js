import * as SecureStore from "expo-secure-store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = "auth_token";

export async function apiRequest(endpoint, options = {}) {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
      if (response.status === 401 && data?.message === "Unauthenticated.") {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }

      return {
        data: null,
        error: data?.message || "Request failed",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network request failed",
    };
  }
}

export { API_BASE_URL };
