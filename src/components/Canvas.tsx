"use client";
import { useEffect, useRef } from "react";
import { useCanvas } from "../hooks/useCanvas";

export default function Canvas({ className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {loadStrokes} = useCanvas({ canvasRef });
useEffect(() => {
  const canvas = canvasRef.current;

  if (!canvas) return;

  let timeout : ReturnType<typeof setTimeout>;
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    clearTimeout(timeout);
     timeout = setTimeout(() => {
      loadStrokes();
    }, 150);
  };

  const observer = new ResizeObserver(resizeCanvas);

  observer.observe(canvas);
  resizeCanvas();

  return () => {observer.disconnect(); clearTimeout(timeout)};
}, []);
  return (
    <canvas
      ref={canvasRef}
      className={`bg-gray-200 rounded-lg cursor-crosshair touch-none  ${className}`}
    />
  );
}
