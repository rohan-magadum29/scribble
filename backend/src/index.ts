import { createServer } from "http";
import { Server } from "socket.io";

import app from "./express.js";
import { initializeSocket } from "./socket/index.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Initialize socket events
initializeSocket(io);

const PORT = Number(process.env.PORT) || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Started on port ${PORT}`);
});

httpServer.on("error", (err) => {
  console.error("HTTP SERVER ERROR:", err);
});
