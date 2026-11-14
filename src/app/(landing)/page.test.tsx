import { render, screen } from '@testing-library/react';

import HomePage from '@/app/(landing)/page';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated', update: jest.fn() }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe('HomePage', () => {
  it('composes the landing page from its sections', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Manage projects visually with TaskFlow');
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument();
    expect(screen.getByText('© 2026 TaskFlow. All rights reserved.')).toBeInTheDocument();
  });
});
