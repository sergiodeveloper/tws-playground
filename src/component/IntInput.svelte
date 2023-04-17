<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value: number | undefined = undefined;
export let placeholder: string | undefined = undefined;

let rawValue = value !== undefined ? String(value) : '';

const dispatch = createEventDispatcher();

function change(event: Event) {
  const stringValue = String(Number(['-', ''].includes(rawValue) ? '0' : rawValue));
  rawValue = stringValue;

  dispatch('change', { value: Number(stringValue) });
}

let placeholderVisible = true;

function focus() {
  placeholderVisible = false;
}

function blur() {
  placeholderVisible = true;
}

function validateValue(value: string) {
  return value
    .replace(/[^0-9-]/g, '')
    .replace(/-+/g, '-')
    .match(/-?[0-9]*/)?.[0] ?? '0';
}

function onInput(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    rawValue = validateValue(event.target.value);
  }
}
</script>

<style>
.input {
  font-family: 'Roboto', sans-serif;
  display: block;
  width: 100%;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  line-height: 20px;
  background-color: white;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08);
  box-sizing: border-box;
}

.input:focus {
  border-color: #60b7fe;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08), 0 0 8px rgba(105, 185, 250, 0.6);
}

.input:disabled {
  background-color: rgb(231, 231, 231);
}
</style>

<input
  type="text"
  class="input"
  step="1"
  bind:value={rawValue}
  placeholder={placeholderVisible ? placeholder : undefined}
  on:change={change}
  on:focus={focus}
  on:blur={blur}
  on:input={onInput}
/>
