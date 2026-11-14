import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AIActions } from '@/app/board/components/AIActions';

describe('AIActions', () => {
  it('renders nothing while the card is not being edited', () => {
    const { container } = render(<AIActions loading={false} isVisible={false} onRun={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens the menu and runs the improve action', async () => {
    const user = userEvent.setup();
    const onRun = jest.fn();
    const { container } = render(<AIActions loading={false} isVisible onRun={onRun} />);

    const toggle = container.querySelector('button');
    if (!toggle) {
      throw new Error('AI menu toggle is missing');
    }

    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: 'Improve' }));

    expect(onRun).toHaveBeenCalledWith('improve');
    expect(screen.queryByRole('button', { name: 'Improve' })).not.toBeInTheDocument();
  });

  it('runs the summary action from the open menu', async () => {
    const user = userEvent.setup();
    const onRun = jest.fn();
    const { container } = render(<AIActions loading={false} isVisible onRun={onRun} />);

    const toggle = container.querySelector('button');
    if (!toggle) {
      throw new Error('AI menu toggle is missing');
    }

    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: 'Summary' }));

    expect(onRun).toHaveBeenCalledWith('summarize');
  });

  it('does not bubble menu clicks to the card', async () => {
    const user = userEvent.setup();
    const onParentClick = jest.fn();

    render(
      <div onClick={onParentClick}>
        <AIActions loading={false} isVisible onRun={jest.fn()} />
      </div>,
    );

    await user.click(screen.getByRole('button'));

    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('shows a spinner instead of the icon while a request is running', () => {
    const { container } = render(<AIActions loading isVisible onRun={jest.fn()} />);

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
