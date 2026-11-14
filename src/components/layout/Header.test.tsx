import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Header } from '@/components/layout/Header';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <span role="img" aria-label={alt} data-src={src} />,
}));

const mockedUseSession = jest.mocked(useSession);
const mockedSignIn = jest.mocked(signIn);
const mockedSignOut = jest.mocked(signOut);

describe('Header', () => {
  it('offers Google login to guests', async () => {
    const user = userEvent.setup();
    mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated', update: jest.fn() });

    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockedSignIn).toHaveBeenCalledWith('google');
  });

  it('shows the signed-in user and lets them log out', async () => {
    const user = userEvent.setup();
    mockedUseSession.mockReturnValue({
      data: {
        user: { id: 'user-1', name: 'Ada', email: 'ada@example.com', image: 'https://lh3.googleusercontent.com/avatar.png' },
        expires: '2099-01-01',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'avatar' })).toHaveAttribute('data-src', 'https://lh3.googleusercontent.com/avatar.png');
    expect(screen.getByRole('link', { name: 'Get to board' })).toHaveAttribute('href', '/board');

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockedSignOut).toHaveBeenCalledTimes(1);
  });

  it('falls back to the default avatar when the session has no picture', () => {
    mockedUseSession.mockReturnValue({
      data: { user: { id: 'user-2', name: 'Bob', email: 'bob@example.com', image: null }, expires: '2099-01-01' },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByRole('img', { name: 'avatar' })).toHaveAttribute('data-src', '/icons/default-avatar.png');
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
