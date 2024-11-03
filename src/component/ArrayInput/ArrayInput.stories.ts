import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from '@storybook/test';

import ArrayInput from './ArrayInput';
import { ArrayValue, StringValue, ObjectValue, NumberValue } from '../../utils';

const meta = {
  title: 'Component/ArrayInput',
  component: ArrayInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ArrayInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        type: 'string',
      },
    },
    initialValue: new ArrayValue([]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();

    const addButton = await canvas.findByRole('button', { name: 'Add' });
    await userEvent.click(addButton);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: [expect.objectContaining({ value: null })],
      }),
    );
  },
};

export const WithInitialValue: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        type: 'string',
      },
    },
    initialValue: new ArrayValue([new StringValue('a'), new StringValue('b')]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textboxes = await canvas.findAllByRole('textbox');
    await expect(textboxes).toHaveLength(2);

    const field1 = textboxes[0];
    await expect(field1).toHaveValue('a');

    const field2 = textboxes[1];
    await expect(field2).toHaveValue('b');
  },
};

export const WithNonRequiredItems: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        type: 'string',
        required: false,
      },
    },
    initialValue: new ArrayValue([new StringValue('a'), new StringValue('b')]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textboxes = await canvas.findAllByRole('textbox');
    await expect(textboxes).toHaveLength(2);

    const field1 = textboxes[0];
    await expect(field1).toHaveValue('a');

    const field2 = textboxes[1];
    await expect(field2).toHaveValue('b');
  },
};

export const WithObject: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        type: 'object',
        required: true,
        properties: {
          name: { type: 'string' },
          price: { type: 'float' },
        },
      },
    },
    initialValue: new ArrayValue([
      new ObjectValue({
        name: new StringValue('Apple'),
        price: new NumberValue(1.5),
      }),
      new ObjectValue({
        name: new StringValue('Banana'),
        price: new NumberValue(2),
      }),
    ]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textboxes = await canvas.findAllByRole('textbox');
    await expect(textboxes).toHaveLength(4);

    const field1 = textboxes[0];
    await expect(field1).toHaveValue('Apple');

    const field2 = textboxes[1];
    await expect(field2).toHaveValue('1.5');

    const field3 = textboxes[2];
    await expect(field3).toHaveValue('Banana');

    const field4 = textboxes[3];
    await expect(field4).toHaveValue('2');
  },
};

export const WithEnums: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        type: 'enum',
        values: {
          a: { title: 'A' },
          b: { title: 'B' },
        }
      },
    },
    initialValue: new ArrayValue([new StringValue('a'), new StringValue('b')]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selects = await canvas.findAllByRole('combobox');
    await expect(selects).toHaveLength(2);

    const select1 = selects[0];
    await expect(select1).toHaveValue('a');

    const select2 = selects[1];
    await expect(select2).toHaveValue('b');
  },
};

export const UnknownItemType: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        // @ts-expect-error test with unknown type
        type: 'unknown',
      },
    },
    initialValue: new ArrayValue([]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText('Unknown type:')).toBeInTheDocument();
  },
};

export const SortItems: Story = {
  args: {
    attributeName: 'myarray',
    definition: {
      type: 'array',
      item: {
        type: 'string',
      },
    },
    initialValue: new ArrayValue([new StringValue('a'), new StringValue('b'), new StringValue('c')]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textboxes = await canvas.findAllByRole('textbox');
    await expect(textboxes).toHaveLength(3);

    const field1 = textboxes[0];
    await expect(field1).toHaveValue('a');

    const field2 = textboxes[1];
    await expect(field2).toHaveValue('b');

    await expect(meta.args.onChange).not.toHaveBeenCalled();

    const draggableHandle1 = (await canvas.findAllByRole('button', { name: 'Drag handle' }))[0];

    await expect(draggableHandle1).toBeInTheDocument();

    await fireEvent.mouseDown(draggableHandle1, {
      clientX: field1.getBoundingClientRect().x,
      clientY: field1.getBoundingClientRect().y + field1.getBoundingClientRect().height / 2,
    });

    await new Promise((r) => setTimeout(r, 500));

    await fireEvent.mouseMove(draggableHandle1, {
      clientX: field2.getBoundingClientRect().x,
      clientY: field2.getBoundingClientRect().y + field2.getBoundingClientRect().height / 2,
    });

    await new Promise((r) => setTimeout(r, 500));

    await fireEvent.mouseUp(draggableHandle1);

    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: [
          expect.objectContaining({ value: 'b' }),
          expect.objectContaining({ value: 'a' }),
          expect.objectContaining({ value: 'c' }),
        ],
      }),
    ));
  },
};
