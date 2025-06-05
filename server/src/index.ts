import express from "express";
import environments from "./environments";
import routes from "./routes";
import connectDB from "./db/mongo";

const app = express();
const PORT = environments.PORT;

connectDB();
routes(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
