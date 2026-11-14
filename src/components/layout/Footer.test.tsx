import { render, screen } from '@testing-library/react';

import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders the copyright notice', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026 TaskFlow. All rights reserved.')).toBeInTheDocument();
  });
});
