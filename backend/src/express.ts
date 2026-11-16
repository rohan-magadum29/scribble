import cors from "cors";
import express from "express";
import roomRoutes from "./routes/roomRoute.js";
import strokeRoutes from "./routes/strokeRoute.js";
import { errorMiddleware } from "./middlewares/error.js";
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api/rooms", strokeRoutes);

app.get("/", (_req, res) => {
  res.status(200).send("Scribble server is running");
});

app.use(errorMiddleware);

export default app;
