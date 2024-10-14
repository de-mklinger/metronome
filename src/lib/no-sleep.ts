import { useCallback, useEffect, useRef } from "react";
import NoSleep, { NoSleepMode } from "./no-sleep-patched.js";
import useEventListener from "./use-event-listener.ts";

export function useNoSleep(enabled: boolean, mode: NoSleepMode = "auto") {
  const noSleep = useRef<NoSleep | null>(null);

  const noSleepMode = useRef<NoSleepMode>(mode);

  const currentRequestedEnabled = useRef<boolean>(enabled);
  currentRequestedEnabled.current = enabled;

  const enable = useCallback(() => {
    if (!noSleep.current) {
      noSleep.current = new NoSleep({
        title: "Metronome",
        mode: noSleepMode.current,
      });
    }

    noSleep.current
      .enable()
      .then(() => console.debug("No-sleep enabled"))
      .catch((e) => console.warn("Error enabling no-sleep", e));
  }, [noSleep, noSleepMode]);

  const enableIfNeeded = useCallback(() => {
    if (currentRequestedEnabled.current) {
      enable();
    }
  }, [enable, currentRequestedEnabled]);

  const disable = useCallback(() => {
    if (noSleep.current) {
      noSleep.current
        .disable()
        .then(() => console.debug("No-sleep disabled"))
        .catch((e) => console.warn("Error disabling no-sleep", e));
    }
  }, [noSleep]);

  useEventListener("touchstart", enableIfNeeded);
  useEventListener("mousedown", enableIfNeeded);

  useEffect(() => {
    enableIfNeeded();

    if (!currentRequestedEnabled.current) {
      disable();
    }

    return () => disable();
  }, [currentRequestedEnabled, enableIfNeeded, disable]);

  if (mode !== noSleepMode.current) {
    console.log("Changing no-sleep mode", mode);
    if (noSleep.current) {
      disable();
      noSleep.current = null;
    }
  }

  return noSleep;
}
