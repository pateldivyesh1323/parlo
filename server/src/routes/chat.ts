import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AppResponse, BadRequestError } from "../middlewares/errorMiddleware";
import { createChat, getAllChats } from "../controllers/chat";
import User from "../model/user";

const router = Router();

router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["firebase-id"];
    const { participantEmails, name, isGroupChat } = req.body;

    await createChat({
      userId: userId as string,
      participantEmails,
      name,
      isGroupChat,
    });

    AppResponse(res, 201, "Chat created successfully");
  } catch (error) {
    next(error);
  }
});

router.post("/create-chat-from-qr", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["firebase-id"];
    const { participantId: participantId } = req.body;

    const participant = await User.findById(participantId)
      .select("email")
      .lean();

    if (!participant) {
      throw new BadRequestError("Participant not found");
    }

    await createChat({
      userId: userId as string,
      participantEmails: [participant?.email as string],
      name: "",
      isGroupChat: false,
    });

    AppResponse(res, 201, "Chat created successfully");
  } catch (error) {
    next(error);
  }
});

router.get("/get-all", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["firebase-id"];
    const chats = await getAllChats(userId as string);
    AppResponse(res, 200, "Chats fetched successfully", chats);
  } catch (error) {
    next(error);
  }
});

export default router;
