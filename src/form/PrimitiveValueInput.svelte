<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { PrimitiveTypeDefinition } from '@tws-js/common';

import BooleanInput from '../component/BooleanInput.svelte';
import IntInput from '../component/IntInput.svelte';
import FloatInput from '../component/FloatInput.svelte';
import StringInput from '../component/StringInput.svelte';
import NamedInput from './NamedInput.svelte';
import SecretInput from '../component/SecretInput.svelte';

export let key: string | undefined = undefined;
export let removable: boolean;
export let definition: PrimitiveTypeDefinition;

const typeIsKnown = (
  ['string', 'int', 'float', 'boolean', 'object'].includes(definition.type)
);

const dispatch = createEventDispatcher();

function onChange(value: unknown) {
  dispatch('change', { value });
}

export let value: unknown;
</script>

<NamedInput
  name={definition.title || key}
  description={definition.description}
  required={definition.required !== false}
  {removable}
  on:remove
>
  {#if definition.type === 'string'}
    {#if key && key.toLowerCase().includes('password')}
      <SecretInput
        placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
        value={typeof value === 'string' ? value : undefined}
        on:change={(event) => {
          value = event.detail.value;
          onChange(value);
        }}
      />
    {:else}
      <StringInput
        placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
        value={typeof value === 'string' ? value : undefined}
        on:change={(event) => {
          value = event.detail.value;
          onChange(value);
        }}
      />
    {/if}
  {/if}

  {#if definition.type === 'int'}
    <IntInput
      placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
      value={typeof value === 'number' ? value : undefined}
      on:change={(event) => {
        value = event.detail.value;
        onChange(value);
      }}
    />
  {/if}

  {#if definition.type === 'float'}
    <FloatInput
      placeholder={definition.defaultValue !== undefined ? String(definition.defaultValue) : undefined}
      value={typeof value === 'number' ? value : undefined}
      on:change={(event) => {
        value = event.detail.value;
        onChange(value);
      }}
    />
  {/if}

  {#if definition.type === 'boolean'}
    <BooleanInput
      value={typeof definition.defaultValue === 'boolean' ? definition.defaultValue : undefined}
      on:change={(event) => {
        value = event.detail.value;
        onChange(value);
      }}
    />
  {/if}
</NamedInput>

{#if !typeIsKnown}
  <div>
    <div>Unknown type</div>
    <pre>{JSON.stringify(definition, null, 2)}</pre>
  </div>
{/if}
