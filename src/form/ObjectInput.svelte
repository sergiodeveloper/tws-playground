<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { ObjectTypeDefinition } from '@tws-js/common';

import NamedInput from './NamedInput.svelte';
import PrimitiveValueInput from './PrimitiveValueInput.svelte';
import ArrayInput from './ArrayInput.svelte';
import { getObjectFromRecord, getArrayFromRecord } from '../utils';

export let definition: ObjectTypeDefinition;
export let removable: boolean;
export let key: string | undefined = undefined;

export let value: Record<string, unknown> = {};

let properties = Object.entries(definition.properties);

function removeField(field: string) {
  delete value[field];
  properties = properties;
  onChange(value);
}

const dispatch = createEventDispatcher();

function onChange(value: unknown) {
  value = value;
  dispatch('change', { value });
}
</script>

<style>
.root {
  border: 1px solid #dad4d4;
  border-radius: 15px;
  padding: 2px 12px;
}

.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
}
</style>

<div class="root">
  <NamedInput
    name={definition.title || key}
    description={definition.description}
    required={definition.required}
    {removable}
    on:remove
  >
    {#each properties as [propertyName, property]}
      <div class="row">
        {#if property.type !== 'object' && property.type !== 'array' && property.type !== 'enum'}
          <PrimitiveValueInput
            definition={property}
            value={value[propertyName]}
            on:change={(event) => {
              value[propertyName] = event.detail.value;
              onChange(value);
            }}
            removable={property.required === false}
            on:remove={() => removeField(propertyName)}
          />
        {/if}
        {#if property.type === 'object'}
          <svelte:self
            definition={property}
            value={getObjectFromRecord(value, propertyName)}
            on:change={(event) => {
              value[propertyName] = event.detail.value;
              onChange(value);
            }}
            removable={property.required === false}
            on:remove={() => removeField(propertyName)}
          />
        {/if}
        {#if property.type === 'array'}
          <ArrayInput
            key={propertyName}
            definition={property}
            value={getArrayFromRecord(value, propertyName)}
            on:change={(event) => {
              value[propertyName] = event.detail.value;
              onChange(value);
            }}
            removable={false}
          />
        {/if}
        {#if property.type === 'enum'}
          <div>Enum</div>
        {/if}
      </div>
    {/each}
  </NamedInput>
</div>
