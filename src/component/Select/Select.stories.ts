import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import Select from './Select';
import { StringValue } from '../../utils';

const meta = {
  title: 'Component/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'value1' },
      { label: 'Option 2', value: 'value2' },
    ],
    initialValue: new StringValue(null),
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('combobox') as HTMLSelectElement;
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveValue('');

    await waitFor(() => expect(meta.args.onChange).not.toHaveBeenCalled());

    await userEvent.selectOptions(input, 'value1');

    await expect(input).toHaveValue('value1');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'value1' })
    ));

    input.value = '';
    input.dispatchEvent(new Event('change'));

    await waitFor(() => expect(input).toHaveValue(''));
    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: null })
    );
  }
};

export const InitialValue: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'value1' },
      { label: 'Option 2', value: 'value2' },
    ],
    initialValue: new StringValue('value2'),
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('combobox') as HTMLSelectElement;
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveValue('value2');

    await waitFor(() => expect(meta.args.onChange).not.toHaveBeenCalled());

    await userEvent.selectOptions(input, 'value1');

    await expect(input).toHaveValue('value1');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'value1' })
    ));

    await userEvent.selectOptions(input, 'value2');

    expect(input).toHaveValue('value2');
  }
};

export const InvalidInitialValue: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'value1' },
      { label: 'Option 2', value: 'value2' },
    ],
    initialValue: new StringValue('value3'),
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('combobox') as HTMLSelectElement;

    await expect(input).toBeInTheDocument();

    await expect(input).toHaveValue('');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: null })
    ));

    await userEvent.selectOptions(input, 'value1');

    await expect(input).toHaveValue('value1');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'value1' })
    ));

    input.value = '';

    await waitFor(() => expect(input).toHaveValue(''));

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: null })
    ));
  }
};

export const NotRequired: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'value1' },
      { label: 'Option 2', value: 'value2' },
    ],
    initialValue: new StringValue(null),
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('combobox') as HTMLSelectElement;
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveValue('');

    await waitFor(() => expect(meta.args.onChange).not.toHaveBeenCalled());

    await userEvent.selectOptions(input, 'value2');

    await expect(input).toHaveValue('value2');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'value2' })
    ));

    const removeButton = canvas.getByRole('button');
    await expect(removeButton).toBeInTheDocument();

    await userEvent.click(removeButton);

    await expect(input).toHaveValue('');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: null })
    ));
  }
};
