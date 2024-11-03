import { StringValue } from '../../utils';
import ClearButton from '../ClearButton/ClearButton';
import './SecretInput.css';

import { useRef, useState } from 'react';

function SecretInput(props: {
  onChange: (value: StringValue) => void;
  initialValue: StringValue;
  placeholder: string | undefined;
  required: boolean;
}) {
  const [inputValue, setInputValue] = useState(props.initialValue.value || '');

  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <input
        className="secret-input"
        ref={inputRef}
        type="password"
        value={inputValue}
        placeholder={placeholderVisible ? props.placeholder : undefined}
        onFocus={() => {
          setPlaceholderVisible(false);
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onBlur={() => {
          setPlaceholderVisible(true);
          props.onChange(new StringValue(inputValue));
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            props.onChange(new StringValue(inputValue));
          }
        }}
      />

      {!props.required && (
        <div
          style={{
            position: 'absolute',
            right: '5px',
            top: '20px',
            transform: 'translateY(-50%)',
          }}
        >
          <ClearButton
            onClick={() => {
              setInputValue('');
              props.onChange(new StringValue(''));

              inputRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SecretInput;
