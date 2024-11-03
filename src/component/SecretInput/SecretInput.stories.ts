import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import SecretInput from './SecretInput';
import { StringValue } from '../../utils';

const meta = {
  title: 'Component/SecretInput',
  component: SecretInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof SecretInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: 'Enter a secret',
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter a secret') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();

    await userEvent.type(input, 'a1b2c3d4%$#_àbçdé');

    await waitFor(() => expect(input).toHaveValue('a1b2c3d4%$#_àbçdé'));

    await expect(input).toHaveAttribute('type', 'password');

    input.blur();

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'a1b2c3d4%$#_àbçdé' })
    ));

    await userEvent.clear(input);

    await waitFor(() => expect(input).toHaveValue(''));
  }
};

export const ClearButton: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: 'Enter a secret',
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter a secret') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();

    await userEvent.type(input, 'a1b2c3d4%$#_àbçdé');

    await waitFor(() => expect(input).toHaveValue('a1b2c3d4%$#_àbçdé'));

    const clearButton = canvas.getByRole('button');

    await userEvent.click(clearButton);

    await waitFor(() => expect(input).toHaveValue(''));

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: '' })
    );

    await expect(input).toHaveFocus();
  }
};

export const Placeholder: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: 'Enter a secret',
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter a secret') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    await expect(input).toHaveAttribute('placeholder', 'Enter a secret');

    input.focus();

    await waitFor(() => expect(input).not.toHaveAttribute('placeholder'));

    input.blur();

    await waitFor(() => expect(input).toHaveAttribute('placeholder', 'Enter a secret'));
  }
};

export const WithValue: Story = {
  args: {
    initialValue: new StringValue('4*5^6'),
    placeholder: 'Enter a secret',
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter a secret') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue('4*5^6'));

    // Check that the clear button does not exist
    const clearButton = canvas.queryByRole('button');
    await expect(clearButton).toBeNull();
  }
};

export const PressEnter: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: 'Enter a secret',
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter a secret') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();

    await userEvent.type(input, 'a1b2c3d4%$#_àbçdé');

    await waitFor(() => expect(input).toHaveValue('a1b2c3d4%$#_àbçdé'));

    await waitFor(() => expect(meta.args.onChange).not.toHaveBeenCalled());

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'a1b2c3d4%$#_àbçdé' })
    ));
  }
};
