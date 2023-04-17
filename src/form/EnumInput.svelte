<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';
import type { EnumTypeDefinition } from '@tws-js/server';
import Select from '../component/Select.svelte';
import NamedInput from './NamedInput.svelte';

export let key: string | undefined = undefined;
export let removable: boolean;
export let definition: EnumTypeDefinition;

const dispatch = createEventDispatcher();

export let value: unknown = definition.defaultValue || Object.keys(definition.values)[0];

function onChange(event: { detail: { value: string } }) {
  value = event.detail.value;
  dispatch('change', { value: event.detail.value });
}

onMount(() => {
  dispatch('change', { value });
});
</script>

<NamedInput
  name={definition.title || key}
  description={definition.description}
  required={true}
  {removable}
  on:remove
>
  <Select
    options={Object.keys(definition.values).map((key) => ({
      label: definition.values[key].title || key,
      value: key,
    }))}
    initial={typeof value === 'string' ? value : undefined}
    on:change={onChange}
  />
</NamedInput>
