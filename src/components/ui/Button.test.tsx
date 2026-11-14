import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders its children and handles clicks', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('swaps the primary palette for the selected variant only', () => {
    render(<Button variant="secondary">Cancel</Button>);

    const button = screen.getByRole('button', { name: 'Cancel' });

    expect(button).toHaveClass('bg-gray-200');
    expect(button).not.toHaveClass('bg-blue-600');
  });

  it('ignores clicks while disabled', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Sync
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sync' })).toBeDisabled();
  });
});
