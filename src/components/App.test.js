import {render, screen} from '@testing-library/react';
import App from './App';

test('renders tap', async () => {
    // https://github.com/jsdom/jsdom/issues/1695
    if (!window.HTMLElement.prototype.scrollIntoView) {
        window.HTMLElement.prototype.scrollIntoView = () => {
        };
    }

    render(<App/>);

    const linkElement = await screen.findByText(/Tap/i);

    expect(linkElement).toBeInTheDocument();
});
