import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { getChatSocket, disconnectChatSocket } from "@/socket";
import type { Socket } from "socket.io-client";
import { apiClient } from "@/lib/apiClient";

interface ChatContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  messages: Message[];
  socketConnected: boolean;
  sendMessage: (message: string) => void;
  typingUsers: {
    chatId: string;
    users: string[];
  }[];
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  setChats: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  messages: [],
  socketConnected: false,
  sendMessage: () => {},
  typingUsers: [],
  startTyping: () => {},
  stopTyping: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<
    {
      chatId: string;
      users: string[];
    }[]
  >([]);

  const socketRef = useRef<Socket | null>(null);
  const cleanupChatRef = useRef<(() => void) | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        disconnectChatSocket();
        socketRef.current = null;
        setSocketConnected(false);
      }
      if (cleanupChatRef.current) {
        cleanupChatRef.current();
        cleanupChatRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      isConnectingRef.current = false;
      return;
    }

    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    if (isConnectingRef.current) {
      console.log("Socket connection already in progress");
      return;
    }

    const fetchChats = async () => {
      const { data } = await apiClient.get("/api/chat/get-all");
      setChats(data.data);
    };

    fetchChats();

    const connectSocket = async () => {
      try {
        isConnectingRef.current = true;

        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }

        connectionTimeoutRef.current = setTimeout(() => {
          console.log("❌ Socket connection timeout, retrying...");
          if (socketRef.current && !socketRef.current.connected) {
            socketRef.current.removeAllListeners();
            disconnectChatSocket();
            socketRef.current = null;
            setSocketConnected(false);
            isConnectingRef.current = false;
          }
        }, 10000);

        const socket = await getChatSocket();

        if (!socket) {
          console.error("❌ getChatSocket returned null/undefined");
          setSocketConnected(false);
          isConnectingRef.current = false;
          return;
        }

        socket.on("connect", () => {
          console.log("✅ Connected to /chat:", socket.id);
          setSocketConnected(true);
          isConnectingRef.current = false;
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
        });

        socket.on("disconnect", (reason) => {
          console.log("❌ Disconnected from /chat, reason:", reason);
          setSocketConnected(false);
          isConnectingRef.current = false;
        });

        socket.on("connect_error", (err: Error) => {
          console.error("Socket connection error:", err.message);
          setSocketConnected(false);
          isConnectingRef.current = false;
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setSocketConnected(false);
        isConnectingRef.current = false;
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
      if (cleanupChatRef.current) {
        cleanupChatRef.current();
        cleanupChatRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [user]);

  const connectToChat = useCallback(async () => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChat) {
      return;
    }

    if (cleanupChatRef.current) {
      cleanupChatRef.current();
      cleanupChatRef.current = null;
    }

    console.log("Joining chat:", selectedChat._id);

    try {
      const { data } = await apiClient.get(
        `/api/message/get-all?chatId=${selectedChat._id}`,
      );

      setMessages(data.data);

      socket.emit("join_chat", selectedChat._id);

      const handleNewMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
        setChats((prev) => {
          const chatIndex = prev.findIndex(
            (chat) => chat._id === selectedChat._id,
          );
          if (chatIndex !== -1) {
            prev[chatIndex].latestMessage = msg;
          }
          return prev;
        });
      };

      const handleTyping = (data: {
        user_id: string;
        isTyping: boolean;
        chatId: string;
      }) => {
        setTypingUsers((prev) => {
          const existingChatIndex = prev.findIndex(
            (p) => p.chatId === data.chatId,
          );

          if (data.isTyping) {
            if (existingChatIndex === -1) {
              return [...prev, { chatId: data.chatId, users: [data.user_id] }];
            } else {
              const updated = [...prev];
              if (!updated[existingChatIndex].users.includes(data.user_id)) {
                updated[existingChatIndex] = {
                  ...updated[existingChatIndex],
                  users: [...updated[existingChatIndex].users, data.user_id],
                };
              }
              return updated;
            }
          } else {
            if (existingChatIndex === -1) {
              return prev;
            } else {
              const updated = [...prev];
              updated[existingChatIndex] = {
                ...updated[existingChatIndex],
                users: updated[existingChatIndex].users.filter(
                  (id) => id !== data.user_id,
                ),
              };
              return updated;
            }
          }
        });
      };

      socket.on("new_message", handleNewMessage);
      socket.on("typing", handleTyping);

      const cleanup = () => {
        socket.emit("leave_chat", selectedChat._id);
        socket.off("new_message", handleNewMessage);
        socket.off("typing", handleTyping);
        setMessages([]);
        setTypingUsers([]);
      };

      cleanupChatRef.current = cleanup;
    } catch (error) {
      console.error("Failed to connect to chat:", error);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (socketConnected && selectedChat) {
      connectToChat();
    } else if (!selectedChat && cleanupChatRef.current) {
      cleanupChatRef.current();
      cleanupChatRef.current = null;
    }
  }, [selectedChat, socketConnected, connectToChat]);

  const sendMessage = async (message: string) => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChat) return;
    socket.emit("send_message", {
      chatId: selectedChat._id,
      message,
    });
  };

  const stopTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChat) return;

    socket.emit("typing", {
      chatId: selectedChat._id,
      isTyping: false,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [selectedChat]);

  const startTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChat) return;

    socket.emit("typing", {
      chatId: selectedChat._id,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  }, [selectedChat, stopTyping]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        messages,
        socketConnected,
        sendMessage,
        typingUsers,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
