<script lang="ts">
import { createEventDispatcher } from "svelte";
import Info from "../component/Info.svelte";
import RemoveButton from "../component/RemoveButton.svelte";

export let name: string | undefined = undefined;
export let description: string | undefined = undefined;
export let required: boolean = true;
export let removable: boolean;

const dispatch = createEventDispatcher();

function onRemove() {
  dispatch('remove', {});
}
</script>

<style>
.root {
  flex-grow: 1;
  display: block;
  font-size: 15px;
  font-family: 'Roboto', sans-serif;
  padding: 3px 0;
}

.row {
  text-align: start;
  padding: 3px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.row .left {
  flex-grow: 1;
  flex-shrink: 0;
}

.row .right {
  flex-grow: 0;
  flex-shrink: 0;
}

.optional {
  color: #999;
}

.optional, .name {
  vertical-align: middle;
}
</style>

<div class="root">
  <div class="row">
    <div class="left">
      {#if description}
        <Info text={description} />
      {/if}
      {#if !required}
        <span class="optional">(Optional)</span>
      {/if}
      {#if name}
        <span class="name">{name}:</span>
      {/if}
    </div>
    <div class="right">
      {#if removable}
        <RemoveButton on:click={() => onRemove()} />
      {/if}
    </div>
  </div>
  <slot />
</div>
