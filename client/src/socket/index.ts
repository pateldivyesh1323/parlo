import environments from "@/environments";
import { auth } from "@/lib/firebase";
import { io, type Socket } from "socket.io-client";

let chatSocket: Socket | null = null;
let isConnecting = false;

export const getChatSocket = async (): Promise<Socket> => {
  if (chatSocket && chatSocket.connected) {
    return chatSocket;
  }

  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (chatSocket && chatSocket.connected) {
      return chatSocket;
    }
  }

  if (chatSocket) {
    chatSocket.removeAllListeners();
    chatSocket.disconnect();
    chatSocket = null;
  }

  try {
    isConnecting = true;

    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user found. User must be authenticated to connect to chat.",
      );
    }

    const token = await user.getIdToken(true);
    if (!token) {
      throw new Error(
        "No token found. User must be authenticated to connect to chat.",
      );
    }

    chatSocket = io(environments.server.origin + "/chat", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    return chatSocket;
  } finally {
    isConnecting = false;
  }
};

export const disconnectChatSocket = (): void => {
  if (chatSocket) {
    chatSocket.removeAllListeners();
    chatSocket.disconnect();
    chatSocket = null;
  }
  isConnecting = false;
};

export const reconnectChatSocket = async (): Promise<Socket> => {
  disconnectChatSocket();
  return await getChatSocket();
};

export { getChatSocket as chatSocket };
