import { RiClipboardLine } from '@remixicon/react';
import './Result.css'
import { useCallback } from 'react';

function Result(props: {
  text: string
}) {
  const { text } = props;

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text);

    const tooltip = document.querySelector('.result-copy-tooltip') as HTMLDivElement;

    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';
    setTimeout(() => {
      tooltip.style.opacity = '0';

      setTimeout(() => {
        tooltip.style.display = 'none';
      }, 500);
    }, 1000);
  }, [text]);

  return (
    <div className="result-root">
      <div style={{ textAlign: 'right' }}>
        <div className="result-copy" title="Copy to clipboard">
          <RiClipboardLine
            size={25}
            onClick={copyToClipboard}
            className="result-copy-button"
          />

          <div className="result-copy-tooltip">Copied to clipboard!</div>
        </div>
      </div>
      <span>{text || ''}</span>
    </div>
  )
}

export default Result
