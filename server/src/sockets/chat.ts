import { Namespace, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/authMiddleware";
import { getAllChatIds, hasUserAccess } from "../controllers/chat";
import { createMessage } from "../controllers/message";

export default function setupChatNamespace(namespace: Namespace) {
  namespace.use(socketAuthMiddleware);

  namespace.on("connection", async (socket: Socket) => {
    const firebaseId = socket.data.firebaseId;
    console.log("🔌 [CHAT] Client connected:", firebaseId);

    const userChats = await getAllChatIds(firebaseId);

    userChats.forEach((chatId) => {
      socket.join(chatId.toString());
    });

    socket.on("join_chat", async (chatId: string) => {
      try {
        const hasAccess = await hasUserAccess(firebaseId, chatId);
        if (!hasAccess) {
          socket.emit("error", "You do not have access to this chat");
          return;
        }
        socket.join(chatId);
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", "Failed to join chat");
      }
    });

    socket.on("leave_chat", (chatId: string) => {
      socket.leave(chatId);
    });

    socket.on("send_message", async (data: any) => {
      try {
        const { chatId, message } = data;
        const hasAccess = await hasUserAccess(firebaseId, chatId);
        if (!hasAccess) {
          socket.emit("error", "You do not have access to this chat");
          return;
        }

        const newMessage = await createMessage(chatId, message, firebaseId);

        namespace.to(chatId).emit("new_message", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("typing", async (data: any) => {
      try {
        const { chatId, isTyping } = data;
        const hasAccess = await hasUserAccess(firebaseId, chatId);
        if (!hasAccess) {
          socket.emit("error", "You do not have access to this chat");
          return;
        }
        socket.to(chatId).emit("typing", {
          user_id: socket.data.user_id,
          isTyping: !!isTyping,
          chatId,
        });
      } catch (error) {
        console.error("Error handling typing event:", error);
        socket.emit("error", "Failed to handle typing event");
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ [CHAT] Client disconnected:", firebaseId);
    });
  });
}
