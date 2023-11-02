import {RefObject, useEffect, useState} from "react";
import NoSleep from "../lib/no-sleep-patched.ts";

export default function NoSleepDebugView({noSleep}: {noSleep: RefObject<NoSleep>}) {
  // DEBUG VIEW:
  const [noSleepEnabled, setNoSleepEnabled] = useState(false);
  const [videoRunning, setVideoRunning] = useState(false);

  // DEBUG VIEW:
  useEffect(() => {
    const intervalId = setInterval(() => {
      const enabled = noSleep.current?.isEnabled();
      setNoSleepEnabled(Boolean(enabled));
      const video = noSleep.current?.getVideo();
      setVideoRunning(video !== undefined && !video.paused);
    }, 100);

    return () => clearInterval(intervalId);
  }, [noSleep]);

  return (
    <div>
      {noSleepEnabled ? " no sleep enabled " : " no sleep disabled "}
      {videoRunning ? " video running " : " video not running "}
    </div>
  )
}
