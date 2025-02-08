import { create } from "zustand";

import {
  clone,
  DeepPartial,
  DeepReadonly,
  HSLColor,
  HSLColorRange,
  HSLKey,
  NumberRange,
} from "../../../types";

type ColorTheme = "light" | "dark";

export interface SettingsStateProperties {
  /**
   * Whether or not the settings modal is currently open
   *
   * @default false
   */
  modalOpen: boolean;
  /**
   * The range of HSL color values that the orbs can be generated in
   */
  orbColorRange: HSLColorRange;
  /**
   * Controls how many orbs are drawn to screen.
   *
   * - Min: 0.1
   * - Max: 3
   *
   * @default 1
   */
  orbDensityFactor: number;
  /**
   * Controls the maximum size of the orbs.
   *
   * - Min: 1
   * - Max: 3
   * @default 1
   */
  maxOrbSize: number;
  /**
   * Controls the speed that the orbs move along the x and y axis.
   *
   * - Min: 1
   * - Max: 10
   * @default 1
   */
  xySpeed: number;

  /**
   * Controls the depth that the orb is allowed to travel along the Z axis.
   *
   * - Min: 0
   * - Max: 3
   * @default 1
   */
  zDepth: number;
  /**
   * Controls the color of the canvas that the orbs are drawn to.
   */
  backgroundColor: HSLColor;
  uiColorTheme: ColorTheme;
}

export type Defaults = DeepReadonly<
  SettingsStateProperties & {
    hslMinMax: { h: NumberRange; s: NumberRange; l: NumberRange };
    orbDensityFactorRange: NumberRange;
    maxOrbSizeRange: NumberRange;
    xySpeedRange: NumberRange;
    zDepthRange: NumberRange;
  }
>;

export const defaults: Defaults = {
  modalOpen: false,
  orbColorRange: {
    h: { min: 140, max: 220 },
    s: { min: 20, max: 40 },
    l: { min: 40, max: 80 },
  },
  hslMinMax: {
    h: { min: 0, max: 360 },
    s: { min: 0, max: 100 },
    l: { min: 0, max: 100 },
  },
  orbDensityFactor: 1,
  orbDensityFactorRange: { min: 0.1, max: 3 },
  maxOrbSize: 1,
  maxOrbSizeRange: { min: 1, max: 3 },
  xySpeed: 1,
  xySpeedRange: { min: 1, max: 10 },
  backgroundColor: { h: 233, s: 11, l: 18 },
  zDepth: 1,
  zDepthRange: { min: 0, max: 3 },
  uiColorTheme: "dark",
};

export interface SettingsState extends SettingsStateProperties {
  currentFPS: Readonly<number>;
  setModalOpen(modalOpen: boolean): void;
  setOrbColorRange(orbColorRange: DeepPartial<HSLColorRange>): void;
  setOrbDensityFactor(orbDensityFactor: number): void;
  setMaxOrbSize(maxOrbSize: number): void;
  setXYSpeed(speed: number): void;
  setCurrentFPS(currentFPS: number): void;
  setBackgroundColor(backgroundColor: Partial<HSLColor>): void;
  setUIColorTheme(uiColorTheme: ColorTheme): void;
  setZDepth(zDepth: number): void;
}

export const useSettings = create<SettingsState>()((set, get) => ({
  backgroundColor: defaults.backgroundColor,
  currentFPS: 0,
  modalOpen: defaults.modalOpen,
  orbColorRange: clone(defaults.orbColorRange),
  orbDensityFactor: defaults.orbDensityFactor,
  maxOrbSize: defaults.maxOrbSize,
  xySpeed: defaults.xySpeed,
  uiColorTheme: defaults.uiColorTheme,
  zDepth: defaults.zDepth,
  setModalOpen(modalOpen) {
    console.log("setModalOpen called");
    set({ modalOpen });
  },
  setMaxOrbSize(maxOrbSize) {
    console.log("setMaxOrbSize called");
    set({ maxOrbSize });
  },
  setOrbColorRange(orbColorRange) {
    console.log("setOrbColorRange called");
    const _defaults = defaults.hslMinMax;
    const updates = clone(get().orbColorRange);

    for (const key of Object.keys(orbColorRange) as Array<HSLKey>) {
      // if min present and valid, apply it
      if (
        orbColorRange[key]?.min !== undefined &&
        orbColorRange[key].min >= _defaults[key].min &&
        orbColorRange[key].min <= (orbColorRange[key].max ?? updates[key].max)
      ) {
        updates[key].min = orbColorRange[key].min;
      }
      // if max present and valid, apply it
      if (
        orbColorRange[key]?.max !== undefined &&
        orbColorRange[key].max <= _defaults[key].max &&
        orbColorRange[key].max >= (orbColorRange[key].min ?? updates[key].min)
      ) {
        updates[key].max = orbColorRange[key].max;
      }
    }

    set({ orbColorRange: updates });
  },
  setOrbDensityFactor(orbDensityFactor) {
    console.log("setOrbDensityFactor called");
    set({ orbDensityFactor });
  },
  setXYSpeed(xySpeed) {
    console.log("setXYSpeed called");
    set({ xySpeed });
  },
  setCurrentFPS(currentFPS) {
    set({ currentFPS });
  },
  setBackgroundColor(backgroundColor) {
    console.log("setBackgroundColor called");
    const _defaults = defaults.hslMinMax;
    const updated = clone(get().backgroundColor);

    if (backgroundColor.h !== undefined) {
      updated.h = backgroundColor.h;
    }
    if (backgroundColor.s !== undefined) {
      updated.s = backgroundColor.s;
    }
    if (backgroundColor.l !== undefined) {
      updated.l = backgroundColor.l;
    }

    const hValid = updated.h >= _defaults.h.min && updated.h <= _defaults.h.max;

    const sValid = updated.s >= _defaults.s.min && updated.s <= _defaults.s.max;

    const lValid = updated.l >= _defaults.l.min && updated.l <= _defaults.s.max;

    if (hValid && sValid && lValid) {
      set({ backgroundColor: updated });
    }
    const uiColorTheme: ColorTheme = updated.l > 60 ? "light" : "dark";
    set({ uiColorTheme });
  },
  setUIColorTheme(uiColorTheme) {
    console.log("setUIColorTheme called");
    set({ uiColorTheme });
  },
  setZDepth(zDepth) {
    console.log("setZDepth called");
    const { min, max } = defaults.zDepthRange;
    if (zDepth >= min && zDepth <= max) {
      set({ zDepth });
    }
  },
}));

export default useSettings;
