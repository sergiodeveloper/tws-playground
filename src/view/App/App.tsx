import './App.css'
import Footer from '../Footer/Footer'
import Heading from '../Heading/Heading'
import { useCallback, useEffect, useState } from 'react'
import Operations from '../Operations/Operations'
import Result from '../Result/Result'
import { renderMarkdown, replaceUnacceptedHtmlTags, Value } from '../../utils'
import { InputTypeDefinition } from '@tws-js/common'
import Loader from '../../component/Loader/Loader'


function App(props: {
  appName: string;
  logoPath: string;
  schemaPath: string;
  serverPath: string;
  makeHttpRequest: (request: {
    url: string;
    method: 'POST' | 'GET';
    body: string | undefined;
    headers: Record<string, string>;
  }) => Promise<{ status: number; body: string }>;
}) {
  const { appName, logoPath, schemaPath, serverPath, makeHttpRequest } = props;

  const [resultPanelVisible, setResultPanelVisible] = useState(false);

  const [operationLoading, setOperationLoading] = useState(false);

  const [loadingSchema, setLoadingSchema] = useState(true);

  const [operations, setOperations] = useState<Record<string, {
    title?: string;
    description?: string;
    input: InputTypeDefinition;
    output: InputTypeDefinition;
  }>>({});

  const [initialOperation, setInitialOperation] = useState('');

  const [schemaError, setSchemaError] = useState('');

  const [operationResult, setOperationResult] = useState<{
    data?: unknown;
    error?: string;
  }>();

  useEffect(() => {
    setResultPanelVisible(false);

    async function loadSchema() {
      const schemaString = await makeHttpRequest({
        url: schemaPath,
        method: 'GET',
        body: undefined,
        headers: {},
      });

      if (schemaString.status < 200 || schemaString.status >= 300) {
        const message = await renderMarkdown(
          'Error while trying to load schema ' +
          'from the server 😕 (' + schemaPath + ')\n\n' +
          '```' + schemaString.body + '```'
        )

        setSchemaError(message);

        setLoadingSchema(false);
        return;
      }

      let schema: {
        operations: Record<string, {
          title?: string;
          description?: string;
          input: InputTypeDefinition;
          output: InputTypeDefinition;
        }>;
      };

      try {
        schema = JSON.parse(schemaString.body);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setSchemaError(
          'Error while trying to parse schema from the server 😕 (' + schemaPath + ')\n\n' +
          '```' + schemaString.body + '```'
        );

        setLoadingSchema(false);
        return;
      }

      for (const operation of Object.values(schema.operations)) {
        operation.description = await renderMarkdown(
          replaceUnacceptedHtmlTags(operation.description || '').trim()
        );
      }

      setOperations(schema.operations);

      setLoadingSchema(false);

      const initialOperation = window.location.hash.replace('#', '').match(/^[a-zA-Z0-9_]+/);

      if (initialOperation?.[0] && schema.operations[initialOperation[0]]) {
        setInitialOperation(initialOperation[0]);
      } else {
        setInitialOperation(Object.keys(schema.operations)[0]);
      }
    }

    loadSchema();
  }, [schemaPath, makeHttpRequest]);

  const requestApi = useCallback(async (options: {
    operation: string;
    input: Record<string, Value>;
    headers: { [key: string]: string };
  }) => {
    setResultPanelVisible(false);
    setOperationLoading(true);

    const response = await makeHttpRequest({
      url: serverPath,
      method: 'POST',
      body: JSON.stringify({
        operation: options.operation,
        input: Object.fromEntries(
          Object.entries(options.input).map(([key, value]) => [key, value?.getNativeValue()]),
        ),
      }),
      headers: options.headers,
    });

    const parsedResponse: {
      data?: unknown;
      error?: string;
    } = JSON.parse(response.body);

    setOperationResult(parsedResponse);

    setOperationLoading(false);

    setResultPanelVisible(true);
  }, [serverPath, makeHttpRequest]);

  const onOperationChange = useCallback((operation: string) => {
    setResultPanelVisible(false);
    window.location.hash = `#${operation}`;
  }, []);

  return (
    <div className="app-root">
      <div className="body-root">
        <Heading appName={appName} logoPath={logoPath} />

        {loadingSchema ? (
          <div className="app-loading-schema">
            <Loader color="black" size={25} />
            <span>Loading schema...</span>
          </div>
        ) : (
          schemaError ? (
            <div
              className="app-schema-error"
              dangerouslySetInnerHTML={{ __html: schemaError }}
            />
          ) : (
            <>
              <div
                className={resultPanelVisible ? 'cover-visible cover' : 'cover'}
                onClick={() => setResultPanelVisible(previous => !previous)}
                onTouchStart={() => setResultPanelVisible(previous => !previous)}
              ></div>

              <div className="panels">
                <div className={resultPanelVisible ? 'showing-results operations-panel' : 'operations-panel'}>
                  <div className="scrollable">
                    <div className="app-operations">
                      {
                        Object.keys(operations).length > 0 ? (
                          <Operations
                            operations={operations}
                            onOperationChange={onOperationChange}
                            initialOperation={initialOperation}
                            loading={operationLoading}
                            onSubmit={(options) => {
                              requestApi(options);
                            }}
                          />
                        ) : (
                          <div>No operations found</div>
                        )}
                    </div>
                  </div>
                </div>

                <div className={resultPanelVisible ? 'result-panel-visible result-panel' : 'result-panel'}>
                  <button
                    className="pull-tab"
                    onClick={() => setResultPanelVisible(previous => !previous)}
                  >
                    <div className="pull-tab-line"></div>
                    <div className="pull-tab-line"></div>
                  </button>
                  <div className="result-scrollable">
                    <div className="result-content">
                      {operationResult?.error ? (
                        <div className="result-error">{operationResult.error}</div>
                      ) : (
                        <Result
                          text={JSON.stringify(operationResult?.data, null, 2)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>

      <Footer />
    </div>
  )
}

export default App
