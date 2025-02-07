import { useEffect, useRef } from "react";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // useEffect(() => {
  //   function resize() {
  //     console.log("useFullScreenCanvas.resize");
  //     if (!offscreenCanvasRef.current) return;
  //     offscreenCanvasRef.current.width = window.innerWidth;
  //     offscreenCanvasRef.current.height = window.innerHeight;
  //   }
  //   resize();
  //   window.addEventListener("resize", resize);
  //   return () => window.removeEventListener("resize", resize);
  // }, [offscreenCanvasRef]);

  return [canvasRef, offscreenCanvasRef] as const;
}
