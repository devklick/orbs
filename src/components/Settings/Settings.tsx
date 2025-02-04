import { IconSettings, IconSettingsFilled } from "@tabler/icons-react";

import useSettingsStore from "./store/useSettings";
import "./Settings.scss";
import clsx from "clsx";

function Settings() {
  const open = useSettingsStore((s) => s.modalOpen);
  const setModalOpen = useSettingsStore((s) => s.setModalOpen);
  const setOrbDensity = useSettingsStore((s) => s.setOrbDensityFactor);
  const setMaxOrbSize = useSettingsStore((s) => s.setMaxOrbSize);
  const setOrbColorRange = useSettingsStore((s) => s.setOrbColorRange);
  const setSpeed = useSettingsStore((s) => s.setXYSpeed);
  const orbColorRange = useSettingsStore((s) => s.orbColorRange);
  const backgroundColor = useSettingsStore((s) => s.backgroundColor);
  const theme = useSettingsStore((s) => s.uiColorTheme);
  const setBackgroundColor = useSettingsStore((s) => s.setBackgroundColor);
  const defaults = useSettingsStore((s) => s.defaults);

  const modalColor = `hsl(${backgroundColor.h} ${backgroundColor.s} ${backgroundColor.l})`;

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
            <label>Orb Color</label>
            <div className="settings__group">
              <label>Hue</label>
              <div className="settings__setting">
                <label>Min</label>
                <input
                  type="range"
                  min={defaults.hslMinMax.h.min}
                  max={defaults.hslMinMax.h.max}
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
                  min={defaults.hslMinMax.h.min}
                  max={defaults.hslMinMax.h.max}
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
                  min={defaults.hslMinMax.s.min}
                  max={defaults.hslMinMax.s.max}
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
                  min={defaults.hslMinMax.s.min}
                  max={defaults.hslMinMax.s.max}
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
                  min={defaults.hslMinMax.l.min}
                  max={defaults.hslMinMax.l.max}
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
                  min={defaults.hslMinMax.l.min}
                  max={defaults.hslMinMax.l.max}
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

          <div className="settings__group">
            <label>Background color</label>
            <div className="settings__setting">
              <label>Hue</label>
              <input
                type="range"
                min={defaults.hslMinMax.h.min}
                max={defaults.hslMinMax.h.max}
                defaultValue={backgroundColor.h}
                step={1}
                onChange={(e) =>
                  setBackgroundColor({
                    ...backgroundColor,
                    h: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="settings__setting">
              <label>Saturation</label>
              <input
                type="range"
                min={defaults.hslMinMax.s.min}
                max={defaults.hslMinMax.s.max}
                defaultValue={backgroundColor.s}
                step={1}
                onChange={(e) =>
                  setBackgroundColor({
                    ...backgroundColor,
                    s: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="settings__setting">
              <label>Lightness</label>
              <input
                type="range"
                min={defaults.hslMinMax.l.min}
                max={defaults.hslMinMax.l.max}
                defaultValue={backgroundColor.l}
                step={1}
                onChange={(e) =>
                  setBackgroundColor({
                    ...backgroundColor,
                    l: Number(e.target.value),
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
