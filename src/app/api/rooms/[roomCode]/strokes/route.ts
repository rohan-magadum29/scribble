import { roomService } from "../../../../../../server/services/roomService";
import { strokeService } from "../../../../../../server/services/strokeService";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await params;
    const {room} = await roomService.findRoomByRoomCode(roomCode);
    if (!room) {
      return Response.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }

    const strokes = await strokeService.getStrokesByRoomId(room.id);

    return Response.json({data : strokes});
  } catch (error) {
    console.error("Failed to fetch strokes:", error);

    return Response.json(
      { message: "Failed to fetch strokes" },
      { status: 500 }
    );
  }
}