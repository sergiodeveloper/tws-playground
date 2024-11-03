import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';

import PrimitiveValueInput from './PrimitiveValueInput';
import { BooleanValue, NumberValue, StringValue } from '../../utils';

const meta = {
  title: 'Component/PrimitiveValueInput',
  component: PrimitiveValueInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof PrimitiveValueInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const String: Story = {
  args: {
    initialValue: new StringValue('hello'),
    definition: {
      type: 'string',
    },
    isSecret: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input.value).toEqual('hello');
  }
};

export const Password: Story = {
  args: {
    initialValue: new StringValue('password'),
    definition: {
      type: 'string',
    },
    isSecret: true,
  },
  play: async () => {
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;

    await expect(input.value).toEqual('password');
  }
};

export const Secret: Story = {
  args: {
    initialValue: new StringValue('secret'),
    definition: {
      type: 'string',
    },
    isSecret: true,
  },
  play: async () => {
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;

    await expect(input.value).toEqual('secret');
  }
};

export const Integer: Story = {
  args: {
    initialValue: new NumberValue(123),
    definition: {
      type: 'int',
    },
    isSecret: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input.value).toEqual('123');
  }
};

export const Float: Story = {
  args: {
    initialValue: new NumberValue(123.45),
    definition: {
      type: 'float',
    },
    isSecret: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input.value).toEqual('123.45');
  }
};

export const Boolean: Story = {
  args: {
    initialValue: new BooleanValue(true),
    definition: {
      type: 'boolean',
    },
    isSecret: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('checkbox') as HTMLInputElement;

    await expect(input.checked).toEqual(true);
  }
};

export const Enum: Story = {
  args: {
    initialValue: new StringValue('value1'),
    definition: {
      type: 'enum',
      values: {
        value1: { title: 'Option 1' },
        value2: { title: 'Option 2' },
      },
    },
    isSecret: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('combobox') as HTMLSelectElement;

    await expect(input).toHaveValue('value1');
  }
};

export const Unknown: Story = {
  args: {
    initialValue: new StringValue('unknown'),
    definition: {
      // @ts-expect-error test with unknown type
      type: 'unknown',
    },
    isSecret: false,
  },
  play: async () => {
    const rootDiv = document.querySelector('.primitive-value-input-root') as HTMLDivElement;

    await expect(rootDiv).toBeInTheDocument();

    await expect(rootDiv.children).toHaveLength(0);
  },
};

export const NonMatchingValue: Story = {
  args: {
    initialValue: new NumberValue(123),
    definition: {
      type: 'string',
    },
    isSecret: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await expect(input.value).toEqual('');
  }
};
