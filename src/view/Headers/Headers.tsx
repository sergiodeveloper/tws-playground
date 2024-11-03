import { useState } from 'react';
import './Headers.css'
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import AddButton from '../../component/AddButton/AddButton';
import { StringValue } from '../../utils';
import StringInput from '../../component/StringInput/StringInput';
import RemoveButton from '../../component/RemoveButton/RemoveButton';

function Headers(props: {
  onChange: (value: { [key: string]: string }) => void;
}) {
  const { onChange } = props;

  const [headers, setHeaders] = useState<{ key: string, value: string }[]>([
    {
      key: 'Authorization',
      value: ''
    },
  ]);

  const [isExpanded, setExpanded] = useState(false);

  return (
    <div className="headers-root">
      <button
        aria-label="Toggle headers"
        className="headers-title"
        onClick={() => {
          setExpanded((oldIsExpanded) => !oldIsExpanded);
        }}
      >
        <span className="headers-triangle">{isExpanded ? (
          <RiArrowUpSLine size={30} />
        ) : (
          <RiArrowDownSLine size={30} />
        )}</span>
        🔒
      </button>

      <div className={`content ${isExpanded ? 'expanded' : ''}`}>
        {headers.map(({ key, value }, i) => (
          <div className="headers-header" key={i}>
            <div className="headers-header-key">
              <StringInput
                initialValue={new StringValue(key)}
                multiline={false}
                onChange={(value) => {
                  const newHeaders = [...headers];

                  newHeaders[i] = {
                    key: value.value || '',
                    value: newHeaders[i].value,
                  };

                  setHeaders(newHeaders);
                  onChange(Object.fromEntries(newHeaders.map(({ key, value }) => [key, value])));
                }}
                required={false}
                placeholder={undefined}
              />
              <div className="headers-header-equals">=</div>
            </div>

            <div className="headers-header-value">
              <StringInput
                initialValue={new StringValue(value)}
                multiline={false}
                onChange={(value) => {
                  const newHeaders = [...headers];

                  newHeaders[i] = {
                    key: newHeaders[i].key,
                    value: value.value || '',
                  };

                  setHeaders(newHeaders);
                  onChange(Object.fromEntries(newHeaders.map(({ key, value }) => [key, value])));
                }}
                required={false}
                placeholder={undefined}
              />
              <RemoveButton
                onClick={() => {
                  const newHeaders = [...headers];
                  newHeaders.splice(i, 1);

                  setHeaders(newHeaders);
                  onChange(Object.fromEntries(newHeaders.map(({ key, value }) => [key, value])));
                }}
              />
            </div>
          </div>
        ))}
        <AddButton
          onClick={() => {
            const newHeaders = [
              ...headers,
              { key: headers.length === 0 ? 'Authorization' : '', value: '' },
            ];

            setHeaders(newHeaders);
            onChange(Object.fromEntries(headers.map(({ key, value }) => [key, value])));
          }}
        />
      </div>
    </div>
  )
}

export default Headers
