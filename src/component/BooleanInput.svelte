<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value: boolean | undefined = undefined;

const dispatch = createEventDispatcher();

function change(event: Event) {
  const target = event.target as HTMLInputElement;
  dispatch('change', { value: target.checked });
}
</script>

<style>
.input {
  font-family: 'Roboto', sans-serif;
  display: block;
  width: 25px;
  height: 25px;
  margin: auto;
  padding: 10px;
  font-size: 16px;
  line-height: 20px;
  background-color: white;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08);
  box-sizing: border-box;
  appearance: none;
  cursor: pointer;
}

.input:focus {
  border-color: #60b7fe;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08), 0 0 8px rgba(105, 185, 250, 0.6);
}

.input:disabled {
  background-color: rgb(231, 231, 231);
}

.input:checked {
  background-color: #60b7fe;
  border-width: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path fill="white" d="M1.3,5.2 L2.3,4.2 L4,6 L8,2.1 L9,3 L4,8 Z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

.input:active {
  background-color: #3c9ae7;
  border-width: 0;
  background-image: none;
}
</style>

<input
  class="input"
  type="checkbox"
  on:change={change}
  checked={typeof value === 'boolean' ? value : undefined}
/>
