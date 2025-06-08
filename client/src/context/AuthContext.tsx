import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { logout as logoutFirebase } from "@/lib/authActions";
import { setToken, clearToken, apiClient } from "@/lib/apiClient";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  logout: async () => {},
  getToken: async () => undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setfirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setfirebaseUser(fbUser);
        try {
          const token = await fbUser.getIdToken();
          setToken(token);
          const alreadyRegistered = localStorage.getItem(
            `registered-${fbUser.uid}`,
          );
          if (!alreadyRegistered) {
            const { data } = await apiClient.post<{ data: User }>(
              `/api/auth/register`,
            );
            setUser(data.data);
            localStorage.setItem(`registered-${fbUser.uid}`, "true");
          } else {
            const { data } = await apiClient.get<{ data: User }>(
              `/api/auth/get-user`,
            );
            setUser(data.data);
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          setUser(null);
          setfirebaseUser(null);
          clearToken();
        } finally {
          setLoading(false);
        }
      } else {
        setfirebaseUser(null);
        setUser(null);
        clearToken();
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    if (!firebaseUser) return undefined;
    try {
      const token = await firebaseUser.getIdToken();
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return undefined;
    }
  };

  const logout = async () => {
    if (!firebaseUser) return;
    try {
      setLoading(true);
      const uid = firebaseUser.uid;
      await logoutFirebase();
      localStorage.removeItem(`registered-${uid}`);
      toast.success("Successfully logged out");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout failed:", errorMessage);
      toast.error("Failed to logout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, user, loading, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
