import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import environments from "../environments";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const apiClient = axios.create({
  baseURL: environments.server.origin,
});

let authToken: string | undefined;

export const setToken = (token: string) => {
  authToken = token;
};

export const getToken = () => {
  return authToken;
};

export const clearToken = () => {
  authToken = undefined;
};

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
