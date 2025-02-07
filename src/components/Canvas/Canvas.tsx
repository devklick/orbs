import { useEffect, useRef } from "react";
import useSettingsStore from "../Settings/store/useSettings";
import OrbWorker from "../../workers/orbWorker.ts?worker";
import { MessageTypes } from "../../workers/orbWorker";
import { useOffscreenCanvas } from "../../hooks/canvasHooks";

function Canvas() {
  const { h, s, l } = useSettingsStore((s) => s.backgroundColor);
  const maxOrbSize = useSettingsStore((s) => s.maxOrbSize);
  const orbColorRange = useSettingsStore((s) => s.orbColorRange);
  const orbDensity = useSettingsStore((s) => s.orbDensityFactor);
  const xySpeed = useSettingsStore((s) => s.xySpeed);
  const setCurrentFPS = useSettingsStore((s) => s.setCurrentFPS);
  const [canvasRef, offscreenCanvasRef] = useOffscreenCanvas();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = canvas.transferControlToOffscreen();
    }

    if (workerRef.current) return;

    workerRef.current = new OrbWorker();
    workerRef.current.onmessage = (e) => {
      if (e.data.type === MessageTypes.fps) {
        setCurrentFPS(e.data.fps);
      }
      console.log("Msg from worker:", e);
    };
    workerRef.current.onmessageerror = (e) => console.log("Err from worker", e);

    workerRef.current.postMessage(
      {
        type: MessageTypes.update,
        canvas: offscreenCanvasRef.current,
        maxOrbSize,
        orbColorRange,
        orbDensity,
        xySpeed,
      },
      [offscreenCanvasRef.current]
    );
    return () => {
      // workerRef.current?.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    workerRef.current?.postMessage({
      type: MessageTypes.stop,
    });
    workerRef.current?.postMessage({
      type: MessageTypes.update,
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
