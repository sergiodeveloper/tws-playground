<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let text: string;

const dispatch = createEventDispatcher();

function onClick(event: Event) {
  dispatch('click', {});
}
</script>

<style>
.button {
  font-family: 'Roboto', sans-serif;
  display: block;
  width: 100%;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  line-height: 20px;
  background-color: #9ccf49;
  color: white;
  background-image: none;
  border: 0;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.08);
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
}

.button:hover, .button:focus {
  background-color: #8abf3e;
}

.button:active {
  background-color: #7ab034;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .3);
}
</style>

<button on:click={onClick} class="button">
  {text}
</button>
