import clsx from "clsx";

import use2dCanvas from "./hooks/use2dCanvas";
import useOrbs from "./hooks/useOrbs";

import Settings from "./components/Settings";
import FPS from "./components/FpsCounter";
import useSettingsStore from "./components/Settings/store/useSettings";

import "./App.scss";

function App() {
  const { canvasRef, contextRef } = use2dCanvas();
  useOrbs({ canvasRef, contextRef });
  const { h, s, l } = useSettingsStore((s) => s.backgroundColor);
  const theme = useSettingsStore((s) => s.uiColorTheme);

  return (
    <div className={clsx("app", `app--${theme}`)}>
      <FPS />
      <Settings />
      <canvas ref={canvasRef} style={{ background: `hsl(${h} ${s} ${l})` }} />
    </div>
  );
}

export default App;
