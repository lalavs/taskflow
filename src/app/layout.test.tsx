import { render, screen } from '@testing-library/react';

import RootLayout, { metadata } from '@/app/layout';

jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'font-geist-sans' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' }),
}));

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="session-provider">{children}</div>,
}));

type BodyElement = React.ReactElement<{ className: string; children: React.ReactNode }>;

describe('RootLayout', () => {
  it('wraps the page with fonts and providers', () => {
    const tree = RootLayout({ children: <span>Page content</span> });
    const body = tree.props.children as BodyElement;

    expect(tree.type).toBe('html');
    expect(tree.props.lang).toBe('en');
    expect(body.type).toBe('body');
    expect(body.props.className).toBe('font-geist-sans font-geist-mono antialiased');

    render(body.props.children);

    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
  });

  it('exposes the page metadata', () => {
    expect(metadata.title).toBe('TaskFlow - Manage Projects Visually');
    expect(metadata.description).toContain('Kanban boards');
  });
});
