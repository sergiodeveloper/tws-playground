import type { Meta, StoryObj } from '@storybook/react';

import Operations from './Operations';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

const meta = {
  title: 'View/Operations',
  component: Operations,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSubmit: fn(),
    onOperationChange: fn(),
  },
} satisfies Meta<typeof Operations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    initialOperation: 'testOperation',
    operations: {
      testOperation: {
        title: 'Test operation',
        description: 'This is a test operation',
        input: {
        },
        output: {
        }
      },
      helloWorld: {
        title: 'Say hello world',
        description: 'Say hello to the world',
        input: {
          name: {
            type: 'string',
            required: true,
            title: 'Name',
            description: 'The name of the person',
          },
        },
        output: {
          result: {
            type: 'string',
          }
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if the combobox has an operation selected
    const makeAnOrderLabel = canvas.getByRole('option', { name: /Test operation/i });
    await expect(makeAnOrderLabel).toBeInTheDocument();
    await expect(makeAnOrderLabel).toHaveAttribute('value', 'testOperation');

    const createProductLabel = canvas.getByText(
      "This is a test operation"
    );
    await expect(createProductLabel).toBeInTheDocument();

    // Check if there are no text inputs
    const textInput1 = document.querySelectorAll('.root-form-root textarea');
    await expect(textInput1.length).toBe(0);

    // Change the selected operation
    const select = canvas.getAllByRole('combobox')[0] as HTMLSelectElement;
    await userEvent.selectOptions(select, 'Say hello world');

    await expect(meta.args.onOperationChange).toHaveBeenCalledWith('helloWorld');

    await waitFor(() => expect(select).toHaveValue('helloWorld'));

    const helloWorldLabel = canvas.getByText('Say hello to the world');
    await expect(helloWorldLabel).toBeInTheDocument();

    // Check if there are no text inputs
    const textInput2 = document.querySelectorAll('.root-form-root textarea');
    await expect(textInput2.length).toBe(1);
  }
};

export const Loading: Story = {
  args: {
    loading: true,
    initialOperation: 'testOperation',
    operations: {
      testOperation: {
        title: 'Test operation',
        description: 'This is a test operation',
        input: {
        },
        output: {
        }
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loader = canvas.getByRole('loader');
    await expect(loader).toBeInTheDocument();
  }
}
