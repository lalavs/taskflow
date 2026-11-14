import { render, screen } from '@testing-library/react';

import { Hero } from '@/app/(landing)/components/Hero';

describe('Hero', () => {
  it('renders the headline and subtitle', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Manage projects visually with TaskFlow');
    expect(screen.getByText(/A simple and powerful project management tool/)).toBeInTheDocument();
  });
});
