export interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}
export interface DrawingConfig {
  width: number;
  color: string;
}
export interface Point {
  x: number;
  y: number;
}
export interface Stroke extends DrawingConfig {
  points: Point[];
}
