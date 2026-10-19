"use client";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import Canvas from "../../../components/Canvas";
import { handleCopy } from "../../../lib/helper";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/shared/socket-events";
import Toast, { status } from "@/components/Toast";
import PlayerList from "@/components/PlayerList";
export default function Room() {
  const { roomCode } = useParams<{ roomCode: string }>();
  useEffect(() => {
    const handleRoomJoinedByOtherPlayer = ({
      message,
      status,
    }: {
      message: string;
      status: status;
    }) => {
      console.log({
        message,
        status,
      });
      Toast(message, status);
    };
    socket.on(SOCKET_EVENTS.ROOM.JOINED, handleRoomJoinedByOtherPlayer);
    return () => {
      socket.off(SOCKET_EVENTS.ROOM.JOINED, handleRoomJoinedByOtherPlayer);
    };
  }, []);

  return (
    <>
      {/* <PlayerList /> */}
      <div className="bg-black h-screen w-screen flex flex-col gap-4 items-center justify-start mt-12  overflow-hidden">
        <button
          className={
            "flex gap-1 items-center font-semibold  md:font-semibold  text-white text-md md:text-xl border p-1.5 md:p-2 rounded-md cursor-pointer"
          }
          onClick={() => {
            handleCopy(roomCode);
          }}
        >
          {roomCode}
          <HugeiconsIcon
            className={"size-4 md:size-6"}
            icon={Copy01Icon}
            strokeWidth={2.5}
          />
        </button>
        <Canvas className={"w-[80%] md:w-[40%] aspect-20/14"} />
      </div>
    </>
  );
}
