import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import BooleanInput from './BooleanInput';
import { BooleanValue } from '../../utils';

const meta = {
  title: 'Component/BooleanInput',
  component: BooleanInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof BooleanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValue: new BooleanValue(null),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('checkbox');
    await expect(input).toBeInTheDocument();
    await expect(input).not.toBeChecked();

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: false })
    ));

    await userEvent.click(input);
    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: true })
    );

    await expect(input).toBeChecked();

    await userEvent.click(input);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: false })
    );

    await expect(input).not.toBeChecked();
  }
};

export const Unchecked: Story = {
  args: {
    initialValue: new BooleanValue(false),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('checkbox');
    await expect(input).toBeInTheDocument();
    await expect(input).not.toBeChecked();

    await waitFor(() => expect(meta.args.onChange).not.toHaveBeenCalled());

    await userEvent.click(input);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: true })
    );

    await expect(input).toBeChecked();

    await userEvent.click(input);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: false })
    );

    await expect(input).not.toBeChecked();
  }
};

export const Checked: Story = {
  args: {
    initialValue: new BooleanValue(true),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('checkbox');
    await expect(input).toBeInTheDocument();
    await expect(input).toBeChecked();

    await waitFor(() => expect(meta.args.onChange).not.toHaveBeenCalled());

    await userEvent.click(input);

    await expect(input).not.toBeChecked();

    await userEvent.click(input);

    await expect(input).toBeChecked();
  }
};
