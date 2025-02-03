import use2dCanvas from "./hooks/use2dCanvas";
import useOrbs from "./hooks/useOrbs";

import "./App.css";
import Settings from "./components/Settings";
import FPS from "./components/FpsCounter";

function App() {
  const { canvasRef, contextRef } = use2dCanvas();
  useOrbs({ canvasRef, contextRef });

  return (
    <>
      <FPS />
      <Settings />
      <canvas ref={canvasRef} style={{ background: "#242636" }} />
    </>
  );
}

export default App;
