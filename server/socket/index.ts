import { error } from "console";
import { createServer } from "http";
import { Server } from "socket.io";
import { roomService } from "../services/roomService";
import { strokeService } from "../services/strokeService";
import { SOCKET_EVENTS } from "./../../src/shared/socket-events";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
io.on("connection", (socket) => {
  socket.on(SOCKET_EVENTS.ROOM.CREATE, async ({ name }: { name: string }) => {
    try {
      const { room, user } = await roomService.createRoom(name);

      socket.join(room.id);
      socket.emit(SOCKET_EVENTS.ROOM.CREATED, {
        roomId: room.id,
        roomCode: room.code,
        userId: user.id,
      });
      console.log(`Room (${room.id}/${room.code}) Joined by ${socket.id}`);
    } catch (error) {
      console.log({ error });
      socket.emit(SOCKET_EVENTS.ROOM.ERROR, {
        message: "Failed to create room",
      });
    }
  });
  socket.on(
    SOCKET_EVENTS.ROOM.JOIN,
    async ({ name, roomCode }: { name: string; roomCode: string }) => {
      try {
        const { room, user } = await roomService.joinRoom(name, roomCode);
        socket.join(room.id);
        socket.emit(SOCKET_EVENTS.ROOM.JOINED, {
          roomId: room.id,
          roomCode: room.code,
          userId: user.id,
        });
        console.log(`Room (${room.id}/${room.code}) Joined by ${socket.id}`);
      } catch (error) {
        console.log({ error });
        socket.emit(SOCKET_EVENTS.ROOM.ERROR, {
          message: "Failed to Join room",
        });
      }
    },
  );
  socket.on(SOCKET_EVENTS.DRAW.DRAW, async (data) => {
    try {
      console.log("Broadcasting to room:", data.roomId);
      socket.to(data.roomId).emit(SOCKET_EVENTS.DRAW.DRAW, data);
    } catch (error) {
      console.log({ error });
    }
  });
  socket.on(
    SOCKET_EVENTS.DRAW.STROKE_COMPLETE,
    async ({ roomId, points, color, width }) => {
      console.log('Event Received',roomId,points)
      try {
        await strokeService.createStroke({
          color,
          points,
          roomId,
          width,
        });
        console.log("Stroke saved:", roomId);
      } catch {
        console.log({ error });
      }
    },
  );
  console.log("Connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});
httpServer.listen(process.env.SOCKET_PORT, Number("0.0.0.0"), async () => {
  console.log(`Server Started on port ${process.env.SOCKET_PORT}`);
});
