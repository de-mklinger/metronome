import {useCallback, useEffect, useRef} from "react";
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
                    .then(() => console.debug("No-sleep enabled"))
                    .catch(e => console.warn("Error enabling no-sleep", e));
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
                    console.debug("No-sleep disabled")
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
