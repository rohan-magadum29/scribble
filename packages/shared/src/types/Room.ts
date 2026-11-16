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
