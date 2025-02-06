import { HSLColorRange } from "../types";
import random from "../utils/random";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Orb {
  position: Vector3;
  velocity: Vector3;
  phaseOffset: Vector3;
  size: number;
  zDirection: number;
  color: string;
}

/**
 * The target number of frames per second.
 */
export const FPS = 60;
/**
 * The target number of frames per millisecond.
 */
export const FPMS = 1000 / FPS;

/**
 * Base speed multiplier for the x and y axis
 */
export const XY_SPEED_BASE_RANGE = 8;

/**
 * Base speed multiplier for the z axis
 */
export const Z_SPEED_BASE_RANGE = 1.5;

/**
 * The max depth along the Z axis;
 * As the z axis position reaches this value, it will act like the orb moving
 * further away, where it will *shrink* in size and become blurry.
 */
export const MAX_Z = 10;

/**
 * The min depth along the Z axis;
 * As the z axis position reaches this value, it will act like the orb moving
 * closer away, where it will *grow* in size and become blurry.
 */
export const MIN_Z = -10;

/**
 * The range of travel allowed along the Z axis as per `MIN_Z` and `MAX_Z`.
 */
export const Z_RANGE = MAX_Z - MIN_Z;

/**
 * The frequency (in milliseconds) that the FPS counter will be updated
 */
export const FPS_UPDATE_INTERVAL = 200;

export function createOrb(
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

export function updateOrb(
  orb: Orb,
  time: number,
  delta: number,
  xySpeed: number,
  canvasWidth: number,
  canvasHeight: number
) {
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
  const maxX = canvasWidth + tolerance;
  const maxY = canvasHeight + tolerance;

  if (orb.position.x < min) orb.position.x += maxX;
  if (orb.position.x > maxX) orb.position.x -= maxX;
  if (orb.position.y < min) orb.position.y += maxY;
  if (orb.position.y > maxY) orb.position.y -= maxY;
}

export function drawOrb(
  orb: Orb,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
) {
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

export function createOrbs({
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
