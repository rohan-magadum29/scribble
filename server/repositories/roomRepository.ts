import { prisma } from "@/lib/prisma";

export class RoomRepository {
  async createRoom(code: string, ownerId: string) {
    return prisma.room.create({
      data: {
        code,
        ownerId,
      },
    });
  }
  async findRoomByRoomCode(roomCode: string) {
    return prisma.room.findUnique({
      where: {
        code: roomCode,
      },
    });
  }
}

export const roomRepository = new RoomRepository();
