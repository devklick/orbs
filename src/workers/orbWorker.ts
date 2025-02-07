import { FPMS, Orb } from "../orbs/orbs.types";
import { createOrbs, drawOrb, updateOrb } from "../orbs/orbs.func";
import { HSLColorRange } from "../types";

/**
 * The messages sent by the worker, for the application to consume.
 */
export namespace WorkerSentMessage {
  /**
   * The various types of message that the worker will send and expect the
   * application to handle.
   */
  export const Types = {
    fps: "FPS",
  } as const;

  export interface FPSUpdate {
    type: typeof Types.fps;
    fps: number;
  }

  export type MessageData = FPSUpdate;
}

/**
 * The messages received by the worker, that the application sends.
 */
export namespace WorkerReceivedMessage {
  /**
   * The various types of message that the worker expects to receive and handle.
   */
  export const Types = {
    stop: "STOP",
    update: "UPDATE",
    setup: "SETUP",
    pause: "PAUSE",
    resume: "RESUME",
  } as const;

  export interface Setup {
    type: typeof Types.setup;
    canvas: OffscreenCanvas;
  }

  export interface Update {
    type: typeof Types.update;
    maxOrbSize: number;
    orbColorRange: HSLColorRange;
    orbDensity: number;
    xySpeed: number;
  }

  export interface Stop {
    type: typeof Types.stop;
  }

  export interface Pause {
    type: typeof Types.pause;
  }
  export interface Resume extends Omit<Update, "type"> {
    type: typeof Types.resume;
  }

  export type MessageData = Setup | Update | Stop | Pause | Resume;
}

/**
 * The number of seconds between the FPS counter updates.
 */
const FPS_UPDATE_INTERVAL = 500;

interface DrawParams {
  xySpeed: number;
  ctx: OffscreenCanvasRenderingContext2D;
}

/**
 * The ID of the current animation frame.
 * Required to cancel the animation when the STOP message is received.
 */
let animationFrameId: number;

/**
 * The current orbs.
 * These will change if props change
 */
let orbs: Array<Orb>;

/**
 * The time of the previous animation frame.
 */
let prevFrameTime: number;

/**
 * The canvas to use for rendering.
 *
 * This can only be transferred from the app to the worker once,
 * and so we need to keep a reference to it. It is only expected to be provided
 * on the first UPDATE message.
 */
let canvas: OffscreenCanvas;

/**
 * Whether or not the animation should play.
 */
let paused: boolean = false;

let lastFpsUpdate: number = 0;

let unsentFps: number[] = [];

self.onmessage = (event: MessageEvent<WorkerReceivedMessage.MessageData>) =>
  handleMessage(event.data);

function handleMessage(data: WorkerReceivedMessage.MessageData) {
  switch (data.type) {
    case "SETUP":
      return handleSetupMessage(data);
    case "STOP":
      return handleStopMessage(data);
    case "UPDATE":
      return handleUpdateMessage(data);
    case "PAUSE":
      return handlePauseMessage(data);
    case "RESUME":
      return handleResumeMessage(data);
    default:
      console.warn("Unknown message received", data);
      return;
  }
}

/**
 * Handles the SETUP message and sets up the initial dependencies.
 * This only involves the canvas, and the reason being
 * that the canvas can only be transferred to the worker once.
 */
function handleSetupMessage(data: WorkerReceivedMessage.Setup) {
  if (data.canvas && !canvas) {
    canvas = data.canvas;
  }
}

/**
 * Handles the STOP message and cancels the current animation frame.
 * This generally happens when the component using the worker unmounts.
 */
function handleStopMessage(_data: WorkerReceivedMessage.Stop) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

/**
 * Handles the PAUSE animation by cancelling the current animation frame
 * and prevent any further frames being rendered.
 *
 * This is generally called when the browser tab becomes inactive.
 */
function handlePauseMessage(_data: WorkerReceivedMessage.Pause) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  paused = true;
}

/**
 * Handles the RESUME message by re-starting the animation loop.
 *
 * This is generally called when the browser tab becomes active.
 */
function handleResumeMessage(data: WorkerReceivedMessage.Resume) {
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;
  paused = false;
  prevFrameTime = performance.now();

  animationFrameId = requestAnimationFrame((time) =>
    draw(time, { xySpeed: data.xySpeed, ctx })
  );
}

/**
 * Handles the UPDATE message and constructs the orbs to be drawn.
 * This is generally called when the props that determine the density, color etc
 * of the orbs have changed.
 */
function handleUpdateMessage({
  maxOrbSize,
  orbColorRange,
  orbDensity,
  xySpeed,
}: WorkerReceivedMessage.Update) {
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  orbs = createOrbs({
    width: canvas.width,
    height: canvas.height,
    maxOrbSize,
    orbColorRange,
    orbDensity,
  });

  prevFrameTime = performance.now();

  animationFrameId = requestAnimationFrame((time) =>
    draw(time, { xySpeed, ctx })
  );
}

/**
 * Animation loop that takes care of applying physics to the orbs.
 */
function draw(time: number, { xySpeed, ctx }: DrawParams) {
  const { deltaTime } = calcFrameTimes(time);

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

  if (paused) return;
  animationFrameId = requestAnimationFrame((time) =>
    draw(time, { ctx, xySpeed })
  );
}

/**
 * Helper function to calculate the delta time.
 * Also handles calculating the frames per second, and if required,
 * notifying the application of this.
 */
function calcFrameTimes(time: number) {
  const deltaTime = time - prevFrameTime;

  unsentFps.push(1000 / deltaTime);

  prevFrameTime = time;

  if (time - lastFpsUpdate > FPS_UPDATE_INTERVAL) {
    const fps = unsentFps.reduce((sum, num) => sum + num, 0) / unsentFps.length;
    unsentFps = [];
    self.postMessage({ type: WorkerSentMessage.Types.fps, fps });
    lastFpsUpdate = time;
  }

  return {
    deltaTime,
  };
}
