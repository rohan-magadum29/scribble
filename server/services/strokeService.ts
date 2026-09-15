import type { Point } from "@/types/drawing";
import { strokeRepository } from "../repositories/strokeRepository";
import { prisma } from "@/lib/prisma";

class StrokeService {
  async createStroke({
    roomId,
    points,
    color,
    width,
  }: {
    roomId: string;
    points: Point[];
    color: string;
    width: number;
  }) {
    return strokeRepository.createStroke({
      roomId,
      points,
      color,
      width,
    });
  }
   async getStrokesByRoomId(roomId: string) {
    return strokeRepository.getStrokesByRoomId(roomId)
  }
}

export const strokeService = new StrokeService();