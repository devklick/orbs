import { createOrbs, drawOrb, FPMS, updateOrb } from "../orbs/orbs.types";
import { HSLColorRange } from "../types";

interface MessageData {
  canvas: OffscreenCanvas;
  maxOrbSize: number;
  orbColorRange: HSLColorRange;
  orbDensity: number;
  xySpeed: number;
  type: string;
}

let animationFrameId: number;

self.onmessageerror = (e) => {
  console.log("Worker received message error");
  self.postMessage({ type: "log", message: e.data });
};
self.onmessage = (event: MessageEvent<MessageData>) => {
  console.log("Worker received message");
  self.postMessage({ type: "log", message: JSON.stringify(event.data) });

  const { type, canvas, maxOrbSize, orbColorRange, orbDensity, xySpeed } =
    event.data;
  if (type !== "orb") return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const orbs = createOrbs({
    width: canvas.width,
    height: canvas.height,
    maxOrbSize,
    orbColorRange,
    orbDensity,
  });

  let prevTime = performance.now();
  // let lastFpsUpdate = 0;

  const draw = (time: number) => {
    const deltaTime = time - prevTime;
    // const fps = 1000 / deltaTime;
    prevTime = time;

    // if (time - lastFpsUpdate > FPS_UPDATE_INTERVAL) {
    //   setCurrentFPS(fps);
    //   lastFpsUpdate = time;
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const orb of orbs) {
      updateOrb(
        orb,
        time,
        deltaTime / FPMS,
        xySpeed,
        canvas.width,
        canvas.height
      );
      drawOrb(orb, ctx);
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  animationFrameId = requestAnimationFrame(draw);
};
// self.onmessage = (event) => {
//   if (event.data === "STOP") {
//     cancelAnimationFrame(animationFrameId);
//   }
// };

// console.log("Setting up message handler in worker");
// self.onmessage = (e) => {
//   console.log("Worker received message");
//   self.postMessage({ type: "log", message: JSON.stringify(e.data) });
// };
// self.onmessageerror = (e) => {
//   console.log("Worker received message error");
//   self.postMessage({ type: "log", message: JSON.stringify(e.data) });
// };
