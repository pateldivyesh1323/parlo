import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { logout as logoutFirebase } from "@/lib/authActions";
import { setToken, clearToken, apiClient } from "@/lib/apiClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  getToken: async () => undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          if (token) {
            setToken(token);
          }
        } catch (error) {
          console.error("Error getting initial token:", error);
        }
      } else {
        clearToken();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const saveUser = async (user: User) => {
    try {
      const alreadyRegistered = localStorage.getItem(`registered-${user.uid}`);
      if (!alreadyRegistered) {
        await apiClient.post(`/api/auth/register`);
        localStorage.setItem(`registered-${user.uid}`, "true");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      saveUser(user);
    }
  }, [user]);

  const getToken = async () => {
    if (!user) return undefined;
    try {
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return undefined;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutFirebase();
      localStorage.removeItem(`registered-${user?.uid}`);
      clearToken();
      toast.success("Successfully logged out");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout failed:", errorMessage);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
