"use client";
import {
  drawLine,
  drawStroke,
  getMousePosition,
  normalizePoint,
} from "@/lib/canvas";
import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/shared/socket-events";
import { DrawingConfig, Point, UseCanvasProps } from "@/types/drawing";
import { Room } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useCanvas = ({ canvasRef }: UseCanvasProps) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point>({ x: 0, y: 0 });
  const socketPendingPoints = useRef<Point[]>([]);
  const dbPendingPoints = useRef<Point[]>([]);
  const drawingConfig = useRef<DrawingConfig>({
    width: 5,
    color: "black",
  });
   async function loadStrokes() {
    try {
      const res = await fetch(`/api/rooms/${roomCode}/strokes`);

      if (!res.ok) {
        throw new Error("Failed to load strokes");
      }

      const jsonData = await res.json();
      const strokes = jsonData.data;

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
      socketPendingPoints.current.push(
        normalizePoint(currentPoint, canvas),
      );
      dbPendingPoints.current.push(
        normalizePoint(currentPoint, canvas),
      );
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

      if (dbPendingPoints.current.length) {
        socket.emit(SOCKET_EVENTS.DRAW.STROKE_COMPLETE, {
          roomId: room.id,
          roomCode,
          points: dbPendingPoints.current,
          color: drawingConfig.current.color,
          width: drawingConfig.current.width,
        });
        dbPendingPoints.current = [];
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    socket.on(SOCKET_EVENTS.DRAW.DRAW, ({ points, color, width }) => {
      drawStroke(points, color, width, ctx, canvas);
    });
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
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
      const lastPoint = socketPendingPoints.current.at(-1)
      if(lastPoint)
      {

        socketPendingPoints.current = [lastPoint];
      }
      else {
        socketPendingPoints.current = []
      }
    }, 33);

    return () => clearInterval(id);
  }, [room?.id, roomCode]);

  useEffect(() => {
    async function loadRoom() {
      const res = await fetch(`/api/rooms/${roomCode}`);
      const jsonData = await res.json();
      setRoom(jsonData?.data);
    }

    loadRoom();
  }, [roomCode]);
  useEffect(() => {
    if (!roomCode) return;

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
  }, [roomCode, name]);
  return {
    loadStrokes
  };
};
