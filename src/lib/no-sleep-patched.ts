// Originally taken from https://github.com/richtr/NoSleep.js
// MIT license

import { webm, mp4 } from "./no-sleep-media.js";

// Detect iOS browsers < version 10
function oldIOS(): boolean {
    return typeof navigator !== "undefined" &&
    parseFloat(
      (
        "" +
        (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(
          navigator.userAgent
        ) || [0, ""])[1]
      )
        .replace("undefined", "3_2")
        .replace("_", ".")
        .replace("_", "")
    ) < 10 &&
      // @ts-ignore
    !window.MSStream;
}

// Detect native Wake Lock API support
const nativeWakeLock = () => "wakeLock" in navigator;
// const nativeWakeLock = () => false;

class NoSleep {
    private enabled: boolean;
    private _wakeLock: WakeLockSentinel | undefined = undefined;
    private noSleepTimer: number | undefined;
    private noSleepVideo: HTMLVideoElement | undefined;

    constructor(title = "No Sleep") {
        this.enabled = false;
        if (nativeWakeLock()) {
            this._wakeLock = undefined;
            const handleVisibilityChange = () => {
                if (this._wakeLock !== null && document.visibilityState === "visible") {
                    this.enable();
                }
            };
            document.addEventListener("visibilitychange", handleVisibilityChange);
            document.addEventListener("fullscreenchange", handleVisibilityChange);
        } else if (oldIOS()) {
            this.noSleepTimer = undefined;
        } else {
            // Set up no sleep video element
            const noSleepVideo = document.createElement("video");

            noSleepVideo.setAttribute("title", title);
            noSleepVideo.setAttribute("playsinline", "");

            this._addSourceToVideo(noSleepVideo, "webm", webm);
            this._addSourceToVideo(noSleepVideo, "mp4", mp4);

            noSleepVideo.addEventListener("loadedmetadata", () => {
                if (noSleepVideo.duration <= 1) {
                    // webm source
                    noSleepVideo.setAttribute("loop", "");
                } else {
                    // mp4 source
                    noSleepVideo.addEventListener("timeupdate", () => {
                        if (noSleepVideo.currentTime > 0.5) {
                            noSleepVideo.currentTime = Math.random();
                        }
                    });
                }
            });

            this.noSleepVideo = noSleepVideo;
        }
    }

    _addSourceToVideo(element: HTMLVideoElement, type: string, dataURI: string) {
        const source = document.createElement("source");
        source.src = dataURI;
        source.type = `video/${type}`;
        element.appendChild(source);
    }

    isEnabled() {
        return this.enabled && (!this.noSleepVideo || !this.noSleepVideo.paused);
    }

    getVideo() {
        return this.noSleepVideo;
    }

    async enable() {
        if (nativeWakeLock()) {
            return navigator.wakeLock
                .request("screen")
                .then((wakeLock) => {
                    this._wakeLock = wakeLock;
                    this.enabled = true;
                    //console.log("Wake Lock active.");
                    this._wakeLock.addEventListener("release", () => {
                        // ToDo: Potentially emit an event for the page to observe since
                        // Wake Lock releases happen when page visibility changes.
                        // (https://web.dev/wakelock/#wake-lock-lifecycle)
                        //console.log("Wake Lock released.");
                    });
                })
                .catch((err) => {
                    this.enabled = false;
                    console.error(`${err.name}, ${err.message}`);
                    throw err;
                });
        } else if (oldIOS()) {
            this.disable();
            console.warn(`
        NoSleep enabled for older iOS devices. This can interrupt
        active or long-running network requests from completing successfully.
        See https://github.com/richtr/NoSleep.js/issues/15 for more details.
      `);
            this.noSleepTimer = window.setInterval(() => {
                if (!document.hidden) {
                    window.location.href = window.location.href.split("#")[0];
                    window.setTimeout(window.stop, 0);
                }
            }, 15000);
            this.enabled = true;
            return Promise.resolve();
        } else if (this.noSleepVideo) {
            let playPromise = this.noSleepVideo.play();
            return playPromise
                .then((res) => {
                    this.enabled = true;
                    return res;
                })
                .catch((err) => {
                    this.enabled = false;
                    throw err;
                });
        }
    }

    disable() {
        if (nativeWakeLock()) {
            if (this._wakeLock) {
                this._wakeLock.release();
            }
            this._wakeLock = undefined;
        } else if (oldIOS()) {
            if (this.noSleepTimer) {
                console.warn(`
          NoSleep now disabled for older iOS devices.
        `);
                window.clearInterval(this.noSleepTimer);
                this.noSleepTimer = undefined;
            }
        } else if (this.noSleepVideo) {
            this.noSleepVideo.pause();
        }
        this.enabled = false;
    }
}

export default NoSleep;
