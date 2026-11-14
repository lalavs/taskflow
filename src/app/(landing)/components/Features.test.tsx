import { render, screen } from '@testing-library/react';

import { Features } from '@/app/(landing)/components/Features';

describe('Features', () => {
  it('renders every feature card from the list', () => {
    render(<Features />);

    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByText('Kanban Boards')).toBeInTheDocument();
    expect(screen.getByText('Real-time updates')).toBeInTheDocument();
    expect(screen.getByText('Simple workflow')).toBeInTheDocument();
  });
});
