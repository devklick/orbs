import { useEffect, useRef } from "react";
import useSettingsStore from "../Settings/store/useSettings";
import OrbWorker from "../../workers/orbWorker.ts?worker";

function Canvas() {
  const { h, s, l } = useSettingsStore((s) => s.backgroundColor);
  const maxOrbSize = useSettingsStore((s) => s.maxOrbSize);
  const orbColorRange = useSettingsStore((s) => s.orbColorRange);
  const orbDensity = useSettingsStore((s) => s.orbDensityFactor);
  const xySpeed = useSettingsStore((s) => s.xySpeed);
  const setCurrentFPS = useSettingsStore((s) => s.setCurrentFPS);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvas = useRef<OffscreenCanvas | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!offscreenCanvas.current) {
      offscreenCanvas.current = canvas.transferControlToOffscreen();
    }

    if (workerRef.current) return;

    workerRef.current = new OrbWorker();
    workerRef.current.onmessage = (e) => {
      if (e.data.type === "FPS") {
        setCurrentFPS(e.data.fps);
      }
      console.log("Msg from worker:", e);
    };
    workerRef.current.onmessageerror = (e) => console.log("Err from worker", e);

    workerRef.current.postMessage(
      {
        type: "orb",
        canvas: offscreenCanvas.current,
        maxOrbSize,
        orbColorRange,
        orbDensity,
        xySpeed,
      },
      [offscreenCanvas.current]
    );
    return () => {
      // workerRef.current?.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    workerRef.current?.postMessage({
      type: "STOP",
    });
    workerRef.current?.postMessage({
      type: "orb",
      maxOrbSize,
      orbColorRange,
      orbDensity,
      xySpeed,
    });
  }, [maxOrbSize, orbColorRange, orbDensity, xySpeed]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ background: `hsl(${h} ${s} ${l})` }}
    />
  );
}

export default Canvas;
