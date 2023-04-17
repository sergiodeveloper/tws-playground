<script lang="ts">
import { createEventDispatcher } from 'svelte';
import StringInput from "../component/StringInput.svelte";
import AddButton from '../component/AddButton.svelte';
import RemoveButton from '../component/RemoveButton.svelte';

let headers: { key: string, value: string }[] = [{ key: '', value: '' }];

let expanded = false;

const dispatch = createEventDispatcher();

function onChange() {
  headers = [...headers];

  const headersObject: { [key: string]: string } = {};
  headers.forEach(({ key, value }) => {
    if (key) {
      headersObject[key] = value;
    }
  });

  dispatch('change', { value: headersObject });
}
</script>

<style>
.root {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  padding: 15px;
}

.title {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  padding: 0;
  margin: 0;
  text-align: left;
  width: 100%;
}

.triangle {
  font-size: 10px;
}

.content {
  display: none;
}

.content.expanded {
  display: block;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
}

.equals {
  margin: 0 10px;
}

.key, .value {
  display: flex;
  flex-direction: row;
  width: 50%;
  align-items: center;
}
</style>

<div class="root">
  <button class="title" on:click={() => expanded = !expanded}>
    <span class="triangle">{expanded ? '▼' : '▶'}</span>
    🔒 Headers
  </button>

  <div class="content" class:expanded={expanded}>
    {#each headers as { key, value }, i (i)}
      <div class="header">
        <div class="key">
          <StringInput
            value={key}
            multiline={false}
            on:change={(event) => {
              headers[i].key = event.detail.value;
              onChange();
            }}
          />
          <div class="equals">=</div>
        </div>
        <div class="value">
          <StringInput
            value={value}
            multiline={false}
            on:change={(event) => {
              headers[i].value = event.detail.value;
              onChange();
            }}
          />
          <RemoveButton
            on:click={() => {
              headers.splice(i, 1);
              onChange();
            }}
          />
        </div>
      </div>
    {/each}

    <AddButton
      on:click={() => {
        headers.push({ key: '', value: '' });
        onChange();
      }}
    />
  </div>
</div>
