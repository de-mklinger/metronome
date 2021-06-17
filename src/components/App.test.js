import {render, screen} from '@testing-library/react';
import App from './App';

test('renders tap', async () => {
    // https://github.com/jsdom/jsdom/issues/1695
    window.HTMLElement.prototype.scrollIntoView = () => {
    };

    window.HTMLMediaElement.prototype.pause = () => {
    };

    render(<App/>);

    const linkElement = await screen.findByText(/Tap/i);

    expect(linkElement).toBeInTheDocument();
});
