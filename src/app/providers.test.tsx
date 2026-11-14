import { render, screen } from '@testing-library/react';

import { Providers } from '@/app/providers';

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="session-provider">{children}</div>,
}));

describe('Providers', () => {
  it('wraps children with the session provider', () => {
    render(
      <Providers>
        <span>Board</span>
      </Providers>,
    );

    expect(screen.getByTestId('session-provider')).toContainElement(screen.getByText('Board'));
  });
});
