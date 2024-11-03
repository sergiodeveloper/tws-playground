import { RiDraggable } from '@remixicon/react';
import { useRef, useEffect, useCallback, useState } from 'react';

import './DragHandle.css';
import { clearAllSelections } from '../../utils';

const LONG_PRESS_DELAY = 500;
const SCROLL_AREA_SIZE = 80;


const DragHandle = (props: {
  onDragStart: (options: { clientX: number, clientY: number }) => void;
  onDragEnd: (options: { clientX: number, clientY: number }) => void;
  onDragMove: (options: { clientX: number, clientY: number }) => void;
}) => {
  const { onDragStart, onDragEnd, onDragMove } = props;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDragging, setDragging] = useState(false);

  const scrollRef = useRef<{ x: number, y: number }>({
    x: window.scrollX,
    y: window.scrollY,
  });

  const scrollSizeRef = useRef<{ width: number, height: number }>({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  });

  // Function to handle click down or touch start
  const handleDown = useCallback((event: {
    clientX: number,
    clientY: number,
    longPress: boolean,
  }) => {
    timerRef.current = setTimeout(() => {
      clearAllSelections();

      scrollRef.current = {
        x: window.scrollX,
        y: window.scrollY,
      };

      scrollSizeRef.current = {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };

      setDragging(true);

      // Trigger the long press action
      onDragStart({
        clientX: event.clientX + scrollRef.current.x,
        clientY: event.clientY + scrollRef.current.y,
      });
    }, event.longPress ? LONG_PRESS_DELAY : 0);
  }, [onDragStart, setDragging]);

  // Function to handle click up or touch end
  const handleUp = useCallback((event: { clientX: number, clientY: number }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isDragging) {
      setDragging(false);

      onDragEnd({
        clientX: event.clientX + scrollRef.current.x,
        clientY: event.clientY + scrollRef.current.y,
      });

      scrollRef.current = {
        x: window.scrollX,
        y: window.scrollY,
      };

      scrollSizeRef.current = {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
    }
  }, [onDragEnd, setDragging, isDragging]);


  const handleMove = useCallback((event: { clientX: number, clientY: number }) => {
    if (isDragging) {
      onDragMove({
        clientX: event.clientX + scrollRef.current.x,
        clientY: event.clientY + scrollRef.current.y,
      });
    }
  }, [isDragging, onDragMove]);

  const handleMoveScroll = useCallback((event: { clientX: number, clientY: number }) => {
    if (!isDragging) {
      return;
    }

    const { clientX, clientY } = event;

    let moveX = 0;
    let moveY = 0;

    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const scrollWidth = document.documentElement.scrollWidth;
    const scrollHeight = document.documentElement.scrollHeight;

    if (clientY < SCROLL_AREA_SIZE && window.scrollY > 0) {
      moveY = -1;
    } else if (
      clientY > window.innerHeight - SCROLL_AREA_SIZE &&
      window.scrollY < scrollHeight - viewportHeight
    ) {
      moveY = 1;
    } else if (clientX < SCROLL_AREA_SIZE && window.scrollX > 0) {
      moveX = -1;
    } else if (
      clientX > window.innerWidth - SCROLL_AREA_SIZE &&
      window.scrollX < scrollWidth - viewportWidth
    ) {
      moveX = 1;
    }

    if (scrollWidth > scrollSizeRef.current.width) {
      moveX = 0;
    }
    if (scrollHeight > scrollSizeRef.current.height) {
      moveY = 0;
    }

    if (moveX !== 0 || moveY !== 0) {
      const MULTIPLIER = 5;

      window.scrollBy(moveX * MULTIPLIER, moveY * MULTIPLIER);

      setTimeout(() => {
        scrollRef.current = {
          x: window.scrollX,
          y: window.scrollY,
        };

        onDragMove({
          clientX: clientX + scrollRef.current.x,
          clientY: clientY + scrollRef.current.y,
        });
      }, 0);
    }
  }, [onDragMove, isDragging]);

  // Listener to window mouse up
  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      handleUp({ clientX: event.clientX, clientY: event.clientY });
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleUp]);

  // Listener to mouse move
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      handleMove({ clientX: event.clientX, clientY: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMove]);

  // Listener to touch move to invoke onDragMove when needed
  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      const x = event.touches[0]?.clientX || 0;
      const y = event.touches[0]?.clientY || 0;

      handleMove({ clientX: x, clientY: y });
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMove]);

  // Listener to touch and mouse move to scroll the page if the touch position
  // is near the top or bottom or near the left or right
  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (isDragging) {
        event.preventDefault();
      } else {
        // Cancel the long press because the user is scrolling
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }

      const x = event.touches[0]?.clientX || 0;
      const y = event.touches[0]?.clientY || 0;

      handleMoveScroll({ clientX: x, clientY: y });
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMoveScroll, isDragging]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      handleMoveScroll({ clientX: event.clientX, clientY: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMoveScroll]);

  return (
    <button
      className="drag-handle-root"
      aria-label="Drag handle"
      style={{
        cursor: 'grab',
        userSelect: 'none',
        border: 'none',
        background: 'transparent',
        padding: 0,
        margin: 0,
      }}
      onTouchStart={event => {
        const x = event.touches[0]?.clientX || 0;
        const y = event.touches[0]?.clientY || 0;

        handleDown({ clientX: x, clientY: y, longPress: true });
      }}
      onMouseDown={event => {
        handleDown({ clientX: event.clientX, clientY: event.clientY, longPress: false });
      }}
      onTouchEnd={(e) => {
        const x = e.changedTouches[0]?.clientX || 0;
        const y = e.changedTouches[0]?.clientY || 0;

        handleUp({ clientX: x, clientY: y });
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <RiDraggable size={24} />
    </button>
  );
};

export default DragHandle;
