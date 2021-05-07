import {render, screen} from '@testing-library/react';
import App from './App';
import {ctx} from '../index.testFixtures';

test('renders tap', () => {
    // https://github.com/jsdom/jsdom/issues/1695
    if (!window.HTMLElement.prototype.scrollIntoView) {
        window.HTMLElement.prototype.scrollIntoView = () => {
        };
    }

    render(<App ctx={ctx}/>);
    const linkElement = screen.getByText(/Tap/i);
    expect(linkElement).toBeInTheDocument();
});
