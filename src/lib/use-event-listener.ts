/*
 * This is a TypeScript and somehow reduced version of:
 * `@use-it/event-listener` 1.7.1
 */
import { useRef, useEffect } from "react";

type Options = Pick<AddEventListenerOptions, "capture" | "passive" | "once">;

type Handler<EventType> = (event: EventType) => void;

/**
 * A custom React Hook that provides a declarative useEventListener.
 */
export default function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: Handler<HTMLElementEventMap[K]>,
  // allow null to support usage with `useRef <HTMLElement | null>(null)`
  element: HTMLElement | null,
  options?: Options,
): void;

export default function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: Handler<DocumentEventMap[K]>,
  element: Document,
  options?: Options,
): void;

export default function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: Handler<WindowEventMap[K]>,
  element?: Window,
  options?: Options,
): void;

export default function useEventListener(
  eventName: string,
  handler: Handler<unknown>,
  element: HTMLElement | Document | Window | null = window,
  options: Options = {},
) {
  const savedHandler = useRef<Handler<unknown>>();
  const { capture, passive, once } = options;

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) {
      return;
    }

    const eventListener = (event: unknown) =>
      savedHandler.current && savedHandler.current(event);
    const opts = { capture, passive, once };
    element.addEventListener(eventName, eventListener, opts);
    return () => {
      element.removeEventListener(eventName, eventListener, opts);
    };
  }, [eventName, element, capture, passive, once]);
}
