import environments from "@/environments";
import { auth } from "@/lib/firebase";
import { io, type Socket } from "socket.io-client";

// Chat socket

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

// Auto-complete socket
let autoCompleteSocket: Socket | null = null;
let isAutocompleteConnecting = false;

export const getAutocompleteSocket = async () => {
  if (autoCompleteSocket && autoCompleteSocket.connected) {
    return autoCompleteSocket;
  }

  if (isAutocompleteConnecting) {
    while (isAutocompleteConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (autoCompleteSocket && autoCompleteSocket.connected) {
      return autoCompleteSocket;
    }
  }

  if (autoCompleteSocket) {
    autoCompleteSocket.removeAllListeners();
    autoCompleteSocket.disconnect();
    autoCompleteSocket = null;
  }

  try {
    isAutocompleteConnecting = true;

    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user found. User must be authenticated to connect to autocomplete socket.",
      );
    }

    const token = await user.getIdToken(true);
    if (!token) {
      throw new Error(
        "No token found. User must be authenticated to connect to autocomplete socket.",
      );
    }

    autoCompleteSocket = io(environments.server.origin + "/autocomplete", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    return autoCompleteSocket;
  } finally {
    isAutocompleteConnecting = false;
  }
};

export const disconnectAutocompleteSocket = (): void => {
  if (autoCompleteSocket) {
    autoCompleteSocket.removeAllListeners();
    autoCompleteSocket.disconnect();
    autoCompleteSocket = null;
  }
  isAutocompleteConnecting = false;
};

export {
  getChatSocket as chatSocket,
  getAutocompleteSocket as autoCompleteSocket,
};
