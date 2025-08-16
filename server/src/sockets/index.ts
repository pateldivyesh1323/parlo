import { Namespace, Server } from "socket.io";
import setupChatNamespace from "./chat";

let chatNamespace: Namespace;

export default function setupSocketIO(io: Server) {
  chatNamespace = io.of("/chat");
  setupChatNamespace(chatNamespace);
}

export { chatNamespace };
