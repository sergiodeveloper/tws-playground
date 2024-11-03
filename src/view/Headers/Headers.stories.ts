import type { Meta, StoryObj } from '@storybook/react';

import Headers from './Headers';
import { expect, fn, userEvent, within } from '@storybook/test';

const meta = {
  title: 'View/Headers',
  component: Headers,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Headers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Toggle headers' });
    await userEvent.click(button);

    // Check if the key field contains "Authorization"
    const keyField = document.querySelector('.headers-header-key textarea');
	  await expect(keyField).toHaveValue('Authorization');

    // Check if the value field contains "Bearer ..."
    const valueField = document.querySelector('.headers-header-value textarea');
    await expect(valueField).toHaveValue('');

    // Type a value
    const valueInput = document.querySelector('.headers-header-value textarea') as HTMLTextAreaElement;
    await userEvent.type(valueInput, 'Bearer token');

    valueInput.blur();

    await expect(keyField).toHaveValue('Authorization');
    await expect(valueField).toHaveValue('Bearer token');

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        Authorization: 'Bearer token'
      }),
    );

    // Add a new header
    const addButton = await canvas.findByRole('button', { name: 'Add' });
    await userEvent.click(addButton);

    const headerKeyFields = document.querySelectorAll('.headers-header-key textarea');
    await expect(headerKeyFields.length).toBe(2);

    await userEvent.type(headerKeyFields[1], 'testHeader');

    const headerValueFields = document.querySelectorAll('.headers-header-value textarea') as
      NodeListOf<HTMLTextAreaElement>;
    await expect(headerValueFields.length).toBe(2);

    await userEvent.type(headerValueFields[1], 'testValue');

    headerValueFields[1].blur();

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        Authorization: 'Bearer token',
        testHeader: 'testValue',
      }),
    );
  }
};
