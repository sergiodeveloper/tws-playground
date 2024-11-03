
import { useCallback, useEffect, useRef, useState } from 'react';
import './Info.css'

function Info(props: { text: string }) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const [tooltipMaxWidth, setTooltipMaxWidth] = useState(0);

  const [textTranslateTop, setTextTranslateTop] = useState(0);

  const updateTooltipDimensions = useCallback(() => {
    const tooltipX = tooltipRef.current?.getBoundingClientRect().x || 0;
    const remainingWidthInViewport = window.innerWidth - tooltipX - 10;

    setTooltipMaxWidth(remainingWidthInViewport);

    const textTop = textRef.current?.getBoundingClientRect().y || 0;

    setTextTranslateTop(
      Math.max(
        textTranslateTop - textTop,
        0
      )
    );
  }, [textTranslateTop]);

  useEffect(() => {
    window.addEventListener('resize', updateTooltipDimensions);
    return () => {
      window.removeEventListener('resize', updateTooltipDimensions);
    };
  }, [updateTooltipDimensions]);

  return (
    <div
      className="info-root"
      ref={() => updateTooltipDimensions()}
      role='tooltip'
      onClick={() => updateTooltipDimensions()}
      onMouseEnter={() => updateTooltipDimensions()}
      onMouseLeave={() => updateTooltipDimensions()}
      onTouchStart={() => updateTooltipDimensions()}
      onTouchEnd={() => updateTooltipDimensions()}
    >
      <button
        className="icon"
        onFocus={() => updateTooltipDimensions()}
      >i</button>
      <div
        className="tooltip"
        ref={tooltipRef}
        style={{
          maxWidth: `${tooltipMaxWidth}px`,
        }}
      >
        <div
          className="text"
          ref={textRef}
          style={{
            top: `${textTranslateTop}px`,
          }}
        >{props.text}</div>
        <div className="left-triangle"></div>
      </div>
    </div>
  );
}

export default Info;
