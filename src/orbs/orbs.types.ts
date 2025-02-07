/**
 * Represents a position in 3D space.
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents a single orb and how it's presented on the screen.
 */
export interface Orb {
  /**
   * The current 3d position of the orb.
   */
  position: Vector3;
  /**
   * The current speed of the orb.
   */
  velocity: Vector3;
  /**
   * An offset for the orbs movement to make it unique.
   */
  phaseOffset: Vector3;
  /**
   * The base size of the orb.
   * Note that the full size of the orb is also determined using it's
   * `position.z` and `zDirection`.
   */
  size: number;
  /**
   * The direction the orb is moving along the Z axis.
   * - 1 = closer
   * - -1 = further away
   */
  zDirection: number;
  /**
   * The HSL color string indicating the orbs color
   */
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
