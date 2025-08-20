import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders main app without crashing', () => {
  render(<App />);
  expect(screen.getByText(/moduweb/i)).toBeInTheDocument();
});
