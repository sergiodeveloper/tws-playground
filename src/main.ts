import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    appName: 'TWS Playground',
    logoPath: 'https://www.unpkg.com/@tws-js/playground@0.1.1/dist/favicon.png',
    schemaPath:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.TWS_SCHEMA_PATH || '/tws/schema',
    serverPath:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.TWS_SERVER_PATH || '/tws',
  },
});

export default app;
