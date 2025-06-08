import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getChatSocket, disconnectChatSocket } from "@/socket";
import type { Socket } from "socket.io-client";

interface ChatContextType {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  messages: Message[];
  socketConnected: boolean;
  sendMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  selectedChat: null,
  setSelectedChat: () => {},
  messages: [],
  socketConnected: false,
  sendMessage: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        disconnectChatSocket();
        socketRef.current = null;
        setSocketConnected(false);
      }
      return;
    }

    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    const connectSocket = async () => {
      try {
        const socket = await getChatSocket();

        if (!socket) {
          console.error("❌ getChatSocket returned null/undefined");
          setSocketConnected(false);
          return;
        }

        socket.on("connect", () => {
          console.log("✅ Connected to /chat:", socket.id);
          setSocketConnected(true);
        });

        socket.on("disconnect", (reason) => {
          console.log("❌ Disconnected from /chat, reason:", reason);
          setSocketConnected(false);
        });

        socket.on("connect_error", (err: Error) => {
          console.error("Socket connection error:", err.message);
          setSocketConnected(false);
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setSocketConnected(false);
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        console.log("❌ Disconnecting socket because of logout");
        socketRef.current.removeAllListeners();
        disconnectChatSocket();
        socketRef.current = null;
        setSocketConnected(false);
      }
    };
  }, [user]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChat) {
      return;
    }
    console.log("Joining chat:", selectedChat._id);

    socket.emit("join_chat", selectedChat._id);

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave_chat", selectedChat._id);
      socket.off("new_message");
      setMessages([]);
    };
  }, [selectedChat, socketConnected]);

  const sendMessage = async (message: string) => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChat) return;
    socket.emit("send_message", {
      chatId: selectedChat._id,
      message,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        messages,
        socketConnected,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
