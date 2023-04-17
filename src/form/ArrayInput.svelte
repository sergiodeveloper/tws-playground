<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { ArrayTypeDefinition } from '@tws-js/server';

import PrimitiveValueInput from './PrimitiveValueInput.svelte';
import ObjectInput from './ObjectInput.svelte';
import { getArrayFromList, getObjectFromList } from '../utils';
import NamedInput from './NamedInput.svelte';
import EnumInput from './EnumInput.svelte';
import AddButton from '../component/AddButton.svelte';

export let key: string;
export let definition: ArrayTypeDefinition;
export let removable: boolean;

const typeIsKnown = (
  definition.type === 'array'
  && ['string', 'int', 'float', 'boolean', 'object', 'array', 'enum'].includes(definition.item.type)
);

export let value: unknown[] = [undefined];

function addField() {
  value = [...value, undefined];
}

function removeRow(index: number) {
  value = value.filter((_, i) => i !== index);
  onChange(value);
}

const dispatch = createEventDispatcher();

function onChange(value: unknown) {
  dispatch('change', { value });
}
</script>

<style>
.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
  padding-left: 15px;
}

.row-content {
  flex-grow: 1;
  flex-shrink: 0;
}
</style>

<NamedInput
  name={definition.title || key}
  description={definition.description}
  required={true}
  {removable}
  on:remove
>
  {#each value as field, index}
    <div class="row">
      <div class="row-content">
        {#if (
          definition.item.type !== 'object' && definition.item.type !== 'array'
          && definition.item.type !== 'enum'
        )}
          <PrimitiveValueInput
            definition={definition.item}
            value={value[index]}
            on:change={(event) => {
              value[index] = event.detail.value;
              onChange(value);
            }}
            removable={true}
            on:remove={() => {
              removeRow(index);
            }}
          />
        {/if}
        {#if definition.item.type === 'array'}
          <svelte:self
            definition={definition.item}
            value={getArrayFromList(value, index)}
            on:change={(event) => {
              value[index] = event.detail.value;
              onChange(value);
            }}
            removable={true}
            on:remove={() => {
              removeRow(index);
            }}
          />
        {/if}
        {#if definition.item.type === 'object'}
          <ObjectInput
            definition={definition.item}
            value={getObjectFromList(value, index)}
            on:change={(event) => {
              value[index] = event.detail.value;
              onChange(value);
            }}
            removable={true}
            on:remove={() => {
              removeRow(index);
            }}
          />
        {/if}
        {#if definition.item.type === 'enum'}
          <EnumInput
            definition={definition.item}
            value={value[index]}
            on:change={(event) => {
              value[index] = event.detail.value;
              onChange(value);
            }}
            removable={true}
            on:remove={() => {
              removeRow(index);
            }}
          />
        {/if}
      </div>
    </div>
  {/each}
  <AddButton on:click={addField} />
</NamedInput>

{#if !typeIsKnown}
  <div>
    <div>Unknown type</div>
    <pre>{JSON.stringify(definition, null, 2)}</pre>
  </div>
{/if}
