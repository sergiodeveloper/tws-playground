import { useCallback, useEffect, useRef, useState } from "react";

function MouseOverDetector(props: {
  children: React.ReactNode;
  onMouseMoveY: () => void;
  onMouseOverY: () => void;
  onMouseLeaveY: () => void;
  showOutline: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isOver, setIsOver] = useState(false);

  // Listener to window to detect mouse over even if the element is not directly
  // receiving mouse events
  const moveDetector = useCallback((event: { clientY: number; clientX: number }) => {
    const bounds = rootRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const isWithinYBounds =
      event.clientY >= bounds.y &&
      event.clientY <= bounds.y + bounds.height

    if (isWithinYBounds) {
      props.onMouseMoveY();
    }

    if (!isOver && isWithinYBounds) {
      setIsOver(true);
      props.onMouseOverY();
    } else if (isOver && !isWithinYBounds) {
      setIsOver(false);
      props.onMouseLeaveY();
    }
  }, [rootRef.current, props.onMouseMoveY, props.onMouseOverY, props.onMouseLeaveY, isOver]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      moveDetector({ clientX: event.clientX, clientY: event.clientY });
    };

    window.addEventListener('mousemove', listener);
    return () => {
      window.removeEventListener('mousemove', listener);
    };
  }, [moveDetector]);

  useEffect(() => {
    const listener = (event: TouchEvent) => {
      const x = event.touches[0]?.clientX || 0;
      const y = event.touches[0]?.clientY || 0;
      moveDetector({ clientX: x, clientY: y });
    };

    window.addEventListener('touchmove', listener);
    return () => {
      window.removeEventListener('touchmove', listener);
    };
  }, [moveDetector]);

  return (
    <div
      ref={rootRef}
      style={{
        outline: props.showOutline ? '2px solid #60b7fe' : 'none',
        borderRadius: '5px',
        outlineOffset: '-2px',
      }}
    >
      {props.children}
    </div>
  );
}

export default MouseOverDetector
