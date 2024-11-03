import { NumberValue } from '../../utils';
import ClearButton from '../ClearButton/ClearButton';
import './IntInput.css';

import { useEffect, useRef, useState } from 'react';

function validateValue(options: {
  caretPosition: number;
  value: string;
}) {
  const hasMinus = options.value.includes('-');
  const hasMoreThanOneMinus = options.value.split('-').length > 2;

  const match = options.value
    // Remove all characters that are not numbers
    .replace(/[^0-9]/g, '')
    // Match a valid int number in the remaining string
    .match(/[0-9]*/)?.[0] ?? '';

  if (['0', '-'].includes(match)) {
    return {
      newValue: match,
      newCaretPosition: match.length,
    }
  }

  const newValue = (hasMinus && !hasMoreThanOneMinus ? '-' : '') + match;

  let caretPosition = options.caretPosition;

  if (hasMinus && !newValue.includes('-')) {
    caretPosition -= 2;
  }

  if (!hasMinus && newValue.includes('-')) {
    caretPosition += 0;
  }

  return {
    newValue,
    newCaretPosition: caretPosition,
  };
}

function IntInput(props: {
  onChange: (value: NumberValue) => void;
  initialValue: NumberValue;
  placeholder: string | undefined;
  required: boolean;
}) {
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  let initialValue = props.initialValue.value === null
    ? null
    : parseInt(String(Math.floor(props.initialValue.value)).replace(/[^0-9-]/g, ''));

  if (initialValue !== null && isNaN(initialValue)) {
    initialValue = null;
  }

  const [value, setValue] = useState(initialValue !== null ? String(initialValue) : '');

  const [caretPosition, setCaretPosition] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(
        caretPosition,
        caretPosition
      );
    }
  }, [caretPosition]);

  useEffect(() => {
    const cleanValue = ['-'].includes(value) ? '0' : value;
    if (cleanValue === '') {
      props.onChange(new NumberValue(null));
    } else {
      const parsed = parseInt(cleanValue);
      const number = isNaN(parsed) ? 0 : parsed;

      props.onChange(new NumberValue(number));
    }
  }, [value]);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <input
        type="text"
        className="int-input"
        aria-label="Integer input"
        ref={inputRef}
        value={value}
        placeholder={placeholderVisible ? props.placeholder : undefined}
        onFocus={() => setPlaceholderVisible(false)}
        onBlur={() => {
          setPlaceholderVisible(true);

          const cleanValue = ['-'].includes(value) ? '0' : value;
          if (cleanValue === '') {
            setValue('');
          } else {
            const parsed = parseInt(cleanValue);
            const number = isNaN(parsed) ? 0 : parsed;
            setValue(String(number));
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            inputRef.current?.blur();
          }
        }}
        onInput={(event) => {
          const target = event.target as HTMLInputElement;
          const rawValue = target.value;

          event.persist();

          const currentCaretPosition = target.selectionStart || target.selectionEnd || target.value.length;

          const { newValue, newCaretPosition } = validateValue({
            value: rawValue,
            caretPosition: currentCaretPosition,
          });

          setCaretPosition(newCaretPosition);

          setValue(newValue);
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
              setValue('');
              props.onChange(new NumberValue(null));

              inputRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default IntInput;
