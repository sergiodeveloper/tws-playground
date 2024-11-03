import type { Meta, StoryObj } from '@storybook/react';

import Heading from './Heading';
import { expect, within } from '@storybook/test';

const meta = {
  title: 'View/Heading',
  component: Heading,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appName: 'App Name',
    logoPath: 'https://via.placeholder.com/150',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const logo = canvas.getByRole('img') as HTMLImageElement;

    await expect(logo).toBeInTheDocument();

    const title = canvas.getByText('App Name') as HTMLElement;

    await expect(title).toBeInTheDocument();
  }
};

// export const LoggedOut: Story = {};
