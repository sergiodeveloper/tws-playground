
import { useEffect, useState } from 'react';
import Headers from '../Headers/Headers';
import './Operations.css'
import Select from '../../component/Select/Select';
import RootForm from '../RootForm/RootForm';
import MainButton from '../../component/MainButton/MainButton';
import { StringValue, Value } from '../../utils';
import { InputTypeDefinition } from '@tws-js/common';

function Operations(props: {
  operations: Record<string, {
    title?: string;
    description?: string;
    input: InputTypeDefinition;
    output: InputTypeDefinition;
  }>;
  onOperationChange: (operation: string) => void;
  initialOperation: string;
  loading: boolean;
  onSubmit: (options: {
    operation: string;
    input: Record<string, Value>;
    headers: { [key: string]: string };
  }) => void;
}) {
  const { onOperationChange } = props;

  const operations = Object.entries(props.operations).map(([key, operation]) => ({
    label: operation.title || key,
    value: key,
    operation,
  }));

  const [headers, setHeaders] = useState<{ [key: string]: string }>({});

  const [input, setInput] = useState<Record<string, Value>>({});

  const [selectedOperation, setSelectedOperation] = useState<string>(props.initialOperation);

  const [inputDefinition, setInputDefinition] = useState<InputTypeDefinition>(
    props.operations[selectedOperation].input
  );

  useEffect(() => {
    onOperationChange(selectedOperation);
  }, [selectedOperation, onOperationChange]);

  return (
    <div className="operations-root">
      <div className="operations-form-root">
        <Headers onChange={(headers) => setHeaders(headers)} />

        <div className="operation-selector">
          <Select
            options={operations}
            onChange={(operation) => {
              if (!operation.value) {
                return;
              }

              const operationOption = props.operations[operation.value];

              setSelectedOperation(operation.value);
              setInputDefinition(operationOption.input);
            }}
            initialValue={new StringValue(selectedOperation)}
            required={true}
          />
        </div>

        <div
          className="operations-description markdown"
          dangerouslySetInnerHTML={{
            __html: props.operations[selectedOperation].description || '',
          }}
        />

        <div className="text-center">
          <RootForm
            key={selectedOperation}
            inputDefinition={inputDefinition}
            onChange={(value) => setInput(value)}
          />

          <div className="submit-area">
            <MainButton
              text="Submit"
              onClick={() => {
                props.onSubmit({
                  operation: selectedOperation,
                  input: { ...input },
                  headers: { ...headers },
                });
              }}
              loading={props.loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Operations
