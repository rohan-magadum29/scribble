"use client";
import { socket } from "../lib/socket";
import { SOCKET_EVENTS } from "@scribble/shared";
import { useEffect, useState } from "react";

const PlayerList = () => {
  const [currentPlayerCount, setCurrentPlayerCount] = useState<number>(0);
  useEffect(() => {
    const getPlayerCount = ({ userCount }: { userCount: number }) => {
      setCurrentPlayerCount(userCount);
    };
    socket.on(SOCKET_EVENTS.ROOM.JOINED, getPlayerCount);
    socket.on(SOCKET_EVENTS.ROOM.LEFT, getPlayerCount);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM.JOINED, getPlayerCount);

      socket.off(SOCKET_EVENTS.ROOM.LEFT, getPlayerCount);
    };
  }, []);
  return <span>{currentPlayerCount}</span>;
};

export default PlayerList;
