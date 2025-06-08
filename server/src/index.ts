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

connectDB();

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
