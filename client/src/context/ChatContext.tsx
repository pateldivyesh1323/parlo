import {
  createContext,
  useContext,
  useEffect,
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
  reconnectSocket: () => void;
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
  reconnectSocket: () => {},
});

let socket: Socket | null = null;

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

  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.get("/api/chat/get-all");
      setChats(data.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  }, [user]);

  const connectSocket = useCallback(async () => {
    if (!user) return;

    try {
      if (socket) {
        socket.removeAllListeners();
        disconnectChatSocket();
        socket = null;
      }

      console.log("🔄 Connecting to chat socket...");
      socket = await getChatSocket();

      if (!socket) {
        console.error("❌ Failed to get socket instance");
        setSocketConnected(false);
        return;
      }

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
        setSocketConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setSocketConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
        setSocketConnected(false);
      });

      if (socket.connected) {
        setSocketConnected(true);
      }
    } catch (error) {
      console.error("❌ Socket connection failed:", error);
      setSocketConnected(false);
    }
  }, [user]);

  const reconnectSocket = useCallback(() => {
    connectSocket();
  }, [connectSocket]);

  useEffect(() => {
    if (user) {
      fetchChats();
      connectSocket();
    } else {
      if (socket) {
        socket.removeAllListeners();
        disconnectChatSocket();
        socket = null;
      }
      setSocketConnected(false);
      setChats([]);
      setSelectedChat(null);
      setMessages([]);
      setTypingUsers([]);
    }

    return () => {
      if (!user && socket) {
        socket.removeAllListeners();
        disconnectChatSocket();
        socket = null;
        setSocketConnected(false);
      }
    };
  }, [user, fetchChats, connectSocket]);

  useEffect(() => {
    if (!socket || !socketConnected || !selectedChat?._id) {
      setMessages([]);
      setTypingUsers([]);
      return;
    }

    const chatId = selectedChat._id;

    const loadMessages = async () => {
      try {
        console.log("📨 Loading messages for chat:", chatId);
        const { data } = await apiClient.get(
          `/api/message/get-all?chatId=${chatId}`,
        );
        setMessages(data.data);
        socket?.emit("join_chat", chatId);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    const handleNewMessage = (msg: Message) => {
      if (msg.chat === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === msg.chat ? { ...chat, latestMessage: msg } : chat,
        ),
      );
    };

    const handleTyping = (data: {
      user_id: string;
      isTyping: boolean;
      chatId: string;
    }) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          const existingChat = prev.find((p) => p.chatId === data.chatId);
          if (!existingChat) {
            return [...prev, { chatId: data.chatId, users: [data.user_id] }];
          }
          if (!existingChat.users.includes(data.user_id)) {
            return prev.map((p) =>
              p.chatId === data.chatId
                ? { ...p, users: [...p.users, data.user_id] }
                : p,
            );
          }
          return prev;
        } else {
          return prev
            .map((p) =>
              p.chatId === data.chatId
                ? { ...p, users: p.users.filter((id) => id !== data.user_id) }
                : p,
            )
            .filter((p) => p.users.length > 0);
        }
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing", handleTyping);

    loadMessages();

    return () => {
      socket?.emit("leave_chat", chatId);
      socket?.off("new_message", handleNewMessage);
      socket?.off("typing", handleTyping);
    };
  }, [selectedChat?._id, socketConnected]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !socketConnected || !selectedChat) {
        console.warn("Cannot send message: socket not ready");
        return;
      }
      socket.emit("send_message", {
        chatId: selectedChat._id,
        message,
      });
    },
    [selectedChat, socketConnected],
  );

  const startTyping = useCallback(() => {
    if (!socket || !socketConnected || !selectedChat) return;
    socket.emit("typing", {
      chatId: selectedChat._id,
      isTyping: true,
    });
  }, [selectedChat, socketConnected]);

  const stopTyping = useCallback(() => {
    if (!socket || !socketConnected || !selectedChat) return;
    socket.emit("typing", {
      chatId: selectedChat._id,
      isTyping: false,
    });
  }, [selectedChat, socketConnected]);

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
        reconnectSocket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
