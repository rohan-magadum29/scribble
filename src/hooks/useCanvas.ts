"use client";
import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/shared/socket-events";
import { DrawingConfig, Point, Stroke, UseCanvasProps } from "@/types/drawing";
import { Room } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useCanvas = ({ canvasRef }: UseCanvasProps) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [roomRef, setRoomRef] = useState<Room | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point>({ x: 0, y: 0 });
  const pendingPoints = useRef<Stroke[]>([
    {
      points: [],
      color: "",
      width: 0,
    },
  ]);
  const drawingConfig = useRef<DrawingConfig>({
    width: 5,
    color: "black",
  });
  const getMousePosition = (
    canvas: HTMLCanvasElement,
    event: MouseEvent,
  ): Point => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };
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

    const drawLine = (from: Point, to: Point, color: string, width: number) => {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    };
    const draw = (event: MouseEvent) => {
      if (!isDrawing.current) return;

      const currentPoint = getMousePosition(canvas, event);

      drawLine(
        lastPoint.current,
        currentPoint,
        drawingConfig.current.color,
        drawingConfig.current.width,
      );
      pendingPoints.current.push({
        points: [lastPoint.current, currentPoint],
        color: drawingConfig.current.color,
        width: drawingConfig.current.width,
      });
      lastPoint.current = currentPoint;
    };

    const stopDrawing = () => {
      isDrawing.current = false;
      if (!roomRef?.id) {
        return;
      }
      socket.emit(SOCKET_EVENTS.DRAW.DRAW, {
        roomId: roomRef.id,
        roomCode,
        points: pendingPoints.current,
        color: drawingConfig.current.color,
        width: drawingConfig.current.width,
      });
      pendingPoints.current = [];
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    socket.on(SOCKET_EVENTS.DRAW.DRAW, ({ points, color, width }) => {
      if (Array.isArray(points) && points.length) {
        points.forEach((pointObj) => {
          drawLine(pointObj?.points?.[0], pointObj?.points?.[1], color, width);
        });
      }
    });
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      socket.off(SOCKET_EVENTS.DRAW.DRAW,);
    };
  }, [canvasRef, roomRef?.id, roomCode]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pendingPoints.current.length === 0 || !roomRef?.id) return;

      socket.emit(SOCKET_EVENTS.DRAW.DRAW, {
        roomId: roomRef.id,
        roomCode,
        points: pendingPoints.current,
        color: drawingConfig.current.color,
        width: drawingConfig.current.width,
      });
      pendingPoints.current = [];
    }, 33);

    return () => clearInterval(id);
  }, [roomRef?.id, roomCode]);

  useEffect(() => {
    async function loadRoom() {
      const res = await fetch(`/api/rooms/${roomCode}`);
      const jsonData = await res.json();
      setRoomRef(jsonData?.data);
    }

    loadRoom();
  }, [roomCode]);
  return {};
};
