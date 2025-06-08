import { NextFunction, Request, Response } from "express";
import admin from "../lib/firebaseAdmin";
import { Socket } from "socket.io";

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

    req.headers["firebase-id"] = decodedToken.uid;
    req.headers["authorized"] = "true";

    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
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

    socket.data.firebaseId = decodedToken.uid;
    socket.data.authorized = "true";

    socket.data.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    next(new Error("Unauthorized: Invalid token"));
  }
};

export { authMiddleware, socketAuthMiddleware };
