<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value: string | undefined = undefined;
export let placeholder: string | undefined = undefined;

const dispatch = createEventDispatcher();

function change(event: Event) {
  const target = event.target as HTMLInputElement;
  dispatch('change', { value: target.value });
}

let placeholderVisible = true;
function focus() {
  placeholderVisible = false;
}
function blur() {
  placeholderVisible = true;
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
  type="password"
  class="input"
  value={typeof value === 'string' ? value : ''}
  placeholder={placeholderVisible ? placeholder : undefined}
  on:focus={focus}
  on:blur={blur}
  on:change={change}
/>
