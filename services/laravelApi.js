const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      data: null,
      error: data.message || "Request failed",
    };
  }

  return {
    data,
    error: null,
  };
}

export { API_BASE_URL };
