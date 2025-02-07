import clsx from "clsx";

import { use2dCanvas } from "./hooks/canvasHooks";
import useOrbs from "./hooks/useOrbs";

import Settings from "./components/Settings";
import FPS from "./components/FpsCounter";
import useSettingsStore from "./components/Settings/store/useSettings";

import "./App.scss";
import Canvas from "./components/Canvas";

function App() {
  const { canvasRef, contextRef } = use2dCanvas();
  useOrbs({ canvasRef, contextRef });
  const theme = useSettingsStore((s) => s.uiColorTheme);

  return (
    <div className={clsx("app", `app--${theme}`)}>
      <FPS />
      <Settings />
      <Canvas />
    </div>
  );
}

export default App;
