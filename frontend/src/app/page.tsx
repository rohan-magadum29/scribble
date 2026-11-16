"use client";
import { socket } from "../lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextInput from "../components/Input";
import { useUser } from "../hooks/useUser";
import { SOCKET_EVENTS } from "@scribble/shared";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserName, setUserId } = useUser();
  const router = useRouter();

  const joinRoom = () => {
    setIsLoading(true);

    const join = () => {
      if (!roomCode) {
        socket.emit(SOCKET_EVENTS.ROOM.CREATE, { name });
      } else {
        socket.emit(SOCKET_EVENTS.ROOM.JOIN, { name, roomCode });
      }
      setUserName(name);
    };

    if (socket.connected) {
      join();
    } else {
      socket.once("connect", join);
      socket.connect();
    }
  };

  useEffect(() => {
    const handleRoomEntered = ({
      roomCode,
      userId,
    }: {
      roomCode: string;
      userId: string;
    }) => {
      setUserId(userId);
      router.push(`/room/${roomCode}`);
    };

    const handleConnectError = () => {
      setIsLoading(false);
    };

    socket.on(SOCKET_EVENTS.ROOM.CREATED, handleRoomEntered);
    socket.on(SOCKET_EVENTS.ROOM.JOINED, handleRoomEntered);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM.CREATED, handleRoomEntered);
      socket.off(SOCKET_EVENTS.ROOM.JOINED, handleRoomEntered);
      socket.off("connect_error", handleConnectError);
    };
  }, [router, setUserId]);

  return (
    <div className="text-center flex justify-center items-center my-auto flex-col gap-2">
      <span className="text-5xl text-white font-bold">Scribble</span>
      <TextInput
        name={"name"}
        label={"Name"}
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
      <TextInput
        name={"code"}
        label={"Room Code"}
        value={roomCode}
        capitalize
        maxLength={6}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRoomCode(e.target.value)
        }
      />
      <button
        disabled={isLoading || !name || (roomCode.length < 6 && !!roomCode)}
        className="mt-2 flex items-center gap-2 bg-purple-700 rounded-lg py-2 px-4 cursor-pointer disabled:bg-purple-950 disabled:cursor-not-allowed"
        onClick={joinRoom}
      >
        {isLoading && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
        )}
        {isLoading
          ? roomCode
            ? "Joining..."
            : "Creating..."
          : roomCode
            ? "Join Room"
            : "Create Room"}
      </button>
    </div>
  );
}
