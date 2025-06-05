import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { AppResponse } from "../middlewares/errorMiddleware";
import { createChat } from "../controllers/chat";

const router = Router();

router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["firebase-id"];
    const { userEmails, name, isGroupChat } = req.body;

    await createChat({
      userId: userId as string,
      userEmails,
      name,
      isGroupChat,
    });

    AppResponse(res, 201, "Chat created successfully");
  } catch (error) {
    next(error);
  }
});

export default router;
