import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { logout as logoutFirebase } from "@/lib/authActions";
import { setToken, clearToken, apiClient, queryClient } from "@/lib/apiClient";
import { useGetUser } from "@/hooks/useAuth";
import { QUERY_KEYS } from "@/constants";

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
  const [authLoading, setAuthLoading] = useState(true);
  const [userQueryEnabled, setUserQueryEnabled] = useState(false);

  const { data: user, isLoading: userLoading } = useGetUser(userQueryEnabled);

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
            await apiClient.post<{ data: User }>(`/api/auth/register`);
            localStorage.setItem(`registered-${fbUser.uid}`, "true");
          }
          setUserQueryEnabled(true);
        } catch (error) {
          console.error("Error getting user data:", error);
          setfirebaseUser(null);
          clearToken();
          setUserQueryEnabled(false);
        } finally {
          setAuthLoading(false);
        }
      } else {
        setfirebaseUser(null);
        clearToken();
        setUserQueryEnabled(false);
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER.GET_USER] });
        setAuthLoading(false);
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
      setAuthLoading(true);
      const uid = firebaseUser.uid;
      await logoutFirebase();
      localStorage.removeItem(`registered-${uid}`);
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER.GET_USER] });
      toast.success("Successfully logged out");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout failed:", errorMessage);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const loading = authLoading || userLoading;

  return (
    <AuthContext.Provider
      value={{ firebaseUser, user: user || null, loading, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
