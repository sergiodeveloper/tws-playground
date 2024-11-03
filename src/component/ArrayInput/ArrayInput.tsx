import { useCallback, useRef, useState } from "react";
import type { ArrayTypeDefinition } from '@tws-js/common';
import { ArrayValue, newValueFromType } from "../../utils";
import AddButton from "../AddButton/AddButton";

import './ArrayInput.css';
import UnknownType from "../UnknownType/UnknownType";
import Input from "../Input/Input";
import RemoveButton from "../RemoveButton/RemoveButton";
import DragHandle from "../DragHandle/DragHandle";
import MouseOverDetector from "../MouseOverDetector/MouseOverDetector";

function ArrayInput(props: {
  attributeName: string;
  definition: ArrayTypeDefinition;
  initialValue: ArrayValue;
  onChange: (value: ArrayValue) => void;
}) {
  const { attributeName, definition, onChange } = props;

  const [arrayValue, setArrayValue] = useState(props.initialValue);

  const [arrayHash, setArrayHash] = useState(Math.random().toString(36).substring(7));

  const typeIsKnown = (
    definition.type === 'array'
    && ['string', 'int', 'float', 'boolean', 'object', 'array', 'enum'].includes(definition.item.type)
  );

  const addRow = useCallback(() => {
    setArrayValue((previousArrayValue) => {
      const newArrayContent = [...previousArrayValue.value];

      const newItem = newValueFromType(definition.item.type, null);
      newArrayContent.push(newItem);
      const newArrayValue = new ArrayValue(newArrayContent);

      onChange(newArrayValue);

      return newArrayValue;
    });

    setArrayHash(Math.random().toString(36).substring(7));
  }, [definition.item.type, onChange]);

  const removeRow = useCallback((index: number) => {
    setArrayValue((previousArrayValue) => {
      const newArrayContent = [...previousArrayValue.value].filter((_, i) => i !== index);
      const newArrayValue = new ArrayValue(newArrayContent);

      onChange(newArrayValue);

      return newArrayValue;
    });

    setArrayHash(Math.random().toString(36).substring(7));
  }, [onChange]);

  const dragStartY = useRef(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  const [draggingFutureIndex, setDraggingFutureIndex] = useState<number | null>(null);

  const calculateRowTranslateY = useCallback((index: number) => {
    if (draggingIndex === null) {
      return '0px';
    }

    if (draggingIndex === index) {
      return `${offsetY}px`;
    }

    if (draggingFutureIndex === null) {
      return '0px';
    }

    if (draggingFutureIndex === index) {
      if (draggingIndex < index) {
        return `-100%`;
      } else {
        return `100%`;
      }
    }

    if (draggingIndex < index && draggingFutureIndex > index) {
      return `-100%`;
    }

    if (draggingIndex > index && draggingFutureIndex < index) {
      return `100%`;
    }

    return '0px';
  }, [draggingIndex, draggingFutureIndex, offsetY]);

  return (
    <div className="array-input-root">
      {(!typeIsKnown) ? (
        <UnknownType definition={JSON.stringify(definition, null, 2)} />
      ) : (
        <>
          <div>
            {arrayValue.value.map((item, index) => (
              <MouseOverDetector
                key={`${arrayHash}-${index}`}
                onMouseOverY={() => {}}
                onMouseMoveY={() => {
                  if (draggingIndex !== null) {
                    setDraggingFutureIndex(index);
                  }
                }}
                onMouseLeaveY={() => {
                  if (draggingIndex === null) {
                    setDraggingFutureIndex(null);
                  }
                }}
                showOutline={draggingFutureIndex === index}
              >
                <div
                  key={`${arrayHash}-${index}`}
                  className={`array-row ${index === draggingIndex ? 'dragging' : ''}`}
                  style={{
                    transform: `translateY(${calculateRowTranslateY(index)})`,
                    position: index === draggingIndex ? 'relative' : undefined,
                    zIndex: index === draggingIndex ? 1000 : undefined,
                  }}
                >
                  <div className="array-row-controls">
                    <DragHandle
                      onDragStart={(event) => {
                        if (draggingIndex === null) {
                          dragStartY.current = event.clientY;
                          setDraggingIndex(index);
                        }
                      }}
                      onDragEnd={() => {
                        if (draggingIndex !== null) {
                          if (draggingFutureIndex !== null) {
                            setArrayValue((previousArrayValue) => {
                              const arrayWithoutItem = previousArrayValue.value
                                .filter((_, i) => i !== draggingIndex);

                              const newArrayContent = [
                                ...arrayWithoutItem.slice(0, draggingFutureIndex),
                                previousArrayValue.value[draggingIndex],
                                ...arrayWithoutItem.slice(draggingFutureIndex),
                              ];

                              const newArrayValue = new ArrayValue(newArrayContent);
                              onChange(newArrayValue);

                              return newArrayValue;
                            });

                            setArrayHash(Math.random().toString(36).substring(7));
                          }
                        }

                        setOffsetY(0);
                        setDraggingIndex(null);
                        setDraggingFutureIndex(null);
                      }}
                      onDragMove={(event) => {
                        if (draggingIndex !== null) {
                          setOffsetY(event.clientY - dragStartY.current);
                        }
                      }}
                    />

                    <RemoveButton
                      onClick={() => removeRow(index)}
                    />
                  </div>
                  <div className="array-row-content">
                    <Input
                      attributeName={`${attributeName}[${index}]`}
                      definition={definition.item}
                      initialValue={item}
                      onChange={(value) => {
                        setArrayValue((previousArrayValue) => {
                          const newArrayContent = [...previousArrayValue.value];
                          newArrayContent[index] = value;

                          const newArrayValue = new ArrayValue(newArrayContent);
                          onChange(newArrayValue);

                          return newArrayValue;
                        });
                      }}
                      showName={false}
                    />
                  </div>
                </div>
              </MouseOverDetector>
            ))}
          </div>
          <AddButton onClick={addRow} />
        </>
      )}
    </div>
  );
}

export default ArrayInput;
