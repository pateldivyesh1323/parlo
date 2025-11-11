import { Namespace, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/authMiddleware";
import { predictNextText } from "../AI/predictor";
import { hasUserAccess } from "../controllers/chat";

export default function setUpAutoCompleteNamespace(namespace: Namespace) {
  namespace.use(socketAuthMiddleware);

  namespace.on("connection", async (socket: Socket) => {
    const userId = socket.data.user_id;
    const firebaseId = socket.data.firebaseId;

    console.log("🛺 [AUTOCOMPLETE] Client connected:", userId);

    socket.join(userId);

    socket.on("get_auto_complete", async (data: any) => {
      try {
        const { context, chatId } = data;
        const access = await hasUserAccess(firebaseId, chatId);
        if (!access) return;

        const text = await predictNextText({ chatId, partialText: context });
        namespace.to(userId).emit("predicted_text", text);
      } catch (error) {
        console.error("Error in auto complete:", error);
        socket.emit("error", "Failed to generate auto-complete");
      }
    });
  });
}
