import { useEffect, useRef } from "react";
import random from "../utils/random";
import useSettingsStore from "../components/Settings/store/useSettings";
import { HSLColorRange } from "../types";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Orb {
  position: Vector3;
  velocity: Vector3;
  phaseOffset: Vector3;
  size: number;
  zDirection: number;
  color: string;
}

interface UseOrbsParams {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
}

/**
 * The target number of frames per second.
 */
const FPS = 60;
/**
 * The target number of frames per millisecond.
 */
const FPMS = 1000 / FPS;

/**
 * Base speed multiplier for the x and y axis
 */
const XY_SPEED_BASE_RANGE = 8;

/**
 * Base speed multiplier for the z axis
 */
const Z_SPEED_BASE_RANGE = 1.5;

/**
 * The max depth along the Z axis;
 * As the z axis position reaches this value, it will act like the orb moving
 * further away, where it will *shrink* in size and become blurry.
 */
const MAX_Z = 10;

/**
 * The min depth along the Z axis;
 * As the z axis position reaches this value, it will act like the orb moving
 * closer away, where it will *grow* in size and become blurry.
 */
const MIN_Z = -10;

/**
 * The range of travel allowed along the Z axis as per `MIN_Z` and `MAX_Z`.
 */
const Z_RANGE = MAX_Z - MIN_Z;

/**
 * The frequency (in milliseconds) that the FPS counter will be updated
 */
const FPS_UPDATE_INTERVAL = 200;

function createOrb(
  canvasWidth: number,
  canvasHeight: number,
  orbColorRange: HSLColorRange,
  maxOrbSize: number
): Orb {
  const orb: Orb = {
    position: {
      x: random.float(0, canvasWidth),
      y: random.float(0, canvasHeight),
      // Since z = 0 is the point where the camera is in focus,
      // and we want the orb to randomly positioned along the z axis,
      // we create a random float that's balanced around 0
      z: random.balancedFloat(Z_RANGE),
    },
    velocity: {
      x: random.float(0, XY_SPEED_BASE_RANGE),
      y: random.float(0, XY_SPEED_BASE_RANGE),
      z: random.float(0, Z_SPEED_BASE_RANGE),
    },
    phaseOffset: {
      x: random.float(0, 1000),
      y: random.float(0, 1000),
      z: random.float(0, 1000),
    },
    size: random.float(15, 23 * maxOrbSize),
    zDirection: random.item(-1, 1),
    color: random.hsl(orbColorRange),
  };
  return orb;
}

function updateOrb(orb: Orb, time: number, delta: number, xySpeed: number) {
  const speedFactor = delta / FPMS; // Normalize to 60 FPS

  // Applying sine wave motion
  orb.velocity.x =
    Math.sin(time * 0.001 + orb.phaseOffset.x) *
    XY_SPEED_BASE_RANGE *
    speedFactor *
    xySpeed;
  orb.velocity.y =
    Math.cos(time * 0.001 + orb.phaseOffset.y) *
    XY_SPEED_BASE_RANGE *
    speedFactor *
    xySpeed;
  orb.velocity.z =
    Math.cos(time * 0.001 + orb.phaseOffset.z) *
    Z_SPEED_BASE_RANGE *
    speedFactor *
    orb.zDirection;

  // Move the dust particle
  orb.position.x += orb.velocity.x;
  orb.position.y += orb.velocity.y;
  orb.position.z += orb.velocity.z;

  // Reverse direction when Z reaches limits
  if (orb.position.z >= MAX_Z || orb.position.z <= MIN_Z) {
    orb.zDirection *= -1;
  }

  // Wrap around edges of the canvas for infinite movement
  // since the z range affects the orb size, we'll use that when calculating
  // the threshold that determines whether the orb is inside or outside the bounds
  const tolerance = Z_RANGE * 2;
  const min = -tolerance;
  const maxX = window.innerWidth + tolerance;
  const maxY = window.innerHeight + tolerance;

  if (orb.position.x < min) orb.position.x += maxX;
  if (orb.position.x > maxX) orb.position.x -= maxX;
  if (orb.position.y < min) orb.position.y += maxY;
  if (orb.position.y > maxY) orb.position.y -= maxY;
}

function drawOrb(orb: Orb, ctx: CanvasRenderingContext2D) {
  // blur as z moves further from 0.
  // as z gets larger, orb moving away from pov, blur less
  // as z gets larger, orb moving towards pob, blur more
  const blurAmount =
    orb.position.z > 0
      ? Math.abs(orb.position.z) * 1.5
      : Math.abs(orb.position.z) * 0.5;

  let size = orb.size + orb.position.z;

  // Hacky fix to stop error trying to draw circle with 0 radius
  if (size < 0) size = 0.0001;
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.beginPath();
  ctx.arc(orb.position.x, orb.position.y, size, 0, Math.PI * 2);
  ctx.fillStyle = orb.color;
  ctx.closePath();
}

function createOrbs({
  width,
  height,
  orbColorRange,
  orbDensity,
  maxOrbSize,
}: {
  width: number;
  height: number;
  orbColorRange: HSLColorRange;
  orbDensity: number;
  maxOrbSize: number;
}) {
  const area = width * height;
  const orbCount = Math.max(10, area / 20000) * orbDensity;
  return Array.from({ length: orbCount }, () =>
    createOrb(width, height, orbColorRange, maxOrbSize)
  );
}

function useOrbs({ canvasRef, contextRef }: UseOrbsParams) {
  const animationFrameIdRef = useRef<number | null>(null);
  const orbColorRange = useSettingsStore((s) => s.orbColorRange);
  const orbDensity = useSettingsStore((s) => s.orbDensityFactor);
  const maxOrbSize = useSettingsStore((s) => s.maxOrbSize);
  const xySpeed = useSettingsStore((s) => s.xySpeed);
  const setCurrentFPS = useSettingsStore((s) => s.setCurrentFPS);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const orbs = createOrbs({
      height: canvas.height,
      width: canvas.width,
      orbColorRange,
      orbDensity: orbDensity,
      maxOrbSize,
    });

    let prevTime = performance.now();
    let lastFpsUpdate = 0;

    const draw = (time: number) => {
      const deltaTime = time - prevTime;
      const fps = 1000 / deltaTime;
      prevTime = time;

      if (time - lastFpsUpdate > FPS_UPDATE_INTERVAL) {
        setCurrentFPS(fps);
        lastFpsUpdate = time;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        updateOrb(orb, time, deltaTime / FPMS, xySpeed);
        drawOrb(orb, ctx);
        ctx.fill();
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    animationFrameIdRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [
    canvasRef,
    contextRef,
    maxOrbSize,
    orbColorRange,
    orbDensity,
    setCurrentFPS,
    xySpeed,
  ]);
}

export default useOrbs;
