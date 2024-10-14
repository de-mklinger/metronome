// Originally taken from https://github.com/richtr/NoSleep.js
// MIT license

import { webm, mp4 } from "./no-sleep-media.js";

export type NoSleepMode = "auto" | "native" | "video";

export function isNoSleepMode(x: unknown): x is NoSleepMode {
  return x === "auto" || x === "native" || x === "video";
}

export type NoSleepOpts = {
  title?: string;
  mode?: NoSleepMode;
};

export const nativeWakeLockSupported = () => "wakeLock" in navigator;

interface INoSleep {
  isEnabled(): boolean;

  enable(): Promise<void>;

  disable(): Promise<void>;
}

class NoSleep implements INoSleep {
  private readonly delegate: INoSleep;

  constructor(opts: NoSleepOpts) {
    if (
      opts.mode === "native" ||
      (opts.mode === "auto" && nativeWakeLockSupported())
    ) {
      this.delegate = new NoSleepNativeWakeLock();
    } else {
      this.delegate = new NoSleepVideo(opts.title ?? "No Sleep");
    }
  }

  isEnabled() {
    return this.delegate.isEnabled();
  }

  async enable() {
    return this.delegate.enable();
  }

  async disable() {
    return this.delegate.disable();
  }
}

class NoSleepNativeWakeLock implements INoSleep {
  private wakeLock: WakeLockSentinel | undefined = undefined;

  constructor() {
    console.log("Initializing NoSleepNativeWakeLock");

    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "visible" && !this.isEnabled()) {
    //     this.enable();
    //   }
    // };
    // document.addEventListener("visibilitychange", handleVisibilityChange);
    // document.addEventListener("fullscreenchange", handleVisibilityChange);
  }

  isEnabled(): boolean {
    return this.wakeLock !== undefined;
  }

  async enable(): Promise<void> {
    if (this.wakeLock !== undefined) {
      console.warn("Wake Lock is already enabled.");
      return;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request("screen");
      this.wakeLock.addEventListener("release", () => {
        this.wakeLock = undefined;
        //console.log("Wake Lock released.");
      });
    } catch (error: unknown) {
      this.wakeLock = undefined;
      console.error("Error requesting Wake Lock", error);
      throw error;
    }
  }

  async disable(): Promise<void> {
    if (this.wakeLock === undefined) {
      console.warn("Wake Lock is not enabled.");
      return;
    }

    try {
      await this.wakeLock.release();
    } catch (error: unknown) {
      this.wakeLock = undefined;
      console.error("Error releasing Wake Lock", error);
      throw error;
    }
  }
}

class NoSleepVideo implements INoSleep {
  private readonly noSleepVideo: HTMLVideoElement;

  constructor(title: string) {
    console.log("Initializing NoSleepVideo");

    const noSleepVideo = document.createElement("video");

    noSleepVideo.setAttribute("title", title);
    noSleepVideo.setAttribute("playsinline", "");
    noSleepVideo.setAttribute("loop", "");

    this.addSourceToVideo(noSleepVideo, "webm", webm);
    this.addSourceToVideo(noSleepVideo, "mp4", mp4);

    // noSleepVideo.addEventListener("loadedmetadata", () => {
    //   if (noSleepVideo.duration <= 1) {
    //     // webm source
    //     noSleepVideo.setAttribute("loop", "");
    //   } else {
    //     // mp4 source
    //     noSleepVideo.addEventListener("timeupdate", () => {
    //       if (noSleepVideo.currentTime > 0.5) {
    //         noSleepVideo.currentTime = Math.random() / 2;
    //       }
    //     });
    //   }
    // });

    this.noSleepVideo = noSleepVideo;
  }

  private addSourceToVideo(
    element: HTMLVideoElement,
    type: string,
    dataURI: string,
  ) {
    const source = document.createElement("source");
    source.src = dataURI;
    source.type = `video/${type}`;
    element.appendChild(source);
  }

  isEnabled(): boolean {
    return !this.noSleepVideo.paused;
  }

  async enable(): Promise<void> {
    if (this.isEnabled()) {
      console.warn("Wake Lock is already enabled.");
      return;
    }

    try {
      await this.noSleepVideo.play();
    } catch (error: unknown) {
      console.error("Error starting no-sleep video", error);
      throw error;
    }
  }

  async disable(): Promise<void> {
    try {
      this.noSleepVideo.pause();
    } catch (error: unknown) {
      console.error("Error pausing no-sleep video", error);
      throw error;
    }
  }
}

export default NoSleep;
