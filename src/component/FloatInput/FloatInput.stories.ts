import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import FloatInput from './FloatInput';
import { NumberValue } from '../../utils';

const meta = {
  title: 'Component/FloatInput',
  component: FloatInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof FloatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValue: new NumberValue(null),
    placeholder: undefined,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, '123.45');

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(input).toHaveValue('123.45'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 123.45 })
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
    placeholder: undefined,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, '123.45');

    const clearButton = canvas.getByRole('button', { name: 'Clear' });

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
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input).toHaveValue('');

    await expect(input).toHaveAttribute('placeholder', 'Enter a number');

    input.focus();

    await expect(input).toHaveValue('');
    await waitFor(() => expect(input).not.toHaveAttribute('placeholder'));

    await userEvent.type(input, '123.45');
    await waitFor(() => expect(input).toHaveValue('123.45'));
    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 123.45 })
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
    placeholder: undefined,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, '-123.45');

    await waitFor(() => expect(input).toHaveValue('-123.45'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: -123.45 })
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
    await userEvent.type(input, '-34.-56');

    await waitFor(() => expect(input).toHaveValue('34.56'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 34.56 })
    ));

    await userEvent.clear(input);
  }
};

export const TwoDots: Story = {
  args: {
    initialValue: new NumberValue(null),
    placeholder: undefined,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, '3.45.67');

    await waitFor(() => expect(input).toHaveValue('345.67'));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 345.67 })
    ));

    await userEvent.clear(input);
  }
};

export const InitialValue: Story = {
  args: {
    initialValue: new NumberValue(123.45),
    placeholder: undefined,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input).toHaveValue('123.45');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 123.45 })
    ));
  }
};

export const InvalidValue: Story = {
  args: {
    initialValue: new NumberValue(5432e30),
    placeholder: undefined,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input).toHaveValue('5.43233');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 5.43233 })
    ));
  }
};
