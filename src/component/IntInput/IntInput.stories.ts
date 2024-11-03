import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import IntInput from './IntInput';
import { NumberValue } from '../../utils';

const meta = {
  title: 'Component/IntInput',
  component: IntInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof IntInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValue: new NumberValue(null),
    required: false,
    placeholder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, '12345');

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(input).toHaveValue('12345'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 12345 })
    ));

    await userEvent.clear(input);

    await userEvent.keyboard('{enter}');

    await expect(input).toHaveValue('');

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: null })
    ));
  }
};

export const ClearButton: Story = {
  args: {
    initialValue: new NumberValue(null),
    required: false,
    placeholder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    const clearButton = canvas.getByRole('button', { name: 'Clear' });

    await userEvent.type(input, '12345');

    await expect(input).toHaveValue('12345');

    await userEvent.click(clearButton);

    await expect(input).toHaveValue('');

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: null })
    );

    await expect(input).toHaveFocus();
  }
};

export const Placeholder: Story = {
  args: {
    placeholder: 'Enter a number',
    initialValue: new NumberValue(null),
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input).toHaveValue('');

    await expect(input).toHaveAttribute('placeholder', 'Enter a number');

    input.focus();

    await expect(input).toHaveValue('');
    await waitFor(() => expect(input).not.toHaveAttribute('placeholder'));

    await userEvent.type(input, '0123');
    await waitFor(() => expect(input).toHaveValue('0123'));
    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 123 })
    );

    await userEvent.clear(input);

    input.blur();

    await expect(input).toHaveValue('');

    await expect(input).toHaveAttribute('placeholder', 'Enter a number');
  }
};

export const Negative: Story = {
  args: {
    initialValue: new NumberValue(null),
    required: true,
    placeholder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, '-234');

    await waitFor(() => expect(input).toHaveValue('-234'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: -234 })
    ));

    await userEvent.clear(input);

    input.focus();

    await userEvent.type(input, '-');

    await waitFor(() => expect(input).toHaveValue('-'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(input).toHaveValue('0'));

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 0 })
    ));

    input.focus();

    await userEvent.clear(input);
    await userEvent.type(input, '-24-68');

    await waitFor(() => expect(input).toHaveValue('2468'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 2468 })
    ));

    await userEvent.clear(input);
  }
};

export const EliminateLetters: Story = {
  args: {
    initialValue: new NumberValue(null),
    required: true,
    placeholder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, 'a1b2c3d4e5');

    await waitFor(() => expect(input).toHaveValue('12345'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 12345 })
    ));

    await userEvent.clear(input);
  }
};

export const InitialValue: Story = {
  args: {
    initialValue: new NumberValue(200),
    required: false,
    placeholder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input).toHaveValue('200');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 200 })
    ));
  }
};

export const InvalidInitialValue: Story = {
  args: {
    initialValue: new NumberValue(2052.4567e1),
    required: false,
    placeholder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input).toHaveValue('20524');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 20524 })
    ));
  }
};
