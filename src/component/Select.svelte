<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let options: { label: string, value: string }[];
export let initial: string | undefined = undefined;

const dispatch = createEventDispatcher();

function change(event: Event) {
  const target = event.target as HTMLSelectElement;
  dispatch('change', { value: target.value });
}
</script>

<style>
select {
  display: block;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  font-size: 16px;
  line-height: 20px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><polygon points="0,0 10,0 5,6"/></svg>');
  background-repeat: no-repeat;
  background-position: right 15px bottom 40%;
  background-size: 12px;
  box-sizing: border-box;
}

select:focus {
  border-color: #60b7fe;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08), 0 0 8px rgba(105, 185, 250, 0.6);
}

select:disabled {
  background-color: rgb(231, 231, 231);
}
</style>

<select on:change={change}>
  {#each options as option}
    <option value={option.value} selected={option.value === initial}>{option.label}</option>
  {/each}
</select>
