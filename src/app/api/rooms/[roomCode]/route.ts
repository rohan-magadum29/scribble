import { roomService } from "../../../../../server/services/roomService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomCode: string }> },
) {
  try {
    const { roomCode } = await params;
    const { room } = await roomService.findRoomByRoomCode(roomCode);

    return Response.json({
      data: room,
      message: "Room Fectched SuccessFully",
      status: 200,
    });
  } catch (err) {
    console.log({ err });
    return Response.json(
      {
        message: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 404 },
    );
  }
}
