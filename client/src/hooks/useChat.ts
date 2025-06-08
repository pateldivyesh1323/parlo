import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { queryClient } from "@/lib/apiClient";
import { QUERY_KEYS } from "@/constants";

export const useCreateChat = () => {
  return useMutation({
    mutationFn: async ({
      userEmails,
      name,
    }: {
      userEmails: string[];
      name?: string;
    }) => {
      const isGroupChat = !!name;
      const chatData = { name, isGroupChat, userEmails };
      const res = await apiClient.post("/api/chat/create", chatData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Chat created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS] });
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
