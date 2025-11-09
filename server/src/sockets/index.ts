import { Namespace, Server } from "socket.io";
import setupChatNamespace from "./chat";
import setUpAutoCompleteNamespace from "./autocomplete";

let chatNamespace: Namespace;
let autoCompleteNamespace: Namespace;

export default function setupSocketIO(io: Server) {
  chatNamespace = io.of("/chat");
  setupChatNamespace(chatNamespace);
  autoCompleteNamespace = io.of("/autocomplete");
  setUpAutoCompleteNamespace(autoCompleteNamespace);
}

export { chatNamespace };
