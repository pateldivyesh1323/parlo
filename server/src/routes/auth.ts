import { Router } from "express";
import { register } from "../controllers/auth";
import authMiddleware from "../middlewares/authMiddleware";
import { AppResponse } from "../middlewares/errorMiddleware";

const router = Router();

router.post("/register", authMiddleware, async (req, res, next) => {
  try {
    const firebaseId = req.headers["firebase-id"];
    await register({ firebaseId: firebaseId as string });
    AppResponse(res, 201, "User registered successfully");
  } catch (error) {
    next(error);
  }
});

export default router;
