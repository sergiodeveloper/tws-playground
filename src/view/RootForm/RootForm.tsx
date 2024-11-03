{/* <script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { InputTypeDefinition } from '@tws-js/common';

import Input from './Input.svelte';

export let inputDefinition: InputTypeDefinition;

const input: Record<string, unknown> = {};

const dispatch = createEventDispatcher();

function onChange(event: { detail: { key: string; value: unknown } }) {
  input[event.detail.key] = event.detail.value;
  dispatch('change', { value: input });
}
</script>

<style>
</style>

<div class="text-center">
  {#each Object.entries(inputDefinition) as [key, value]}
    <Input key={key} definition={value} on:change={(e) => onChange({
      detail: {
        key,
        value: e.detail.value,
      },
    })} />
  {/each}
</div> */}

import { InputTypeDefinition } from '@tws-js/common';
import Input from '../../component/Input/Input';
import './RootForm.css'
import { newValueFromType, Value } from '../../utils';
import { useState } from 'react';

function RootForm(props: {
  inputDefinition: InputTypeDefinition;
  onChange: (value: Record<string, Value>) => void;
}) {
  const { inputDefinition, onChange } = props;

  const [input, setInput] = useState<Record<string, Value>>({})

  return (
    <div className="root-form-root">
      {Object.entries(inputDefinition).map(([fieldName, fieldType]) => (
        <div key={fieldName} className="root-form-field">
          <Input
            attributeName={fieldName}
            definition={fieldType}
            onChange={(value) => {
              const newInput = { ...input };
              newInput[fieldName] = value;

              onChange(newInput);
              setInput(newInput);
            }}
            showName={true}
            initialValue={newValueFromType(
              fieldType.type,
              fieldType.type !== 'object' && fieldType.type !== 'array' ? fieldType.defaultValue : undefined
            )}
          />
        </div>
      ))}
    </div>
  )
}

export default RootForm
