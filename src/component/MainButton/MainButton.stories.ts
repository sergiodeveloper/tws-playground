import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';

import MainButton from './MainButton';

const meta = {
  title: 'Component/MainButton',
  component: MainButton,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onClick: fn()
  },
} satisfies Meta<typeof MainButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Button',
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button');

    button.click();

    await expect(meta.args.onClick).toHaveBeenCalled();
  }
};

export const Loading: Story = {
  args: {
    text: 'Button',
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button');

    await expect(button).toContainHTML('class="loader"');

    button.click();

    await expect(meta.args.onClick).not.toHaveBeenCalled();
  }
};
