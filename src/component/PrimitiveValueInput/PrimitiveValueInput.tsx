import { EnumTypeDefinition, PrimitiveTypeDefinition } from "@tws-js/common"
import FloatInput from "../FloatInput/FloatInput"
import SecretInput from "../SecretInput/SecretInput"
import StringInput from "../StringInput/StringInput"
import IntInput from "../IntInput/IntInput"
import BooleanInput from "../BooleanInput/BooleanInput"
import { Value, StringValue, NumberValue, BooleanValue } from "../../utils"
import Select from "../Select/Select"

function PrimitiveValueInput(props: {
  definition: PrimitiveTypeDefinition | EnumTypeDefinition;
  initialValue: Value;
  onChange: (value: Value) => void;
  isSecret: boolean;
}) {
  const { isSecret, definition, initialValue, onChange } = props;

  return (
    <div className="primitive-value-input-root">
      {definition.type === 'string' && (
        isSecret ? <SecretInput
              placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
              initialValue={StringValue.from(initialValue)}
              onChange={(value) => onChange(value)}
              required={definition.required !== false}
            />
          : <StringInput
              placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
              initialValue={StringValue.from(initialValue)}
              onChange={(value) => onChange(value)}
              multiline={true}
              required={definition.required !== false}
            />
      )}

      {definition.type === 'int' && (
        <IntInput
          placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
          initialValue={NumberValue.from(initialValue)}
          onChange={(value) => onChange(value)}
          required={definition.required !== false}
        />
      )}

      {definition.type === 'float' && (
        <FloatInput
          placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
          initialValue={NumberValue.from(initialValue)}
          onChange={(value) => onChange(value)}
          required={definition.required !== false}
        />
      )}

      {definition.type === 'boolean' && (
        <BooleanInput
          initialValue={(
            initialValue.isNull() ? BooleanValue.from(definition.defaultValue) : BooleanValue.from(initialValue)
          )}
          onChange={(value) => onChange(value)}
        />
      )}

      {definition.type === 'enum' && (
        <Select
          options={Object.entries(definition.values).map(([enumKey, enumItem]) => ({
            label: enumItem.title || enumKey,
            value: enumKey,
          }))}
          initialValue={StringValue.from(initialValue)}
          onChange={(value) => onChange(value)}
          required={definition.required !== false}
        />
      )}
    </div>
  );
}

export default PrimitiveValueInput;
