import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { queryClient } from "@/lib/apiClient";
import { QUERY_KEYS } from "@/constants";
import { useChat } from "@/context/ChatContext";

export const useCreateChat = () => {
  const { refetchChats } = useChat();
  return useMutation({
    mutationFn: async ({
      participantEmails,
      name,
    }: {
      participantEmails: string[];
      name?: string;
    }) => {
      const isGroupChat = !!name;
      const res = await apiClient.post("/api/chat/create", {
        name,
        isGroupChat,
        participantEmails,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS] });
      refetchChats();
      toast.success("Chat created successfully");
    },
    onError: () => {
      toast.error("Failed to create chat");
    },
  });
};

export const useGetAllChats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHATS],
    queryFn: async () => {
      const res = await apiClient.get("/api/chat/get-all");
      return res.data.data as Chat[];
    },
  });
};

export const useCreateChatFromQR = () => {
  const { refetchChats } = useChat();
  return useMutation({
    mutationFn: async ({ participantId }: { participantId: string }) => {
      const res = await apiClient.post("/api/chat/create-chat-from-qr", {
        participantId,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS] });
      refetchChats();
      toast.success("Chat created successfully");
    },
    onError: () => {
      toast.error("Failed to create chat");
    },
  });
};
