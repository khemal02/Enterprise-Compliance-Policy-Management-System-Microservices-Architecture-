import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login page for unauthenticated users', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /ecpms/i });
  expect(heading).toBeInTheDocument();
});
