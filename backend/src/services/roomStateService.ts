
import type { RoomState } from '@scribble/shared';
import type { Player } from '@scribble/shared';
class RoomStateService {
  private rooms = new Map<string, RoomState>();

  createRoom(roomCode: string, hostId: string) {
    const room: RoomState = {
      roomCode,
      hostId,
      status: "WAITING",
      players: new Map()
    };

    this.rooms.set(roomCode, room);

    return room;
  }

  getRoom(roomCode: string) {
    return this.rooms.get(roomCode);
  }

  addPlayer(roomCode: string, player: Player) {
    const room = this.rooms.get(roomCode);

    if (!room) throw new Error("Room not initialized");

    room.players.set(player.userId, player);
  }

  getPlayers(roomCode: string) {
    const room = this.getRoom(roomCode);

    if (!room) throw new Error("Room not initialized");

    return Array.from(room.players.values())
      .filter(player => player.isConnected);
  }

  getPlayerCount(roomCode: string) {
    return this.getPlayers(roomCode).length;
  }

  removePlayer(roomCode: string, userId: string) {
    const room = this.rooms.get(roomCode);

    room?.players.delete(userId);
  }

  updateStatus(
    roomCode: string,
    status: RoomState["status"]
  ) {
    const room = this.rooms.get(roomCode);

    if (!room) throw new Error("Room not initialized");

    room.status = status;
  }
}

export const roomStateService = new RoomStateService();