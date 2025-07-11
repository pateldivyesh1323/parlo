import { NextFunction, Request, Response } from "express";
import { admin } from "../lib/firebaseAdmin";
import { Socket } from "socket.io";
import User from "../model/user";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token" });
      return;
    }

    const idToken = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({ firebaseId: decodedToken.uid })
      .select("_id")
      .lean();

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    req.headers["firebase-id"] = decodedToken.uid;
    req.headers["authorized"] = "true";
    req.headers["user-id"] = user._id.toString();

    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      userId: user._id.toString(),
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const idToken = socket.handshake.auth?.token;

    if (!idToken || typeof idToken !== "string") {
      return next(new Error("Unauthorized: Missing token"));
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken?.uid) {
      return next(new Error("Unauthorized: Invalid token payload"));
    }

    const user = await User.findOne({ firebaseId: decodedToken.uid })
      .select("_id")
      .lean();

    if (!user) {
      return next(new Error("Unauthorized: User not found"));
    }

    socket.data.firebaseId = decodedToken.uid;
    socket.data.authorized = "true";
    socket.data.user_id = user._id.toString();

    socket.data.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      userId: user._id.toString(),
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    next(new Error("Unauthorized: Invalid token"));
  }
};

export { authMiddleware, socketAuthMiddleware };
