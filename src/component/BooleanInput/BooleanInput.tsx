import { useEffect, useState } from 'react';
import './BooleanInput.css';
import { BooleanValue } from '../../utils';

function BooleanInput(props: {
  onChange: (value: BooleanValue) => void;
  initialValue: BooleanValue;
}) {
  const [value, setValue] = useState(props.initialValue.value || false);

  useEffect(() => {
    if (props.initialValue.value === null) {
      props.onChange(new BooleanValue(value));
    }
  }, [props.initialValue, value, props.onChange]);

  return (
    <input
      type="checkbox"
      className="boolean-input"
      aria-label="Boolean input"
      onChange={event => {
        setValue(event.target.checked);
        props.onChange(new BooleanValue(event.target.checked));
      }}
      checked={value}
    />
  );
}

export default BooleanInput;
