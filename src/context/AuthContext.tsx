import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "../../services/authService";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    const token = await authService.getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    const response = await authService.me();

    if (response.error) {
      await authService.removeToken();
      setUser(null);
    } else {
      setUser(response.data);
    }

    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });

    if (!response.error) {
      setUser(response.data.user);
    }

    return response;
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password });

    if (!response.error) {
      setUser(response.data.user);
    }

    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
