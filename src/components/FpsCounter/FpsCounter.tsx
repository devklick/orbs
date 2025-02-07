import { useEffect, useRef } from "react";
import { useSettings } from "../Settings";
import "./FpsCounter.scss";

function FpsCounter() {
  const fps = useSettings((s) => s.currentFPS);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerText = `FPS: ${Math.floor(fps)}`;
    }
  }, [fps]);
  return <span ref={ref} className={"fps-counter"} />;
}

export default FpsCounter;
