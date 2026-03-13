import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/integrations/api/client";

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  setUser: () => {},
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
