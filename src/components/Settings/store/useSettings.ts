import { create } from "zustand";
import {
  clone,
  DeepReadonly,
  HSLColorRange,
  NumberRange,
} from "../../../types";

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
}

type DefaultState = DeepReadonly<
  SettingsStateProperties & {
    orbColorRangeMinMax: { h: NumberRange; s: NumberRange; l: NumberRange };
    orbDensityFactorRange: NumberRange;
    maxOrbSizeRange: NumberRange;
    xySpeedRange: NumberRange;
  }
>;

const defaults: DefaultState = {
  modalOpen: false,
  orbColorRange: { h: [140, 220], s: [20, 40], l: [40, 80] },
  orbColorRangeMinMax: {
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
};

interface SettingsState extends SettingsStateProperties {
  defaults: DefaultState;
  currentFPS: Readonly<number>;
  setModalOpen(modalOpen: boolean): void;
  setOrbColorRange(orbColorRange: HSLColorRange): void;
  setOrbDensityFactor(orbDensityFactor: number): void;
  setMaxOrbSize(maxOrbSize: number): void;
  setXYSpeed(speed: number): void;
  setCurrentFPS(currentFPS: number): void;
}

const useSettingsStore = create<SettingsState>((set, get) => ({
  defaults: defaults,
  currentFPS: 0,
  modalOpen: defaults.modalOpen,
  orbColorRange: clone(defaults.orbColorRange, { writable: true }),
  orbDensityFactor: defaults.orbDensityFactor,
  maxOrbSize: defaults.maxOrbSize,
  xySpeed: defaults.xySpeed,
  setModalOpen(modalOpen) {
    set({ modalOpen });
  },
  setMaxOrbSize(maxOrbSize) {
    set({ maxOrbSize });
  },
  setOrbColorRange(orbColorRange) {
    const defaults = get().defaults.orbColorRangeMinMax;
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
      orbColorRange.l[1] <= defaults.s.max &&
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
}));

export default useSettingsStore;
