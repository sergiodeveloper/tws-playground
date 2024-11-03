import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, screen, userEvent, within } from '@storybook/test';

import ObjectInput from './ObjectInput';
import { BooleanValue, NumberValue, StringValue, ObjectValue, ArrayValue } from '../../utils';

const meta = {
  title: 'Component/ObjectInput',
  component: ObjectInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ObjectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValue: new ObjectValue({
      mystring: new StringValue('hello'),
      mynumber: new NumberValue(42),
      myboolean: new BooleanValue(true),
    }),
    definition: {
      type: 'object',
      properties: {
        mystring: {
          type: 'string',
        },
        mynumber: {
          type: 'int',
        },
        myboolean: {
          type: 'boolean',
        },
        myenum: {
          type: 'enum',
          values: {
            a: { title: 'A' },
            b: { title: 'B' },
          },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stringInput = document.querySelectorAll('textarea')[0];
    await expect(stringInput).toBeInTheDocument();

    await expect(stringInput.value).toEqual('hello');

    const label = canvas.getByText('mystring:');

    await expect(label).toBeInTheDocument();

    // click on the checkbox to check the onChange event
    const checkbox = canvas.getByRole('checkbox') as HTMLInputElement;

    await expect(checkbox.checked).toBe(true);

    await userEvent.click(checkbox);

    await expect(checkbox.checked).toBe(false);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          mystring: expect.objectContaining({ value: 'hello' }),
          mynumber: expect.objectContaining({ value: 42 }),
          myboolean: expect.objectContaining({ value: false }),
        },
      }),
    );
  }
};

export const WithObject: Story = {
  args: {
    initialValue: new ObjectValue({
      mynumber: new NumberValue(42),
      myobject: new ObjectValue({
        mystring: new StringValue('hello'),
        myboolean: new BooleanValue(true),
      }),
    }),
    definition: {
      type: 'object',
      properties: {
        mynumber: {
          type: 'int',
        },
        myobject: {
          type: 'object',
          properties: {
            mystring: {
              type: 'string',
            },
            myboolean: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stringInput = document.querySelectorAll('textarea')[0];
    await expect(stringInput).toBeInTheDocument();

    await expect(stringInput.value).toEqual('hello');

    const label = canvas.getByText('mystring:');

    await expect(label).toBeInTheDocument();

    // click on the checkbox to check the onChange event
    const checkbox = canvas.getByRole('checkbox') as HTMLInputElement;

    await expect(checkbox.checked).toBe(true);

    await userEvent.click(checkbox);

    await expect(checkbox.checked).toBe(false);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          mynumber: expect.objectContaining({ value: 42 }),
          myobject: expect.objectContaining({
            value: {
              mystring: expect.objectContaining({ value: 'hello' }),
              myboolean: expect.objectContaining({ value: false }),
            },
          }),
        },
      }),
    );
  }
};

export const Empty: Story = {
  args: {
    initialValue: new ObjectValue(null),
    definition: {
      type: 'object',
      required: false,
      properties: {
        mystring: {
          type: 'string',
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const objectIsNullMessage = canvas.getByText('Object is empty');
    await expect(objectIsNullMessage).toBeInTheDocument();

    // Click on the add button to create the object
    const createObjectButton = canvas.getByRole('button');
    await userEvent.click(createObjectButton);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {},
      }),
    );

    const stringInput = document.querySelectorAll('textarea')[0];
    await expect(stringInput).toBeInTheDocument();

    // Click on the clear button
    const clearButton = canvas.getByRole('button');
    await userEvent.click(clearButton);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: null,
      }),
    );
  }
};

export const WithArray: Story = {
  args: {
    initialValue: new ObjectValue({
      myarray: new ArrayValue([new StringValue('a'), new StringValue('b')]),
    }),
    definition: {
      type: 'object',
      required: false,
      properties: {
        myarray: {
          type: 'array',
          item: {
            type: 'string',
          },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textboxes = await canvas.findAllByRole('textbox');
    await expect(textboxes).toHaveLength(2);

    const field1 = textboxes[0];
    await expect(field1).toHaveValue('a');

    const field2 = textboxes[1];
    await expect(field2).toHaveValue('b');

    // Remove the first item
    const removeButton1 = canvas.getAllByRole('button', { name: 'Remove' })[0];
    await userEvent.click(removeButton1);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          myarray: expect.objectContaining({
            value: [
              expect.objectContaining({ value: 'b' }),
            ],
          }),
        },
      })
    );

    // Remove the last item
    const removeButton2 = canvas.getAllByRole('button', { name: 'Remove' })[0];
    await userEvent.click(removeButton2);

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          myarray: expect.objectContaining({
            value: [],
          }),
        },
      })
    );
  }
};

export const WithoutInitialValue: Story = {
  args: {
    initialValue: new ObjectValue(null),
    definition: {
      type: 'object',
      required: false,
      properties: {
        mystring: {
          type: 'string',
        },
        myint: {
          type: 'int',
        },
        myfloat: {
          type: 'float',
        },
        myboolean: {
          type: 'boolean',
        },
        myenum: {
          type: 'enum',
          values: {
            a: { title: 'A' },
            b: { title: 'B' },
          },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const objectIsNullMessage = canvas.getByText('Object is empty');
    await expect(objectIsNullMessage).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button'));

    const stringInput = document.querySelectorAll('textarea')[0];
    await expect(stringInput).toBeInTheDocument();

    await expect(stringInput.value).toEqual('');

    const intInput = canvas.getByRole('textbox', { name: 'Integer input' }) as HTMLInputElement;
    await expect(intInput).toBeInTheDocument();

    await expect(intInput.value).toEqual('');

    const floatInput = canvas.getByRole('textbox', { name: 'Float input' }) as HTMLInputElement;
    await expect(floatInput).toBeInTheDocument();

    await expect(floatInput.value).toEqual('');

    const booleanCheckbox = canvas.getByRole('checkbox', { name: 'Boolean input' }) as HTMLInputElement;
    await expect(booleanCheckbox).toBeInTheDocument();

    await expect(booleanCheckbox.checked).toBe(false);

    const select = canvas.getByRole('combobox') as HTMLSelectElement;
    await expect(select).toBeInTheDocument();

    await expect(select.value).toEqual('');

    // Remove object
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));

    const objectIsNullMessage2 = canvas.getByText('Object is empty');
    await expect(objectIsNullMessage2).toBeInTheDocument();
  },
};


export const WithUnkownType: Story = {
  args: {
    initialValue: new ObjectValue(null),
    definition: {
      type: 'object',
      properties: {
        mytype: {
          // @ts-expect-error test with unknown type
          type: 'test',
        },
        mystring: {
          type: 'string',
        },
      },
    },
    attributeName: 'myobject',
    removable: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Unknown type:');

    await expect(label).toBeInTheDocument();

    const unknown = screen.getByRole('type-definition');

    await expect(unknown).toBeInTheDocument();

    await expect(unknown).toHaveTextContent('"type": "test"');
  }
};
