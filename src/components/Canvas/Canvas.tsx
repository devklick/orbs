import { useSettings } from "../Settings";
import useOrbWorker from "../../orbs/useOrbWorker";

interface CanvasProps {
  width: number;
  height: number;
}
function Canvas({ width, height }: CanvasProps) {
  const { h, s, l } = useSettings((s) => s.backgroundColor);
  const { canvasRef } = useOrbWorker();

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ background: `hsl(${h} ${s} ${l})` }}
    />
  );
}

export default Canvas;
