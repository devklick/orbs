import { useEffect, useRef } from "react";

function use2dCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

export default use2dCanvas;
