import express, { Request, Response, NextFunction } from "express";
import environments from "../environments";
import cors from "cors";
import auth from "./auth";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import chat from "./chat";
import message from "./message";

const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration.toFixed(
        2,
      )} ms`,
    );
  });

  next();
};

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
  app.use(express.urlencoded({ extended: true }));
  app.use(apiLogger);

  // Routes

  app.get("/", (_req, res) => {
    res.send({ message: "Parlo backend is live!" });
  });

  // Authentication routes
  app.use("/api/auth", auth);
  app.use("/api/chat", chat);
  app.use("/api/message", message);

  // Error handling middleware
  app.use(errorMiddleware);
};
