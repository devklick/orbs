import { useEffect, useRef } from "react";
import useSettingsStore from "../Settings/store/useSettings";
import "./FpsCounter.scss";

function FpsCounter() {
  const fps = useSettingsStore((s) => s.currentFPS);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerText = `FPS: ${Math.floor(fps)}`;
    }
  }, [fps]);
  return <span ref={ref} className="fps-counter" />;
}

export default FpsCounter;
