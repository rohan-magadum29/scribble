import { Point } from "@/types/drawing";
import Canvas from './../components/Canvas';

export const getMousePosition = (
  canvas: HTMLCanvasElement,
  event: MouseEvent,
): Point => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};
export const normalizePoint = (
  point: Point,
  canvas: HTMLCanvasElement
): Point => {
  return {
    x: point.x / canvas.width,
    y: point.y / canvas.height,
  };
};
export const denormalizePoint = (
  point: Point,
  canvas: HTMLCanvasElement
): Point => {
  return {
    x: point.x * canvas.width,
    y: point.y * canvas.height,
  };
};
export const drawLine = (
  from: Point,
  to: Point,
  color: string,
  width: number,
  ctx: CanvasRenderingContext2D,
) => {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
};

export const drawStroke = (
  points: Point[],
  color: string,
  width: number,
  ctx: CanvasRenderingContext2D,
  canvas : HTMLCanvasElement,
) => {
  if (points.length < 2) return;
  console.log({points})
  for (let i = 1; i < points.length; i++) {
    drawLine(
      denormalizePoint(points[i - 1],canvas),
      denormalizePoint(points[i],canvas),
      color,
      width,
      ctx,
    );
  }
};
