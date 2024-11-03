import {
  ArrayTypeDefinition, EnumTypeDefinition, ObjectTypeDefinition, PrimitiveTypeDefinition,
} from "@tws-js/common";
import ArrayInput from "../ArrayInput/ArrayInput";
import PrimitiveValueInput from "../PrimitiveValueInput/PrimitiveValueInput";
import { ArrayValue, clearAllSelections, newValueFromType, ObjectValue, Value } from "../../utils";
import ObjectInput from "../ObjectInput/ObjectInput";
import UnknownType from "../UnknownType/UnknownType";
import Info from "../Info/Info";
import { useRef } from "react";

import './Input.css';

function Input(props: {
  attributeName: string
  definition:
    | PrimitiveTypeDefinition
    | ObjectTypeDefinition
    | ArrayTypeDefinition
    | EnumTypeDefinition
  initialValue: Value
  onChange: (value: Value) => void
  showName: boolean
}) {
  const { attributeName, definition, initialValue, onChange, showName } = props;

  const typeIsKnown = (
    definition.type === 'array'
    && ['string', 'int', 'float', 'boolean', 'object', 'enum'].includes(definition.item.type)
  ) || (
    definition.type !== 'array'
    && ['string', 'int', 'float', 'boolean', 'object', 'enum'].includes(definition.type)
  );

  const childrenRef = useRef<HTMLDivElement>(null);

  const name = (definition.title || attributeName).trim().replace(/:+$/, '');

  return (
    <div className={`input-root ${definition.type === 'boolean' ? 'input-boolean' : ''}`}>
      <div onClick={() => {
        if (definition.type === 'boolean') {
          clearAllSelections();
        }

        const firstFocusableInput = childrenRef
          .current?.querySelector('input, textarea, select') as
          HTMLElement | null;
        if (firstFocusableInput) {
          firstFocusableInput.focus();
          firstFocusableInput.click();
        }
      }}>
        {definition.type !== 'array' && definition.required === false && (
          <span className="input-optional">(Optional)</span>
        )}
        {showName && name && (
          <span className="input-name">{
            name.endsWith('?') ? name : (
              definition.type === 'boolean' ? name : `${name}:`
            )
          }</span>
        )}
        {definition.description && <Info text={definition.description} />}
      </div>
      <div ref={childrenRef}>
        {typeIsKnown && definition.type !== 'array' && definition.type !== 'object' && (
          <PrimitiveValueInput
            definition={definition}
            initialValue={newValueFromType(definition.type, initialValue.value)}
            onChange={onChange}
            isSecret={attributeName.toLowerCase().includes('password')
              || attributeName.toLowerCase().includes('secret')
              || attributeName.toLowerCase().includes('token')}
          />
        )}

        {definition.type === 'array' && (
          <ArrayInput
            attributeName={attributeName}
            definition={definition}
            initialValue={ArrayValue.from(initialValue)}
            onChange={onChange}
          />
        )}

        {definition.type === 'object' && (
        <ObjectInput
          definition={definition}
          initialValue={ObjectValue.from(initialValue)}
          onChange={onChange}
        />
        )}

        {!typeIsKnown && (
          <UnknownType definition={JSON.stringify(definition, null, 2)} />
        )}
      </div>
    </div>
  )
}

export default Input;
