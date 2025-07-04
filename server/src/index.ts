import express from "express";
import environments from "./environments";
import routes from "./routes";
import connectDB from "./db/mongo";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSocketIO from "./sockets";

const app = express();
const httpServer = createServer(app);
const PORT = environments.PORT;

const startServer = async () => {
  try {
    await connectDB();

    const io = new Server(httpServer, {
      cors: {
        origin: environments.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    setupSocketIO(io);

    routes(app);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
