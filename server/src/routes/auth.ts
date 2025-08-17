import { Router } from "express";
import {
  getUserByFirebaseId,
  getUserPreferences,
  register,
  updatePersonalInfo,
  updatePreferences,
} from "../controllers/auth";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AppResponse } from "../middlewares/errorMiddleware";
import { admin } from "../lib/firebaseAdmin";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      AppResponse(res, 401, "Unauthorized: No token");
      return;
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await register({ firebaseId: decodedToken.uid });
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

router.get("/get-user-preferences", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];
    const userPreferences = await getUserPreferences({
      userId: userId as string,
    });
    AppResponse(
      res,
      200,
      "User preferences fetched successfully",
      userPreferences,
    );
  } catch (error) {
    next(error);
  }
});

router.post("/update-personal-info", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];
    const data = req.body;
    const user = await updatePersonalInfo({ userId: userId as string, data });
    AppResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
});

router.post("/update-preferences", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];
    const data = req.body;
    const userSettings = await updatePreferences({
      userId: userId as string,
      data,
    });
    AppResponse(
      res,
      200,
      "User preferences updated successfully",
      userSettings,
    );
  } catch (error) {
    next(error);
  }
});

export default router;
