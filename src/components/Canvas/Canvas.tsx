import { useEffect, useRef } from "react";
import useSettingsStore from "../Settings/store/useSettings";
// import styles from "./Canvas.scss";

import OrbWorker from "../../workers/orbWorker.ts?worker";
// const worker = new OrbWorker();

// function Canvas() {
//   const { h, s, l } = useSettingsStore((s) => s.backgroundColor);
//   const maxOrbSize = useSettingsStore((s) => s.maxOrbSize);
//   const orbColorRange = useSettingsStore((s) => s.orbColorRange);
//   const orbDensity = useSettingsStore((s) => s.orbDensityFactor);
//   const xySpeed = useSettingsStore((s) => s.xySpeed);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const offscreenCanvas = useRef<OffscreenCanvas | null>(null);
//   const workerRef = useRef<Worker | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     if (!offscreenCanvas.current) {
//       offscreenCanvas.current = canvas.transferControlToOffscreen();
//     }

//     if (workerRef.current) return;

//     workerRef.current = new Worker(workerUrl, { type: "module" });

//     workerRef.current.onmessage = (e) =>
//       console.log("Message received from worker:", e);

//     workerRef.current.onmessageerror = (e) =>
//       console.log("Error received from worker", e);

//     workerRef.current.postMessage(
//       {
//         canvas: offscreenCanvas.current,
//         maxOrbSize,
//         orbColorRange,
//         orbDensity,
//         xySpeed,
//       },
//       [offscreenCanvas.current]
//     );
//     return () => {
//       workerRef.current?.terminate();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     workerRef.current?.postMessage({
//       maxOrbSize,
//       orbColorRange,
//       orbDensity,
//       xySpeed,
//     });
//   }, [maxOrbSize, orbColorRange, orbDensity, xySpeed]);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={window.innerWidth}
//       height={window.innerHeight}
//       style={{ background: `hsl(${h} ${s} ${l})` }}
//     />
//   );
// }

function Canvas() {
  const { h, s, l } = useSettingsStore((s) => s.backgroundColor);
  const maxOrbSize = useSettingsStore((s) => s.maxOrbSize);
  const orbColorRange = useSettingsStore((s) => s.orbColorRange);
  const orbDensity = useSettingsStore((s) => s.orbDensityFactor);
  const xySpeed = useSettingsStore((s) => s.xySpeed);
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
    workerRef.current.onmessage = (e) => console.log("Msg from worker:", e);
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
      maxOrbSize,
    });
  }, [maxOrbSize]);

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
