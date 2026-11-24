import type { Stroke } from "./Stroke.js";
import type { User } from "./User.js";

export interface Room {
  id: string;
  code: string;
  ownerId: string;
  owner: User;
  createdAt: Date;
  strokes: Stroke[];
}


export interface Player {
  userId: string;
  username: string;
  socketId: string;
  isHost: boolean;
  score: number;
  isConnected: boolean;
}

export interface RoomState {
  roomCode: string;
  hostId: string;
  status: "WAITING" | "PLAYING" | "FINISHED";
  players: Map<string, Player>;
}