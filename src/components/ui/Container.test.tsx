import { render, screen } from '@testing-library/react';

import { Container } from '@/components/ui/Container';

describe('Container', () => {
  it('renders children inside the base layout classes', () => {
    render(<Container>Board content</Container>);

    const container = screen.getByText('Board content');

    expect(container).toHaveClass('mx-auto', 'max-w-7xl', 'px-4', 'sm:px-6');
  });

  it('merges extra classes with the defaults', () => {
    render(<Container className="max-w-3xl">Narrow</Container>);

    expect(screen.getByText('Narrow')).toHaveClass('mx-auto', 'max-w-3xl');
  });
});
