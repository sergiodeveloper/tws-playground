<script lang="ts">
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

function onClick() {
  dispatch('click', {});
}
</script>

<style>
.remove-button {
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
  font-size: 30px;
  line-height: 32px;
  align-items: center;
  justify-content: center;
  outline: none;
}

.remove-button:hover, .remove-button:focus {
  color: red;
}

.remove-button:active {
  color: #b50000;
}
</style>

<button on:click={() => onClick()} class="remove-button">×</button>
