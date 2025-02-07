import { useEffect, useRef } from "react";

export function use2dCanvas() {
  const [canvasRef] = useFullScreenCanvas();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // capture the 2d context from the canvas
  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef]);

  // sync canvas size to window size
  useEffect(() => {
    function resize() {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);

  return {
    canvasRef,
    contextRef,
  };
}

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return [canvasRef] as const;
}

export function useFullScreenCanvas() {
  const [canvasRef] = useCanvas();
  useEffect(() => {
    function resize() {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);

  return [canvasRef] as const;
}

export function useOffscreenCanvas() {
  const [canvasRef] = useCanvas();
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !offscreenCanvasRef.current) {
      offscreenCanvasRef.current =
        canvasRef.current.transferControlToOffscreen();
    }
  }, [canvasRef, offscreenCanvasRef]);

  return [canvasRef, offscreenCanvasRef] as const;
}
