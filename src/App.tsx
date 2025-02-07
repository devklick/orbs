import clsx from "clsx";

import Settings from "./components/Settings";
import FPS from "./components/FpsCounter";
import { useSettings } from "./components/Settings";

import "./App.scss";
import Canvas from "./components/Canvas";

function App() {
  const theme = useSettings((s) => s.uiColorTheme);

  return (
    <div className={clsx("app", `app--${theme}`)}>
      <FPS />
      <Settings />
      <Canvas width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}

export default App;
