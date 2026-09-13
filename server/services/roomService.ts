import { nanoid } from "nanoid";
import { roomRepository } from "../repositories/roomRepository";
import { userRepository } from "../repositories/userRepository";

export class RoomService {
  async createRoom(userName: string) {
    

    let user = await userRepository.findUserByName(userName)
    if(!user)
    {
       user = await userRepository.createUser(userName);
    }
    console.log({user})
// 1. Generate room code
    const roomCode = nanoid(6).toUpperCase();
    const room = await roomRepository.createRoom(roomCode, user.id);
    // 4. Return everything
    return {
      room,
      user,
    };
  }
  async joinRoom(userName: string, roomCode: string) {
    let user = await userRepository.findUserByName(userName);
    if (!user) {
      user = await userRepository.createUser(userName);
    }
    const room = await roomRepository.findRoomByRoomCode(roomCode);
    if (!room) {
      throw new Error("Room Not Found");
    }
    // 4. Return everything
    return {
      room,
      user,
    };
  }
  async findRoomByRoomCode(roomCode: string) {
    const room = await roomRepository.findRoomByRoomCode(roomCode);
    return {
      room,
    };
  }
}

export const roomService = new RoomService();
