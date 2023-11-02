import {render, screen} from '@testing-library/react';
import {expect, test} from "vitest"
import App from './App.js';

test('renders tap', async () => {
    // https://github.com/jsdom/jsdom/issues/1695
    window.HTMLElement.prototype.scrollIntoView = () => {
    };

    window.HTMLMediaElement.prototype.pause = () => {
    };

    window.HTMLMediaElement.prototype.play = () => Promise.resolve();

    function AudioContext() {}
    // @ts-ignore
    window.AudioContext = AudioContext;

    render(<App/>);

    const startButton = await screen.findByText(/Open Metronome/i);
    expect(startButton).toBeInTheDocument();

    startButton.click();

    const linkElement = await screen.findByText(/Tap/i);
    expect(linkElement).toBeInTheDocument();
});
