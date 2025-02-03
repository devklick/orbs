import { IconSettings, IconSettingsFilled } from "@tabler/icons-react";

import useSettingsStore from "./store/useSettings";
import "./Settings.scss";

function Settings() {
  const open = useSettingsStore((s) => s.modalOpen);
  const setModalOpen = useSettingsStore((s) => s.setModalOpen);
  const setOrbDensity = useSettingsStore((s) => s.setOrbDensityFactor);
  const setMaxOrbSize = useSettingsStore((s) => s.setMaxOrbSize);
  const setOrbColorRange = useSettingsStore((s) => s.setOrbColorRange);
  const setSpeed = useSettingsStore((s) => s.setXYSpeed);
  const orbColorRange = useSettingsStore((s) => s.orbColorRange);
  const defaults = useSettingsStore((s) => s.defaults);

  function onModalIconClicked() {
    setModalOpen(!open);
  }

  return (
    <div className="settings">
      <div className="settings__icon">
        {!open && <IconSettings onClick={onModalIconClicked} size={"100%"} />}
        {open && (
          <IconSettingsFilled onClick={onModalIconClicked} size={"100%"} />
        )}
      </div>
      {open && (
        <div className="settings__modal">
          <div className="settings__setting">
            <label>Density</label>
            <input
              type="range"
              min={defaults.orbDensityFactorRange.min}
              max={defaults.orbDensityFactorRange.max}
              step={0.1}
              defaultValue={defaults.orbDensityFactor}
              onChange={(e) => setOrbDensity(Number(e.target.value))}
            />
          </div>

          <div className="settings__setting">
            <label>Max Orb Size</label>
            <input
              type="range"
              min={defaults.maxOrbSizeRange.min}
              max={defaults.maxOrbSizeRange.max}
              step={0.1}
              defaultValue={defaults.maxOrbSize}
              onChange={(e) => setMaxOrbSize(Number(e.target.value))}
            />
          </div>

          <div className="settings__setting">
            <label>Speed</label>
            <input
              type="range"
              min={defaults.xySpeedRange.min}
              max={defaults.xySpeedRange.max}
              step={0.1}
              defaultValue={defaults.xySpeed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>

          <div className="settings__group">
            <label>Hue</label>
            <div className="settings__setting">
              <label>Min</label>
              <input
                type="range"
                min={defaults.orbColorRangeMinMax.h.min}
                max={defaults.orbColorRangeMinMax.h.max}
                step={1}
                defaultValue={orbColorRange.h[0]}
                onChange={(e) =>
                  setOrbColorRange({
                    ...orbColorRange,
                    h: [Number(e.target.value), orbColorRange.h[1]],
                  })
                }
              />
            </div>
            <div className="settings__setting">
              <label>Max</label>
              <input
                type="range"
                min={defaults.orbColorRangeMinMax.h.min}
                max={defaults.orbColorRangeMinMax.h.max}
                step={1}
                defaultValue={defaults.orbColorRange.h[1]}
                onChange={(e) =>
                  setOrbColorRange({
                    ...orbColorRange,
                    h: [orbColorRange.h[0], Number(e.target.value)],
                  })
                }
              />
            </div>
          </div>

          <div className="settings__group">
            <label>Saturation</label>
            <div className="settings__setting">
              <label>Min</label>
              <input
                type="range"
                min={defaults.orbColorRangeMinMax.s.min}
                max={defaults.orbColorRangeMinMax.s.max}
                step={1}
                defaultValue={defaults.orbColorRange.s[0]}
                onChange={(e) =>
                  setOrbColorRange({
                    ...orbColorRange,
                    s: [Number(e.target.value), orbColorRange.s[1]],
                  })
                }
              />
            </div>
            <div className="settings__setting">
              <label>Max</label>
              <input
                type="range"
                min={defaults.orbColorRangeMinMax.s.min}
                max={defaults.orbColorRangeMinMax.s.max}
                step={1}
                defaultValue={defaults.orbColorRange.s[1]}
                onChange={(e) =>
                  setOrbColorRange({
                    ...orbColorRange,
                    s: [orbColorRange.s[0], Number(e.target.value)],
                  })
                }
              />
            </div>
          </div>

          <div className="settings__group">
            <label>Lightness</label>
            <div className="settings__setting">
              <label>Min</label>
              <input
                type="range"
                min={defaults.orbColorRangeMinMax.l.min}
                max={defaults.orbColorRangeMinMax.l.max}
                step={1}
                defaultValue={defaults.orbColorRange.l[0]}
                onChange={(e) =>
                  setOrbColorRange({
                    ...orbColorRange,
                    l: [Number(e.target.value), orbColorRange.l[1]],
                  })
                }
              />
            </div>
            <div className="settings__setting">
              <label>Max</label>
              <input
                type="range"
                min={defaults.orbColorRangeMinMax.l.min}
                max={defaults.orbColorRangeMinMax.l.max}
                step={1}
                defaultValue={defaults.orbColorRange.l[1]}
                onChange={(e) =>
                  setOrbColorRange({
                    ...orbColorRange,
                    l: [orbColorRange.l[0], Number(e.target.value)],
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
