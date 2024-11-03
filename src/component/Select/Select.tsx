import { useEffect, useRef, useState } from 'react';
import './Select.css'
import { StringValue } from '../../utils';
import ClearButton from '../ClearButton/ClearButton';

function Select(props: {
  options: { label: string, value: string }[];
  initialValue: StringValue;
  onChange: (value: StringValue) => void;
  required: boolean;
}) {
  const { options, initialValue, onChange } = props;

  const initialOption = options.find(option => option.value === initialValue.value)?.value || null;

  useEffect(() => {
    if (initialValue.value !== null && initialOption === null) {
      onChange(new StringValue(null));
    }
  }, [initialValue, initialOption, onChange]);

  const [value, setValue] = useState(initialOption);

  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (selectRef.current) {
      const listener = (e: Event) => {
        const newValue = options.find(
          option => option.value === (e.target as HTMLSelectElement).value
        )?.value || null;
        setValue(newValue);
        onChange(new StringValue(newValue));
      };

      selectRef.current.addEventListener('change', listener);
      return () => {
        selectRef.current?.removeEventListener('change', listener);
      };
    }
  }, [selectRef.current, options, onChange]);

  return (
    <div className={`select-root ${props.required ? 'required' : ''}`} style={{ position: 'relative' }}>
      <select
        ref={selectRef}
      >
        {initialOption === null && (
          <option
            value=''
            selected={value === null}
            disabled
            hidden
          >Select an option</option>
        )}

        {options.map(option => (
          <option key={option.value} value={option.value} selected={option.value === value}>
            {option.label}
          </option>
        ))}
      </select>

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
              setValue(null);
              onChange(new StringValue(null));
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Select
