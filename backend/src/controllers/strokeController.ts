import type { NextFunction, Request, Response } from "express";
import { roomService } from "../services/roomService.js";
import { strokeService } from "../services/strokeService.js";

interface RoomParams {
  roomCode: string;
}
export const getStrokes = async (
  req: Request<RoomParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomCode } = req.params;
    const { room } = await roomService.findRoomByRoomCode(roomCode);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const strokes = await strokeService.getStrokesByRoomId(room.id);
    console.log({ strokes });
    return res.json({ data: strokes });
  } catch (error) {
    next(error);
    console.error("Failed to fetch strokes:", error);
    return res.status(500).json({ message: "Failed to fetch strokes" });
  }
};
