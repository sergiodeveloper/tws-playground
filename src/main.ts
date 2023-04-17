import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    appName: 'TWS Playground',
    logoPath: './favicon.png',
    schemaPath: 'http://localhost:3000/tws/schema',
    serverPath: 'http://localhost:3000/tws',
  },
});

export default app;
