"use client";
import {
  drawLine,
  drawStroke,
  getMousePosition,
  normalizePoint,
} from "../lib/canvas";
import { socket } from "../lib/socket";
import { SOCKET_EVENTS, Stroke } from "@scribble/shared";
import type { DrawingConfig, Point } from "@scribble/shared";
import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { useUser } from "./useUser";
import type { Room } from "@scribble/shared";
import { httpClient } from "@/lib/httpClient";
interface UseCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}
export const useCanvas = ({ canvasRef }: UseCanvasProps) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point>({ x: 0, y: 0 });
  const socketPendingPoints = useRef<Point[]>([]);
  // const dbPendingPoints = useRef<Point[]>([]);
  const drawingConfig = useRef<DrawingConfig>({
    width: 5,
    color: "black",
  });
  const { getUserName } = useUser();
  async function loadStrokes() {
    try {
      const res = await httpClient < {data : Stroke []}>(
        `/api/rooms/${roomCode}/strokes`,
      );

      const strokes = res.data;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      strokes.forEach((stroke: any) => {
        drawStroke(
          stroke.points as Point[],
          stroke.color,
          stroke.width,
          ctx,
          canvas,
        );
      });
    } catch (error) {
      console.error("Failed to load strokes:", error);
    }
  }

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.lineWidth = drawingConfig.current.width;
    ctx.lineCap = "round";
    ctx.strokeStyle = drawingConfig.current.color;

    const startDrawing = (event: MouseEvent) => {
      isDrawing.current = true;
      lastPoint.current = getMousePosition(canvas, event);
    };
    const draw = (event: MouseEvent) => {
      if (!isDrawing.current) return;
      const currentPoint = getMousePosition(canvas, event);
      drawLine(
        lastPoint.current,
        currentPoint,
        drawingConfig.current.color,
        drawingConfig.current.width,
        ctx,
      );
      socketPendingPoints.current.push(normalizePoint(currentPoint, canvas));
      // dbPendingPoints.current.push(normalizePoint(currentPoint, canvas));
      lastPoint.current = currentPoint;
    };

    const stopDrawing = () => {
      isDrawing.current = false;
      if (!room?.id) {
        return;
      }
      if (socketPendingPoints.current.length) {
        socket.emit(SOCKET_EVENTS.DRAW.DRAW, {
          roomId: room.id,
          roomCode,
          points: socketPendingPoints.current,
          color: drawingConfig.current.color,
          width: drawingConfig.current.width,
        });
        socketPendingPoints.current = [];
      }

      // if (dbPendingPoints.current.length) {
      //   socket.emit(SOCKET_EVENTS.DRAW.STROKE_COMPLETE, {
      //     roomId: room.id,
      //     roomCode,
      //     points: dbPendingPoints.current,
      //     color: drawingConfig.current.color,
      //     width: drawingConfig.current.width,
      //   });
      //   dbPendingPoints.current = [];
      // }
    };

    canvas.addEventListener("pointerdown", startDrawing);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointerleave", stopDrawing);
    socket.on(SOCKET_EVENTS.DRAW.DRAW, ({ points, color, width }) => {
      drawStroke(points, color, width, ctx, canvas);
    });
    return () => {
      canvas.removeEventListener("pointerdown", startDrawing);
      canvas.removeEventListener("pointermove", draw);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointerleave", stopDrawing);
      socket.off(SOCKET_EVENTS.DRAW.DRAW);
    };
  }, [canvasRef, room?.id, roomCode]);

  useEffect(() => {
    const id = setInterval(() => {
      if (socketPendingPoints.current.length === 0 || !room?.id) return;

      socket.emit(SOCKET_EVENTS.DRAW.DRAW, {
        roomId: room.id,
        roomCode,
        points: socketPendingPoints.current,
        color: drawingConfig.current.color,
        width: drawingConfig.current.width,
      });
      const lastPoint = socketPendingPoints.current.at(-1);
      if (lastPoint) {
        socketPendingPoints.current = [lastPoint];
      } else {
        socketPendingPoints.current = [];
      }
    }, 100);

    return () => clearInterval(id);
  }, [room?.id, roomCode]);

  useEffect(() => {
    async function loadRoom() {
      const res = await httpClient <{data : Room}>(
        `/api/rooms/${roomCode}`,
      );
      setRoom(res?.data);
    }

    loadRoom();
  }, [roomCode]);
  useEffect(() => {
    const name = getUserName();
    if (!roomCode || !name) return;

    const handleConnect = () => {
      socket.emit(SOCKET_EVENTS.ROOM.JOIN, {
        name,
        roomCode,
      });
    };

    socket.on("connect", handleConnect);
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [roomCode]);
  return {
    loadStrokes,
  };
};
