import {RefObject, useCallback, useEffect, useRef, useState} from "react";
import NoSleep from './no-sleep-patched.js'
import useEventListener from "./use-event-listener.ts";

export function useNoSleep(enabled: boolean) {
    const noSleep = useRef<NoSleep | null>(null);

    const currentEnabled = useRef<boolean>(enabled);
    currentEnabled.current = enabled;

    const enable = useCallback(() => {
            if (currentEnabled.current) {
                if (!noSleep.current) {
                    noSleep.current = new NoSleep("Metronome");
                }

                noSleep.current.enable()
                    .then(() => console.log("No-sleep enabled"))
                    .catch(e => console.log("Error enabling no-sleep", e));
            }
        },
        [noSleep, currentEnabled]
    );

    useEventListener("touchstart", enable);
    useEventListener("mousedown", enable);

    useEffect(() => {
            enable();

            const disable = () => {
                if (noSleep.current) {
                    console.log("No-sleep disabled")
                    noSleep.current.disable();
                }
            };

            if (!currentEnabled.current) {
                disable();
            }

            return () => disable();
        },
        [currentEnabled, enabled, enable]
    );

    return noSleep;
}

export function NoSleepDebugView({noSleep}: {noSleep: RefObject<NoSleep>}) {
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
