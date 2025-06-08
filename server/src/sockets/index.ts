import { Server } from "socket.io";
import setupChatNamespace from "./chat";

export default function setupSocketIO(io: Server) {
  const chatNamespace = io.of("/chat");
  setupChatNamespace(chatNamespace);
}
