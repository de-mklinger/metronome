import {useCallback, useEffect, useRef, useState} from "react";
import NoSleep from './no-sleep-patched'
import useEventListener from "@use-it/event-listener";

export function useNoSleep(enabled) {
    const noSleep = useRef(null);

    const currentEnabled = useRef(enabled);
    currentEnabled.current = enabled;

    const enable = useCallback(() => {
            if (currentEnabled.current) {
                if (noSleep.current === null) {
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

export function NoSleepDebugView({noSleep}) {
    // DEBUG VIEW:
    const [noSleepEnabled, setNoSleepEnabled] = useState(false);
    const [videoRunning, setVideoRunning] = useState(false);

    // DEBUG VIEW:
    useEffect(() => {
        const intervalId = setInterval(() => {
            let newNoSleepEnabled = noSleep.current && noSleep.current.isEnabled();
            setNoSleepEnabled(newNoSleepEnabled);
            setVideoRunning(noSleep.current && noSleep.current.getVideo() && !noSleep.current.getVideo().paused);
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