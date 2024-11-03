import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import App from './App';
import { makeHttpRequest } from '../../utils';

const meta = {
  title: 'View/App',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const LoggedOut: Story = {};

export const DefaultApp: Story = {
  args: {
    appName: 'TWS Playground',
    logoPath: 'https://www.unpkg.com/@tws-js/playground@1.1.0/dist/favicon.png',
    schemaPath: 'http://0.0.0.0:3000/tws/schema',
    serverPath: 'http://0.0.0.0:3000/tws',
    makeHttpRequest,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for the loading component
    const loader = canvas.getByRole('loader');
    await expect(loader).toBeInTheDocument();

    // Wait for the schema to be loaded
    await waitFor(() => expect(loader).not.toBeInTheDocument());

    // Check if window.location.hash is the first operation (#createProduct)
    await expect(window.location.hash).toBe('#createProduct');

    const headersLabel = canvas.getByRole('button', { name: /Toggle headers/i });
    await expect(headersLabel).toBeInTheDocument();

    const makeAnOrderLabel = canvas.getByRole('option', { name: /Create a product/i });
    await expect(makeAnOrderLabel).toBeInTheDocument();
    await expect(makeAnOrderLabel).toHaveAttribute('value', 'createProduct');

    await expect(window.location.hash).not.toMatch('^#helloWorld');

    // Change operation to say hello world
    const select = canvas.getAllByRole('combobox')[0] as HTMLSelectElement;
    await userEvent.selectOptions(select, 'Say hello world');

    await waitFor(() => expect(select).toHaveValue('helloWorld'));

    // Check if window.location.hash is #helloWorld
    await expect(window.location.hash).toBe('#helloWorld');

    // check if no text inputs are shown
    const textInputs1 = document.querySelectorAll('.root-form-root textarea');
    await expect(textInputs1.length).toBe(0);

    // Change back to create a product
    await userEvent.selectOptions(select, 'Create a product');

    // Check if window.location.hash is #createProduct
    await expect(window.location.hash).toBe('#createProduct');

    // check if text inputs are shown
    const textInputs2 = document.querySelectorAll('.root-form-root textarea');
    await expect(textInputs2.length).toBeGreaterThan(0);
  },
};

export const LoadingSchema: Story = {
  args: {
    appName: 'TWS Playground',
    logoPath: 'https://www.unpkg.com/@tws-js/playground@1.1.0/dist/favicon.png',
    schemaPath: 'http://0.0.0.0:3000/tws/schema',
    serverPath: 'http://0.0.0.0:3000/tws',
    makeHttpRequest: () => {
      return new Promise(() => {
        // Do nothing
      });
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = canvas.getByRole('loader');
    await expect(loader).toBeInTheDocument();
  },
};

export const SchemaError: Story = {
  args: {
    appName: 'TWS Playground',
    logoPath: 'https://www.unpkg.com/@tws-js/playground@1.1.0/dist/favicon.png',
    schemaPath: 'http://0.0.0.0:3000/tws/schema',
    serverPath: 'http://0.0.0.0:3000/tws',
    makeHttpRequest: () => {
      return Promise.resolve({
        status: 500,
        headers: {},
        body: 'Internal Server Error',
      })
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = canvas.getByRole('loader');
    await expect(loader).toBeInTheDocument();
  },
};
