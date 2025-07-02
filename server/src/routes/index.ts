import express from "express";
import environments from "../environments";
import cors from "cors";
import auth from "./auth";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import chat from "./chat";
import message from "./message";

export = (app: express.Application) => {
  // Middlewares
  app.use(
    cors({
      origin: environments.ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }),
  );
  app.use(express.json());

  // Routes

  app.get("/", (_req, res) => {
    console.log("GOTCHA");
    res.send({ message: "Parlo backend is live!" });
  });

  // Authentication routes
  app.use("/api/auth", auth);
  app.use("/api/chat", chat);
  app.use("/api/message", message);

  // Error handling middleware
  app.use(errorMiddleware);
};
