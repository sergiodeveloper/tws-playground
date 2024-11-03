import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';

import Input from './Input';
import { NumberValue, ObjectValue } from '../../utils';

const meta = {
  title: 'Component/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInteger: Story = {
  args: {
    definition: {
      type: 'int',
    },
    attributeName: 'myint',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Integer input' });
    await expect(input).toBeInTheDocument();
  }
};

export const WithString: Story = {
  args: {
    definition: {
      type: 'string',
    },
    attributeName: 'mystring',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Text input' });
    await expect(input).toBeInTheDocument();
  }
};

export const WithBoolean: Story = {
  args: {
    definition: {
      type: 'boolean',
    },
    attributeName: 'myboolean:',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('checkbox', { name: 'Boolean input' });
    await expect(input).toBeInTheDocument();

    const label = canvas.getByText('myboolean');
    await expect(label).toBeInTheDocument();

    await expect(input).not.toBeChecked();

    // Click label to toggle checkbox
    await waitFor(() => expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: false })
    ));

    await userEvent.click(label);
    await expect(input).toBeChecked();

    await expect(meta.args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: true })
    );
  }
};

export const BooleanWithDescription: Story = {
  args: {
    definition: {
      type: 'boolean',
      description: 'This is a description',
    },
    attributeName: 'myboolean with a very long name that should wrap around to '
      + 'the next line to make sure that the layout is working correctly',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('checkbox', { name: 'Boolean input' });
    await expect(input).toBeInTheDocument();
  }
};

export const WithEnum: Story = {
  args: {
    definition: {
      type: 'enum',
      values: {
        value1: { title: 'Value 1' },
        value2: { title: 'Value 2' },
      },
    },
    attributeName: 'myenum',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('combobox');
    await expect(input).toBeInTheDocument();
  }
};

export const WithArray: Story = {
  args: {
    definition: {
      type: 'array',
      item: {
        type: 'int',
      },
    },
    attributeName: 'myarray',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = canvas.getByRole('button', { name: 'Add' });

    await userEvent.click(addButton);

    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();
  }
};

export const WithObject: Story = {
  args: {
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
            value1: { title: 'Value 1' },
            value2: { title: 'Value 2' },
          },
        },
      },
    },
    attributeName: 'myobject',
    initialValue: new ObjectValue(null),
    showName: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stringInput = canvas.getByRole('textbox', { name: 'Text input' });
    await expect(stringInput).toBeInTheDocument();

    const numberInput = canvas.getByRole('textbox', { name: 'Integer input' });
    await expect(numberInput).toBeInTheDocument();

    const booleanInput = canvas.getByRole('checkbox', { name: 'Boolean input' });
    await expect(booleanInput).toBeInTheDocument();

    const enumInput = canvas.getByRole('combobox');
    await expect(enumInput).toBeInTheDocument();
  }
};

export const Default: Story = {
  args: {
    definition: {
      type: 'int',
      description: 'This is a description that has a really long text that should wrap around '
        + 'to the next line to make sure that the layout is working correctly',
      title: 'Name of the input field with a long text that should wrap around to the next line '
        + 'to make sure that the layout is working correctly',
      required: false,
    },
    attributeName: 'myint',
    showName: true,
    initialValue: new NumberValue(42),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toBeInTheDocument();

    const optionalLabel = await canvas.findByText('(Optional)');
    await expect(optionalLabel).toBeInTheDocument();

    const nameLabel = await canvas.findByText('Name of the input field with a long text that '
      + 'should wrap around to the next line to make sure that the layout is working correctly:');
    await expect(nameLabel).toBeInTheDocument();
  }
};

export const Required: Story = {
  args: {
    definition: {
      type: 'int',
      title: 'Name of the input field',
      required: true,
    },
    attributeName: 'myint',
    showName: true,
    initialValue: new NumberValue(42),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameLabel = await canvas.findByText('Name of the input field:');
    await expect(nameLabel).toBeInTheDocument();

    const optionalLabel = canvas.queryByText('(Optional)');
    await expect(optionalLabel).not.toBeInTheDocument();

    const clearButton = canvas.queryByRole('button', { name: 'Clear' });
    await expect(clearButton).not.toBeInTheDocument();
  }
};

export const OptionalWithNoDescription: Story = {
  args: {
    definition: {
      type: 'int',
      title: 'Name of the input field',
      required: false,
    },
    attributeName: 'myint',
    showName: true,
    initialValue: new NumberValue(42),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameLabel = await canvas.findByText('Name of the input field:');
    await expect(nameLabel).toBeInTheDocument();

    const optionalLabel = await canvas.findByText('(Optional)');
    await expect(optionalLabel).toBeInTheDocument();
  }
};

export const WithQuestionMark: Story = {
  args: {
    definition: {
      type: 'int',
      title: 'How many items?',
      description: '',
      required: true,
    },
    attributeName: 'myint',
    showName: true,
    initialValue: new NumberValue(42),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameLabel = await canvas.findByText('How many items?');
    await expect(nameLabel).toBeInTheDocument();

    const nameLabelWithColon = canvas.queryByText('How many items?:');
    await expect(nameLabelWithColon).not.toBeInTheDocument();

    const optionalLabel = canvas.queryByText('(Optional)');
    await expect(optionalLabel).not.toBeInTheDocument();
  }
};

export const WithColon: Story = {
  args: {
    definition: {
      type: 'int',
      title: 'How many items:',
      required: true,
    },
    attributeName: 'myint',
    showName: true,
    initialValue: new NumberValue(42),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameLabel = await canvas.findByText('How many items:');
    await expect(nameLabel).toBeInTheDocument();

    const nameLabelWithDoubleColon = canvas.queryByText('How many items::');
    await expect(nameLabelWithDoubleColon).not.toBeInTheDocument();
  }
};

export const FocusOnNameClick: Story = {
  args: {
    definition: {
      type: 'int',
      title: 'Name of the input field',
    },
    attributeName: 'myint',
    showName: true,
    initialValue: new NumberValue(42),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameLabel = await canvas.findByText('Name of the input field:');
    await expect(nameLabel).toBeInTheDocument();

    const input = await canvas.findByRole('textbox');
    await expect(input).not.toHaveFocus();

    await userEvent.click(nameLabel);

    await expect(input).toHaveFocus();
  }
};
