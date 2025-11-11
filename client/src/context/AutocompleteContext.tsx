import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useAuth } from "./AuthContext";
import { disconnectAutocompleteSocket, getAutocompleteSocket } from "@/socket";
import type { Socket } from "socket.io-client";

interface AutocompleteContextType {
  getAutocomplete: (
    chatId: string,
    context: string,
    onPrediction: (text: string) => void,
  ) => void;
}

const AutocompleteContext = createContext<AutocompleteContextType>({
  getAutocomplete: () => {},
});

export const AutocompleteProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [autocompleteSocketConnected, setAutocompleteSocketconnected] =
    useState(false);

  const socket: RefObject<Socket | null> = useRef(null);
  const predictionCallbackRef = useRef<((text: string) => void) | null>(null);

  const getAutocomplete = (
    chatId: string,
    context: string,
    onPrediction: (text: string) => void,
  ) => {
    if (!autocompleteSocketConnected) return;
    predictionCallbackRef.current = onPrediction;
    if (socket.current)
      socket.current.emit("get_auto_complete", { chatId, context });
  };

  const value = { getAutocomplete };

  const connectSocket = useCallback(async () => {
    if (!user) return;
    try {
      if (socket.current) {
        socket.current.removeAllListeners();
        disconnectAutocompleteSocket();
        socket.current = null;
      }

      console.log("🔄 Connecting to autocomplete socket...");
      socket.current = await getAutocompleteSocket();

      if (!socket) {
        console.error("❌ Failed to get socket instance");
        setAutocompleteSocketconnected(false);
        return;
      }

      socket.current.on("connect", () => {
        console.log(
          "🛺✅ Autocomplete Socket connected:",
          socket.current && socket?.current.id,
        );
        setAutocompleteSocketconnected(true);
      });

      socket.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setAutocompleteSocketconnected(false);
      });

      socket.current.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
        setAutocompleteSocketconnected(false);
      });

      socket.current.on("predicted_text", (text: string) => {
        console.log("📝 Received prediction:", text);
        if (predictionCallbackRef.current) {
          predictionCallbackRef.current(text);
        }
      });

      if (socket.current.connected) {
        setAutocompleteSocketconnected(true);
      }
    } catch (error) {
      console.error("❌ Socket connection failed:", error);
      setAutocompleteSocketconnected(false);
    }
  }, [user]);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  return (
    <AutocompleteContext.Provider value={value}>
      {children}
    </AutocompleteContext.Provider>
  );
};

export const useAutocomplete = () => useContext(AutocompleteContext);
