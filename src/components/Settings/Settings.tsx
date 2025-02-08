import clsx from "clsx";
import { IconSettings, IconSettingsFilled } from "@tabler/icons-react";

import useSettings, { defaults, SettingsState } from "./store/useSettings";
import "./Settings.scss";

function Settings() {
  const open = useSettings((s) => s.modalOpen);
  const setModalOpen = useSettings((s) => s.setModalOpen);
  const { h, s, l } = useSettings((s) => s.backgroundColor);
  const theme = useSettings((s) => s.uiColorTheme);

  const modalColor = `hsl(${h} ${s} ${l})`;

  function onModalIconClicked() {
    setModalOpen(!open);
  }

  return (
    <div className={clsx("settings", `settings--${theme}`)}>
      <div className="settings__icon">
        {!open && (
          <IconSettings onClick={onModalIconClicked} size={"100%"} stroke={1} />
        )}
        {open && (
          <IconSettingsFilled
            onClick={onModalIconClicked}
            size={"100%"}
            stroke={1}
          />
        )}
      </div>
      {open && (
        <div className="settings__modal" style={{ background: modalColor }}>
          <MainSettings />
          <OrbColorSettings />
          <BackgroundColorSettings />
        </div>
      )}
    </div>
  );
}

function MainSettings() {
  const setMaxOrbSize = useSettings((s) => s.setMaxOrbSize);
  const setSpeed = useSettings((s) => s.setXYSpeed);
  const setZDepth = useSettings((s) => s.setZDepth);
  const setDensity = useSettings((s) => s.setOrbDensityFactor);
  return (
    <>
      <Slider
        label="Density"
        min={defaults.orbDensityFactorRange.min}
        max={defaults.orbDensityFactorRange.max}
        step={0.1}
        valueSelector={(s) => s.orbDensityFactor}
        onChange={setDensity}
      />

      <Slider
        label="Max Orb Size"
        min={defaults.maxOrbSizeRange.min}
        max={defaults.maxOrbSizeRange.max}
        step={0.1}
        valueSelector={(s) => s.maxOrbSize}
        onChange={setMaxOrbSize}
      />

      <Slider
        label="Speed"
        min={defaults.xySpeedRange.min}
        max={defaults.xySpeedRange.max}
        step={0.1}
        valueSelector={(s) => s.xySpeed}
        onChange={setSpeed}
      />

      <Slider
        label="Depth"
        min={defaults.zDepthRange.min}
        max={defaults.zDepthRange.max}
        step={0.1}
        valueSelector={(s) => s.zDepth}
        onChange={setZDepth}
      />
    </>
  );
}

function OrbColorSettings() {
  const setOrbColorRange = useSettings((s) => s.setOrbColorRange);

  return (
    <div className="settings__group">
      <label>Orb Color</label>
      <div className="settings__group">
        <label>Hue</label>
        <Slider
          label="Min"
          min={defaults.hslMinMax.h.min}
          max={defaults.hslMinMax.h.max}
          valueSelector={(s) => s.orbColorRange.h.min}
          onChange={(value) => setOrbColorRange({ h: { min: value } })}
          step={1}
        />
        <Slider
          label="Max"
          min={defaults.hslMinMax.h.min}
          max={defaults.hslMinMax.h.max}
          valueSelector={(s) => s.orbColorRange.h.max}
          onChange={(value) => setOrbColorRange({ h: { max: value } })}
          step={1}
        />
      </div>
      <div className="settings__group">
        <label>Saturation</label>
        <Slider
          label="Min"
          min={defaults.hslMinMax.s.min}
          max={defaults.hslMinMax.s.max}
          valueSelector={(s) => s.orbColorRange.s.min}
          onChange={(value) => setOrbColorRange({ s: { min: value } })}
          step={1}
        />
        <Slider
          label="Max"
          min={defaults.hslMinMax.s.min}
          max={defaults.hslMinMax.s.max}
          valueSelector={(s) => s.orbColorRange.s.max}
          onChange={(value) => setOrbColorRange({ s: { max: value } })}
          step={1}
        />
      </div>
      <div className="settings__group">
        <label>Lightness</label>
        <Slider
          label="Min"
          min={defaults.hslMinMax.l.min}
          max={defaults.hslMinMax.l.max}
          valueSelector={(s) => s.orbColorRange.l.min}
          onChange={(value) => setOrbColorRange({ l: { min: value } })}
          step={1}
        />
        <Slider
          label="Max"
          min={defaults.hslMinMax.l.min}
          max={defaults.hslMinMax.l.max}
          valueSelector={(s) => s.orbColorRange.l.max}
          onChange={(value) => setOrbColorRange({ l: { max: value } })}
          step={1}
        />
      </div>
    </div>
  );
}

function BackgroundColorSettings() {
  const setBackgroundColor = useSettings((s) => s.setBackgroundColor);
  return (
    <div className="settings__group">
      <label>Background color</label>
      <Slider
        label="Hue"
        min={defaults.hslMinMax.h.min}
        max={defaults.hslMinMax.h.max}
        step={1}
        valueSelector={(s) => s.backgroundColor.h}
        onChange={(h) => setBackgroundColor({ h })}
      />
      <Slider
        label="Saturation"
        min={defaults.hslMinMax.s.min}
        max={defaults.hslMinMax.s.max}
        step={1}
        valueSelector={(s) => s.backgroundColor.s}
        onChange={(s) => setBackgroundColor({ s })}
      />
      <Slider
        label="Lightness"
        min={defaults.hslMinMax.l.min}
        max={defaults.hslMinMax.l.max}
        step={1}
        valueSelector={(s) => s.backgroundColor.l}
        onChange={(l) => setBackgroundColor({ l })}
      />
    </div>
  );
}

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  valueSelector: (state: SettingsState) => number;
  onChange: (value: number) => void;
}

function Slider({
  label,
  max,
  min,
  valueSelector,
  onChange,
  step,
}: SliderProps) {
  const value = useSettings(valueSelector);

  return (
    <div className="settings__setting">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
    </div>
  );
}

export default Settings;
