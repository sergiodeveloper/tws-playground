<script lang="ts">
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

function onClick() {
  dispatch('click', {});
}
</script>

<style>
.add-button {
  appearance: none;
  border: none;
  background: transparent;
  color: #615f5f;
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  margin: 0 auto;
  font-size: 41px;
  line-height: 32px;
  align-items: center;
  justify-content: center;
  outline: none;
}

.add-button:hover, .add-button:focus {
  color: #00b500;
}

.add-button:active {
  color: #008000;
}
</style>

<button on:click={() => onClick()} class="add-button">⊕</button>
