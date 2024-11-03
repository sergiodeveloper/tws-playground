import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import ClearButton from './ClearButton';

const meta = {
  title: 'Component/ClearButton',
  component: ClearButton,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onClick: fn()
  },
} satisfies Meta<typeof ClearButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Clear' });

    await userEvent.click(button);

    await waitFor(() => expect(meta.args.onClick).toHaveBeenCalled());

    button.blur();
  }
};
