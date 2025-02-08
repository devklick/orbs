export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

export const HSLKeys = ["h", "s", "l"] as const;
export type HSLKey = (typeof HSLKeys)[number];

export type HSLColor = Record<HSLKey, number>;
export type HSLColorRange = Record<HSLKey, NumberRange>;

export interface NumberRange {
  min: number;
  max: number;
}

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends (...args: unknown[]) => unknown
    ? T[K] // Keep functions as they are
    : T[K] extends object
    ? DeepReadonly<T[K]> // Recursively apply DeepReadonly
    : T[K]; // Keep primitives unchanged
};

export type DeepWritable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P];
};
export function clone<T, W extends boolean = false>(
  value: T,
  options?: { writable?: W } & Parameters<typeof structuredClone>[1]
): W extends true ? DeepWritable<T> : T {
  return structuredClone(value, options);
}
