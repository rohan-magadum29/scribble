import { createServer } from "http";
import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./../../src/shared/socket-events";
import { roomService } from "../services/roomService";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
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
      const sockets = await io.in(data.roomId).fetchSockets();
      console.log("Broadcasting to room:", data.roomId);
    console.log(
      "Clients:",
      sockets.map((s) => s.id),
    );
      socket.to(data.roomId).emit(SOCKET_EVENTS.DRAW.DRAW, data);
    } catch (error) {
      console.log({ error });
    }
  });
  console.log("Connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

httpServer.listen(3001, async () => {
  console.log("Server Started on port 3001");
});