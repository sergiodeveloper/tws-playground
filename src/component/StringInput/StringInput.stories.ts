import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import StringInput from './StringInput';
import { StringValue } from '../../utils';

const meta = {
  title: 'Component/StringInput',
  component: StringInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof StringInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: undefined,
    multiline: false,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();

    await userEvent.type(input, 'a1b2c3d4%$#_àbçdé');

    await waitFor(() => expect(input).toHaveValue('a1b2c3d4%$#_àbçdé'));

    await expect(input).not.toHaveAttribute('type', 'password');

    input.blur();

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'a1b2c3d4%$#_àbçdé' })
    ));

    const clearButton = canvas.getByRole('button', { name: 'Clear' });

    await userEvent.click(clearButton);

    await expect(input).toHaveValue('');

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: '' })
    );

    // Check if input is focused after clear
    await waitFor(() => expect(input).toHaveFocus());
  }
};

export const PreventMultiline: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: undefined,
    multiline: false,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    await expect(input).not.toHaveAttribute('multiline');

    input.focus();

    await userEvent.type(input, 'a{enter}b{enter}c');

    await waitFor(() => expect(input).toHaveValue('abc'));

    input.blur();

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'abc' })
    ));
  }
};

export const Placeholder: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: 'Enter a text',
    multiline: false,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    await expect(input).toHaveAttribute('placeholder', 'Enter a text');

    input.focus();

    await waitFor(() => expect(input).not.toHaveAttribute('placeholder'));

    input.blur();

    await waitFor(() => expect(input).toHaveAttribute('placeholder', 'Enter a text'));
  }
};

export const WithValue: Story = {
  args: {
    initialValue: new StringValue('45^6'),
    placeholder: 'Enter a text',
    multiline: false,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue('45^6'));
  }
};

export const PressEnter: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: undefined,
    multiline: false,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => expect(input).toHaveValue(''));

    await userEvent.type(input, 'a1b2c3d4%$#_àbçdé{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'a1b2c3d4%$#_àbçdé' })
    ));

    await userEvent.keyboard('{enter}');

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'a1b2c3d4%$#_àbçdé' })
    ));
  }
};

export const Multiline: Story = {
  args: {
    initialValue: new StringValue(null),
    placeholder: undefined,
    multiline: true,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLTextAreaElement;

    await waitFor(() => expect(input).toHaveValue(''));

    await expect(meta.args.onChange).not.toHaveBeenCalled();

    await expect(input.getBoundingClientRect().height).toBeCloseTo(40, 1);

    const string = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15';

    input.focus();

    await userEvent.type(input, string);

    await waitFor(() => expect(input).toHaveValue(string));

    await expect(input.getBoundingClientRect().height).toBeCloseTo(220, 1);

    await expect(meta.args.onChange).not.toHaveBeenCalled();

    // Enter should not trigger onChange in multiline mode

    await userEvent.keyboard('{enter}');
    await expect(meta.args.onChange).not.toHaveBeenCalled();

    input.blur();

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: string + '\n' })
    ));

    // Test shrink

    input.focus();

    for (let i = 0; i < 21; i++) {
      await userEvent.keyboard('{backspace}');
    }

    await waitFor(() => expect(input).toHaveValue('1\n2\n3\n4\n5\n6\n7\n8'));

    await expect(input.getBoundingClientRect().height).toBeCloseTo(180, 1);

    const clearButton = canvas.getByRole('button', { name: 'Clear' });

    await userEvent.click(clearButton);

    await waitFor(() => expect(input).toHaveValue(''));

    await expect(input.getBoundingClientRect().height).toBeCloseTo(40, 1);
  }
};

export const MultipleLinesOnMount: Story = {
  args: {
    initialValue: new StringValue('1\n2\n3\n4\n5'),
    placeholder: undefined,
    multiline: true,
    required: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLTextAreaElement;

    await waitFor(() => expect(input).toHaveValue('1\n2\n3\n4\n5'));

    // Check that the height is correct

    await expect(input.getBoundingClientRect().height).toBeCloseTo(120, 1);
  }
};
