import { SOCKET_EVENTS } from "@scribble/shared";
import { Server } from "socket.io";
import { roomService } from "../services/roomService.js";
import { strokeService } from "../services/strokeService.js";

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on(SOCKET_EVENTS.ROOM.CREATE, async ({ name }: { name: string }) => {
      try {
        const { room, user } = await roomService.createRoom(name);

        socket.join(room.id);

        socket.emit(SOCKET_EVENTS.ROOM.CREATED, {
          roomId: room.id,
          roomCode: room.code,
          userId: user.id,
          message: "Room Created Successfully",
          status: "success",
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

          await socket.join(room.id);

          const userCount = io.sockets.adapter.rooms.get(room.id)?.size ?? 0;
          // Send to everyone who was ALREADY in the room
          socket.to(room.id).emit(SOCKET_EVENTS.ROOM.JOINED, {
            roomId: room.id,
            roomCode: room.code,
            userId: user.id,
            userCount,
            message: `${user.name} Joined Room`,
            status: "success",
          });

          // Send confirmation specifically to the new player
          socket.emit(SOCKET_EVENTS.ROOM.JOINED, {
            roomId: room.id,
            roomCode: room.code,
            userId: user.id,
            userCount,
            message: `${user.name} Joined Room`,
            status: "success",
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
        console.log("Event Received", roomId, points);
        try {
          await strokeService.createStroke({
            color,
            points,
            roomId,
            width,
          });
          console.log("Stroke saved:", roomId);
        } catch (error) {
          console.log({ error });
        }
      },
    );
    console.log("Connected:", socket.id);

    socket.on("disconnect", (reason) => {
      const roomId = socket.data.roomId;

      console.log("Disconnected:", socket.id, roomId, reason);

      if (!roomId) return;

      const userCount = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;

      io.to(roomId).emit(SOCKET_EVENTS.ROOM.LEFT, {
        roomId,
        userCount,
      });
    });
  });
};
