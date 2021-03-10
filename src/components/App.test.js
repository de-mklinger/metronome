import { render, screen } from '@testing-library/react';
import App from './App';
import { ctx } from '../index.testFixtures';

test('renders tap', () => {
  render(<App ctx={ctx} />);
  const linkElement = screen.getByText(/Tap/i);
  expect(linkElement).toBeInTheDocument();
});
