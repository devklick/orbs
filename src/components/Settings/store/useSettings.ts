import { create } from "zustand";

import {
  clone,
  DeepReadonly,
  HSLColor,
  HSLColorRange,
  NumberRange,
} from "../../../types";

type ColorTheme = "light" | "dark";

interface SettingsStateProperties {
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
   * Controls the color of the canvas that the orbs are drawn to.
   */
  backgroundColor: HSLColor;
  uiColorTheme: ColorTheme;
}

type Defaults = DeepReadonly<
  SettingsStateProperties & {
    hslMinMax: { h: NumberRange; s: NumberRange; l: NumberRange };
    orbDensityFactorRange: NumberRange;
    maxOrbSizeRange: NumberRange;
    xySpeedRange: NumberRange;
  }
>;

const defaults: Defaults = {
  modalOpen: false,
  orbColorRange: { h: [140, 220], s: [20, 40], l: [40, 80] },
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
  uiColorTheme: "dark",
};

interface SettingsState extends SettingsStateProperties {
  defaults: Defaults;
  currentFPS: Readonly<number>;
  setModalOpen(modalOpen: boolean): void;
  setOrbColorRange(orbColorRange: HSLColorRange): void;
  setOrbDensityFactor(orbDensityFactor: number): void;
  setMaxOrbSize(maxOrbSize: number): void;
  setXYSpeed(speed: number): void;
  setCurrentFPS(currentFPS: number): void;
  setBackgroundColor(backgroundColor: HSLColor): void;
  setUIColorTheme(uiColorTheme: ColorTheme): void;
}

const useSettingsStore = create<SettingsState>((set, get) => ({
  defaults: defaults,
  backgroundColor: defaults.backgroundColor,
  currentFPS: 0,
  modalOpen: defaults.modalOpen,
  orbColorRange: clone(defaults.orbColorRange, { writable: true }),
  orbDensityFactor: defaults.orbDensityFactor,
  maxOrbSize: defaults.maxOrbSize,
  xySpeed: defaults.xySpeed,
  uiColorTheme: defaults.uiColorTheme,
  setModalOpen(modalOpen) {
    set({ modalOpen });
  },
  setMaxOrbSize(maxOrbSize) {
    set({ maxOrbSize });
  },
  setOrbColorRange(orbColorRange) {
    const defaults = get().defaults.hslMinMax;
    const hValid =
      orbColorRange.h[0] >= defaults.h.min &&
      orbColorRange.h[1] <= defaults.h.max &&
      orbColorRange.h[0] <= orbColorRange.h[1];

    const sValid =
      orbColorRange.s[0] >= defaults.s.min &&
      orbColorRange.s[1] <= defaults.s.max &&
      orbColorRange.s[0] <= orbColorRange.s[1];

    const lValid =
      orbColorRange.l[0] >= defaults.l.min &&
      orbColorRange.l[1] <= defaults.l.max &&
      orbColorRange.l[0] <= orbColorRange.l[1];

    if (hValid && sValid && lValid) {
      set({ orbColorRange });
    }
  },
  setOrbDensityFactor(orbDensityFactor) {
    set({ orbDensityFactor });
  },
  setXYSpeed(xySpeed) {
    set({ xySpeed });
  },
  setCurrentFPS(currentFPS) {
    set({ currentFPS });
  },
  setBackgroundColor(backgroundColor) {
    const defaults = get().defaults.hslMinMax;
    const hValid =
      backgroundColor.h >= defaults.h.min &&
      backgroundColor.h <= defaults.h.max;

    const sValid =
      backgroundColor.s >= defaults.s.min &&
      backgroundColor.s <= defaults.s.max;

    const lValid =
      backgroundColor.l >= defaults.l.min &&
      backgroundColor.l <= defaults.s.max;

    if (hValid && sValid && lValid) {
      set({ backgroundColor });
    }
    const uiColorTheme: ColorTheme = backgroundColor.l > 60 ? "light" : "dark";
    set({ uiColorTheme });
  },
  setUIColorTheme(uiColorTheme) {
    set({ uiColorTheme });
  },
}));

export default useSettingsStore;
