<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { Schema, OperationMap } from '@tws-js/server';
import Select from '../component/Select.svelte';
import RootForm from './RootForm.svelte';
import MainButton from '../component/MainButton.svelte';
import { makeHttpRequest } from '../utils';
import Headers from './Headers.svelte';

export let schemaPath: string;
export let serverPath: string;

let schema: Schema<OperationMap>;
let loading = true;
let error = false;

makeHttpRequest(schemaPath)
  .then(response => {
    if (response.status === 200) {
      loading = false;
      try {
        schema = JSON.parse(response.body);
      } catch (e) {
        console.error("Error parsing schema from " + schemaPath, e);
        error = true;
      }
    } else {
      console.error("Error loading schema from " + schemaPath);
      loading = false;
      error = true;
    }
  });

$: operationOptions = schema && Object.keys(schema.operations).map(key => ({
  label: schema.operations[key].title || key,
  value: key,
  operation: schema.operations[key],
}));

$: selectedOperation = operationOptions && operationOptions[0];

function onOperationChange(e: { detail: { value: string } }) {
  const operation = operationOptions.find(op => op.value === e.detail.value);
  if (operation) {
    selectedOperation = operation;
  }
}

$: inputDefinition = selectedOperation && selectedOperation.operation.input;

let input: Record<string, unknown> = {};

function onFormInputChange(e: { detail: { value: Record<string, unknown> } }) {
  input = e.detail.value;
}

let headers: { [key: string]: string } = {};

function onHeadersChange(event: { detail: { value: { [key: string]: string } } }) {
  headers = event.detail.value;
}

const dispatch = createEventDispatcher();

async function onSubmit() {
  const response = await makeHttpRequest(
    serverPath,
    'POST',
    JSON.stringify({
      operation: selectedOperation.value,
      input,
    }),
    headers,
  );

  dispatch('submit', {
    result: JSON.parse(response.body),
  });
}
</script>

<style>
.root {
  display: flex;
  flex-direction: column;
  padding: 15px;
  padding-bottom: 35px;
  min-height: 100%;
  box-sizing: border-box;
}

span {
  font-size: 15px;
  font-family: 'Roboto', sans-serif;
}

.text-center {
  text-align: center;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1;
}

.description {
  text-align: center;
  margin: 8px 0;
}

.submit-area {
  margin: 15px 0;
}
</style>

<div class="root">
  {#if loading}
    <div class="center">
      <span>Loading schema...</span>
    </div>
  {:else if error}
    <div class="center">
      <span>Error loading schema</span>
    </div>
  {:else}
    <Headers on:change={onHeadersChange} />

    <Select options={operationOptions} on:change={onOperationChange} initial={selectedOperation.value} />

    <div class="description">
      <span>{selectedOperation.operation.description || ''}</span>
    </div>

    <div class="text-center">
      <RootForm {inputDefinition} on:change={onFormInputChange} />

      <div class="submit-area">
        <MainButton text="Submit" on:click={onSubmit} />
      </div>
    </div>
  {/if}
</div>
