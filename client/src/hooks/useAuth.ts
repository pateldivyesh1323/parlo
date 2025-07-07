import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { queryClient } from "@/lib/apiClient";
import { QUERY_KEYS } from "@/constants";

export const useGetUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.GET_USER],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: User }>(
        "/api/auth/get-user",
      );
      return data.data;
    },
    enabled,
  });
};

export const useGetUserPreferences = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.GET_USER_PREFERENCES],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: UserSettings }>(
        "/api/auth/get-user-preferences",
      );
      return data.data;
    },
  });
};

export const useUpdatePersonalInfo = () => {
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await apiClient.post("/api/auth/update-personal-info", {
        name,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Personal info updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.GET_USER],
      });
    },
    onError: () => {
      toast.error("Failed to update personal info");
    },
  });
};

export const useUpdatePreferences = () => {
  return useMutation({
    mutationFn: async ({
      translationLanguage,
    }: {
      translationLanguage: string;
    }) => {
      const res = await apiClient.post("/api/auth/update-preferences", {
        translationLanguage,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.GET_USER_PREFERENCES],
      });
    },
    onError: () => {
      toast.error("Failed to update preferences");
    },
  });
};
