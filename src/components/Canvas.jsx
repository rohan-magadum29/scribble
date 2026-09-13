"use client";
import { useRef } from "react";
import { useCanvas } from "./../hooks/useCanvas";

export default function Canvas({ className = "" }) {
  const canvasRef = useRef(null);
  const {} = useCanvas({ canvasRef });

  return (
    <canvas
      ref={canvasRef}
      height={500}
      width={500}
      className={`bg-gray-200 rounded-lg cursor-pointer ${className}`}
    />
  );
}
