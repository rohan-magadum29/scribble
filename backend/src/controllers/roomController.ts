import type { NextFunction, Request, Response } from "express";
import { roomService } from "../services/roomService.js";

interface RoomParams {
  roomCode: string;
}
export const getRoom = async (
  req: Request<RoomParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomCode } = req.params;
    const { room } = await roomService.findRoomByRoomCode(roomCode);

    return res.json({
      data: room,
      message: "Room Fectched SuccessFully",
      status: true,
    });
  } catch (err) {
    next(err);
    return res.json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};
