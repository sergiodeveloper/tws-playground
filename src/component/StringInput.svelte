<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value: string | undefined = undefined;
export let placeholder: string | undefined = undefined;
export let multiline = true;

const dispatch = createEventDispatcher();

function change(event: Event) {
  const target = event.target as HTMLInputElement;
  dispatch('change', { value: target.value });
}

$: textareaLines = 1;
$: scrollVisible = textareaLines > 10;

function input(event: Event) {
  const target = event.target as HTMLTextAreaElement;

  if (!multiline && target.value.includes('\n')) {
    target.value = target.value.replace(/\n/g, '');
  }

  textareaLines = target.value.split('\n').length;
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
  height: 20px;
  max-height: 220px;
  padding: 10px;
  font-size: 16px;
  line-height: 20px;
  background-color: white;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08);
  box-sizing: border-box;
  resize: none;
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

<textarea
  class="input"
  value={typeof value === 'string' ? value : ''}
  style="height: {textareaLines * 20 + 20}px; overflow: {scrollVisible ? 'auto' : 'hidden'}"
  placeholder={placeholderVisible ? placeholder : undefined}
  on:focus={focus}
  on:blur={blur}
  on:input={input}
  on:change={change}
/>
