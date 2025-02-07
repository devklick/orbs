import React, { useCallback, useEffect } from "react";
import { WorkerReceivedMessage, WorkerSentMessage } from "../workers/orbWorker";
import { useOffscreenCanvas } from "../hooks/canvasHooks";
import { SetupWorkerCallback, useOffscreenWorker } from "../hooks/workerHooks";
import OrbWorker from "../workers/orbWorker.ts?worker";
import { useSettings } from "../components/Settings";

interface UseOrbWorkerReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function useOrbWorker(): UseOrbWorkerReturn {
  const setCurrentFPS = useSettings((s) => s.setCurrentFPS);
  const maxOrbSize = useSettings((s) => s.maxOrbSize);
  const orbColorRange = useSettings((s) => s.orbColorRange);
  const orbDensity = useSettings((s) => s.orbDensityFactor);
  const xySpeed = useSettings((s) => s.xySpeed);
  const zDepth = useSettings((s) => s.zDepth);
  const [canvasRef, offscreenCanvasRef] = useOffscreenCanvas();

  /**
   * Function to initialize the worker.
   * This can be considered a constructor.
   */
  const sendSetupMessage = useCallback<SetupWorkerCallback>(() => {
    if (!offscreenCanvasRef.current) return;
    const message: WorkerReceivedMessage.Setup = {
      type: "SETUP",
      canvas: offscreenCanvasRef.current,
    };
    const transfer = [offscreenCanvasRef.current];
    return [message, transfer];
  }, [offscreenCanvasRef]);

  /**
   * Function to handle messages sent by the worker.
   */
  const handleWorkerMessage = useCallback(
    (event: MessageEvent<WorkerSentMessage.MessageData>) => {
      if (event.data.type === WorkerSentMessage.Types.fps) {
        setCurrentFPS(event.data.fps);
      }
    },
    [setCurrentFPS]
  );

  /**
   * Create the offscreen worker.
   */
  const [workerRef] = useOffscreenWorker(
    OrbWorker,
    handleWorkerMessage,
    sendSetupMessage
  );

  /**
   * Function to send a STOP message to the worker.
   * This is used to cancel animations.
   */
  const sendStopMessage = useCallback(() => {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.stop,
    });
  }, [workerRef]);

  /**
   * Function to send an UPDATE message to the worker.
   * This is used to update the animation params whenever the props change.
   */
  const sendUpdateMessage = useCallback(
    (data: Omit<WorkerReceivedMessage.Update, "type">) => {
      workerRef.current.postMessage({
        type: WorkerReceivedMessage.Types.update,
        ...data,
        pause: false,
      });
    },
    [workerRef]
  );

  const sendPausedMessage = useCallback(() => {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.pause,
    });
  }, [workerRef]);

  const sendResumeMessage = useCallback(() => {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.resume,
      maxOrbSize,
      orbColorRange,
      orbDensity,
      xySpeed,
    });
  }, [maxOrbSize, orbColorRange, orbDensity, workerRef, xySpeed]);

  const handleVisibilityChanged = useCallback(() => {
    if (document.hidden) sendPausedMessage();
    else sendResumeMessage();
  }, [sendPausedMessage, sendResumeMessage]);

  useEffect(() => {
    window.addEventListener("visibilitychange", handleVisibilityChanged);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChanged);
  }, [handleVisibilityChanged]);

  /**
   * Monitor the props for changes and send them to the worker.
   */
  useEffect(() => {
    sendStopMessage();
    sendUpdateMessage({
      maxOrbSize,
      orbColorRange,
      orbDensity,
      xySpeed,
      zDepth,
    });
  }, [
    maxOrbSize,
    orbColorRange,
    orbDensity,
    xySpeed,
    zDepth,
    sendUpdateMessage,
    sendStopMessage,
  ]);

  return { canvasRef };
}
