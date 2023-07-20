<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type {
  ArrayTypeDefinition, EnumTypeDefinition, ObjectTypeDefinition, PrimitiveTypeDefinition,
} from '@tws-js/common';

import ArrayInput from '../form/ArrayInput.svelte';
import PrimitiveValueInput from '../form/PrimitiveValueInput.svelte';
import ObjectInput from '../form/ObjectInput.svelte';
import { getArrayFromRecord, getObjectFromRecord } from '../utils';
import EnumInput from '../form/EnumInput.svelte';

export let key: string;

export let definition:
  | PrimitiveTypeDefinition
  | ObjectTypeDefinition
  | ArrayTypeDefinition
  | EnumTypeDefinition;

const typeIsKnown = (
  definition.type === 'array'
  && ['string', 'int', 'float', 'boolean', 'object'].includes(definition.item.type)
) || (
  definition.type !== 'array'
  && ['string', 'int', 'float', 'boolean', 'object', 'enum'].includes(definition.type)
);

let input: Record<string, unknown> = {};

const dispatch = createEventDispatcher();

function onChange() {
  input = input;
  dispatch('change', { value: input[key] });
}
</script>

{#if definition.type !== 'array' && definition.type !== 'object' && definition.type !== 'enum'}
  <PrimitiveValueInput
    key={key}
    definition={definition}
    value={input[key]}
    on:change={(event) => {
      input[key] = event.detail.value;
      onChange();
    }}
    removable={definition.required === false}
    on:remove={() => {
      delete input[key];
      onChange();
    }}
  />
{/if}

{#if definition.type === 'array'}
  <ArrayInput
    key={key}
    definition={definition}
    value={getArrayFromRecord(input, key)}
    on:change={(event) => {
      input[key] = event.detail.value;
      onChange();
    }}
    removable={false}
  />
{/if}

{#if definition.type === 'object'}
  <ObjectInput
    key={key}
    definition={definition}
    value={getObjectFromRecord(input, key)}
    on:change={(event) => {
      input[key] = event.detail.value;
      onChange();
    }}
    removable={definition.required === false}
    on:remove={() => {
      delete input[key];
      onChange();
    }}
  />
{/if}

{#if definition.type === 'enum'}
  <EnumInput
    key={key}
    definition={definition}
    value={input[key]}
    on:change={(event) => {
      input[key] = event.detail.value;
      onChange();
    }}
    removable={definition.required === false}
    on:remove={() => {
      delete input[key];
      onChange();
    }}
  />
{/if}

{#if !typeIsKnown}
  <div>
    <div>Unknown type</div>
    <pre>{JSON.stringify(definition, null, 2)}</pre>
  </div>
{/if}
