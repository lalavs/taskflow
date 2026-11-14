import { render } from '@testing-library/react';

import { KanbanIcon } from '@/components/ui/KanbanIcon';

describe('KanbanIcon', () => {
  it('renders an svg with the requested size and classes', () => {
    const { container } = render(<KanbanIcon className="shrink-0" />);

    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveClass('shrink-0');
    expect(svg?.querySelectorAll('rect')).toHaveLength(4);
  });
});
