import { StringValue } from '../../utils';
import ClearButton from '../ClearButton/ClearButton';
import './StringInput.css';

import { useCallback, useEffect, useRef, useState } from 'react';

function StringInput(props: {
  initialValue: StringValue;
  placeholder: string | undefined;
  multiline: boolean;
  onChange: (value: StringValue) => void;
  required: boolean;
}) {
  const [inputValue, setInputValue] = useState(props.initialValue.value || '');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const [textareaLines, setTextareaLines] = useState(1);
  const [scrollVisible, setScrollVisible] = useState(false);

  const updateLinesAndScroll = useCallback((value: string) => {
    const cleanValue = props.multiline === false && value.includes('\n')
      ? value.replace(/\n/g, '')
      : value;

    setTextareaLines(cleanValue.split('\n').length);
    setScrollVisible(textareaLines > 10);
  }, [props.multiline, textareaLines]);

  // Update lines and scroll on mount
  useEffect(() => {
    updateLinesAndScroll(inputValue);
  }, [props.multiline, inputValue, updateLinesAndScroll]);

  const textareaElement = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <textarea
        className="string-input"
        aria-label="Text input"
        ref={textareaElement}
        value={inputValue}
        style={{
          height: `${textareaLines * 20 + 20}px`,
          overflow: `${scrollVisible ? 'auto' : 'hidden'}`,
          paddingRight: !props.required ? '30px' : undefined,
          textWrap: props.multiline ? 'wrap' : 'nowrap',
        }}
        placeholder={placeholderVisible ? props.placeholder : undefined}
        onFocus={() => {
          setPlaceholderVisible(false);
        }}
        onBlur={() => {
          setPlaceholderVisible(true);
          props.onChange(new StringValue(inputValue));
        }}
        onInput={(event) => {
          const newValue = (event.target as HTMLTextAreaElement).value;
          updateLinesAndScroll(newValue);
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !props.multiline) {
            event.preventDefault();

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
              updateLinesAndScroll('');

              textareaElement.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default StringInput;
