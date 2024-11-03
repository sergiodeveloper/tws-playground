import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './view/App/App.tsx'
import { makeHttpRequest } from './utils.tsx'

window.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App
        appName={
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.TWS_APP_NAME ? `${window.TWS_APP_NAME} - TWS Playground` : 'TWS Playground'
        }
        logoPath='https://www.unpkg.com/@tws-js/playground@1.1.0/dist/favicon.png'
        schemaPath={
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.TWS_SCHEMA_PATH || '/tws/schema'
        }
        serverPath={
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.TWS_SERVER_PATH || '/tws'
        }
        makeHttpRequest={makeHttpRequest}
      />
    </StrictMode>
  )
})
