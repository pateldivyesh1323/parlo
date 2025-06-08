import { Router } from "express";
import { getUserByFirebaseId, register } from "../controllers/auth";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AppResponse } from "../middlewares/errorMiddleware";

const router = Router();

router.post("/register", authMiddleware, async (req, res, next) => {
  try {
    const firebaseId = req.headers["firebase-id"];
    const user = await register({ firebaseId: firebaseId as string });
    AppResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    next(error);
  }
});

router.get("/get-user", authMiddleware, async (req, res, next) => {
  try {
    const firebaseId = req.headers["firebase-id"];
    const user = await getUserByFirebaseId({
      firebaseId: firebaseId as string,
    });
    AppResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
});

export default router;
