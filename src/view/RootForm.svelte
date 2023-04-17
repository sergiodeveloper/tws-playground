<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { InputTypeDefinition } from '@tws-js/server';

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
.text-center {
  text-align: center;
}
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
</div>
