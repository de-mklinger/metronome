import { act, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App.js";
import { storeAppState } from "../lib/app-state-storage.ts";
import { defaultConfig, defaultSong } from "../lib/env.ts";
import { messages } from "../lang/i18n.ts";

function setLocale(locale: "de" | "en") {
  storeAppState({
    config: {
      ...defaultConfig,
      locale,
    },
    song: { ...defaultSong },
  });
}

function prepareMocks() {
  // https://github.com/jsdom/jsdom/issues/1695
  window.HTMLElement.prototype.scrollIntoView = () => {};

  window.HTMLMediaElement.prototype.pause = () => {};

  window.HTMLMediaElement.prototype.play = () => Promise.resolve();

  function AudioContext() {}

  // @ts-expect-error Mock AudioContext is of wrong type
  window.AudioContext = AudioContext;
}

test("renders de", async () => {
  setLocale("de");
  prepareMocks();

  render(<App />);

  const el = await screen.findByText(messages.de["splash.line1"]);
  expect(el).toBeInTheDocument();
});

test("renders en", async () => {
  setLocale("en");
  prepareMocks();

  render(<App />);

  const el = await screen.findByText(messages.en["splash.line1"]);
  expect(el).toBeInTheDocument();
});

test("renders tap", async () => {
  setLocale("en");
  prepareMocks();

  render(<App />);

  const splashHeading = await screen.findByText(/Welcome/i);
  expect(splashHeading).toBeInTheDocument();

  act(() => {
    splashHeading.click();
  });

  const linkElement = await screen.findByText(/Tap/i);
  expect(linkElement).toBeInTheDocument();
});
