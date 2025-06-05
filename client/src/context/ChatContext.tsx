import { apiClient } from "@/lib/apiClient";
import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";

interface ChatContextType {
  isCreatingChat: boolean;
  createChat: (userEmails: string[], name?: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  isCreatingChat: false,
  createChat: () => Promise.resolve(),
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const createChat = async (userEmails: string[], name?: string) => {
    try {
      setIsCreatingChat(true);
      const isGroupChat = !!name;
      const chatData = {
        name: name,
        isGroupChat,
        userEmails,
      };

      const response = await apiClient.post("/api/chat/create", chatData);
      if (response) {
        toast.success("Chat created successfully");
      } else {
        toast.error("Failed to create chat");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isCreatingChat,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
