import { render, screen } from '@testing-library/react';

import { Logo } from '@/components/ui/Logo';

describe('Logo', () => {
  it('renders the brand name with its icon', () => {
    const { container } = render(<Logo />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
