import { prisma } from "@/lib/prisma";
import { Point } from "@/types/drawing";
import { Prisma } from "@prisma/client";

class StrokeRepository {
  async createStroke({
    roomId,
    points,
    color,
    width,
  }: {
    roomId: string;
    points:Point[];
    color: string;
    width: number;
  }) {
    return prisma.stroke.create({
      data: {
        color,
        width,
        roomId,
        points  : points as unknown as Prisma.InputJsonValue,
      },
    });
  }
  async getStrokesByRoomId(roomId: string) {
  return prisma.stroke.findMany({
    where: {
      roomId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
}

export const strokeRepository = new StrokeRepository();