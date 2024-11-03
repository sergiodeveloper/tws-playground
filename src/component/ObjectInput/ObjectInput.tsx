import { ObjectTypeDefinition } from "@tws-js/common"
import { newValueFromType, ObjectValue } from "../../utils"

import './ObjectInput.css'
import { useState } from "react"
import AddButton from "../AddButton/AddButton"
import Input from "../Input/Input"
import ClearButton from "../ClearButton/ClearButton"

function ObjectInput(props: {
  definition: ObjectTypeDefinition;
  initialValue: ObjectValue;
  onChange: (value: ObjectValue) => void;
}) {
  const { definition, onChange } = props;

  const initialValue = (
    props.initialValue.value === null && definition.required !== false
      ? {}
      : props.initialValue.value
  );

  const [objectValue, setValue] = useState(initialValue);

  return (
    <div className={`object-input-root ${definition.required === false ? 'optional' : ''}`}>
      {objectValue === null ? (
        <div>
          <span>Object is empty</span>
          <AddButton
            onClick={() => {
              setValue({});
              onChange(new ObjectValue({}));
            }}
          />
        </div>
      ) : (
        <div>
          {definition.required === false && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                right: '4px',
                top: '1px',
              }}
            >
              <ClearButton
                onClick={() => {
                  setValue(null);
                  onChange(new ObjectValue(null));
                }}
              />
            </div>
          )}
          {Object.entries(definition.properties).map(([propertyName, property]) => (
            <div className="object-row" key={propertyName}>
              <Input
                attributeName={propertyName}
                definition={property}
                initialValue={newValueFromType(property.type, objectValue[propertyName])}
                onChange={(value) => {
                  const newValue = { ...objectValue, [propertyName]: value };
                  setValue(newValue);
                  onChange(new ObjectValue(newValue));
                }}
                showName={true}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ObjectInput;
