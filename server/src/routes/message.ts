import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";
import { AppResponse } from "../middlewares/errorMiddleware";
import { getAllMessages } from "../controllers/message";

const router = express.Router();

router.get("/get-all", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];
    const chatId = req.query.chatId;

    const messages = await getAllMessages(userId as string, chatId as string);

    AppResponse(res, 200, "Messages fetched successfully", messages);
  } catch (error) {
    next(error);
  }
});

export default router;
