import { createOrbs, drawOrb, FPMS, updateOrb } from "../orbs/orbs.types";
import { HSLColorRange } from "../types";

const FPS_UPDATE_INTERVAL = 200;

export const MessageTypes = {
  stop: "STOP",
  update: "UPDATE",
  fps: "FPS",
} as const;

type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

interface MessageData {
  canvas: OffscreenCanvas;
  maxOrbSize: number;
  orbColorRange: HSLColorRange;
  orbDensity: number;
  xySpeed: number;
  type: MessageType;
}

let animationFrameId: number;
/**
 * The canvas to use for rendering.
 *
 * This can only be transferred from the app to the worker once,
 * and so we need to keep a reference to it. It is only expected to be provided
 * on the first UPDATE message.
 */
let canvas: OffscreenCanvas;

self.onmessage = (event: MessageEvent<MessageData>) => {
  const {
    type,
    canvas: _canvas,
    maxOrbSize,
    orbColorRange,
    orbDensity,
    xySpeed,
  } = event.data;
  if (type === "STOP" && animationFrameId)
    cancelAnimationFrame(animationFrameId);
  if (type !== "UPDATE") return;

  if (_canvas) canvas = _canvas;

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
  let lastFpsUpdate = 0;

  const draw = (time: number) => {
    const deltaTime = time - prevTime;
    const fps = 1000 / deltaTime;
    prevTime = time;

    if (time - lastFpsUpdate > FPS_UPDATE_INTERVAL) {
      self.postMessage({ type: MessageTypes.fps, fps });
      lastFpsUpdate = time;
    }

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

function handleMessage(data: MessageData) {
  switch (data.type) {
    case "STOP":
      return handleStopMessage();
    case "UPDATE":
      return handleUpdateMessage(data);
  }
}

function handleStopMessage() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

function handleUpdateMessage(data: MessageData) {}
