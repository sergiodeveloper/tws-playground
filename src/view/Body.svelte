<script lang="ts">
import Operations from "./Operations.svelte";
import Header from "./Header.svelte";
import Result from "./Result.svelte";

export let appName: string;
export let logoPath: string;
export let schemaPath: string;
export let serverPath: string;

let rightPanelVisible = false;

function toggleRightPanel() {
  rightPanelVisible = !rightPanelVisible;
}

let executionResult: unknown;

function onSubmit(event: { detail: { result: unknown } }) {
  executionResult = event.detail.result;
  rightPanelVisible = true;
}
</script>

<style>
.root {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
}

.left-panel, .right-panel {
  flex-grow: 0;
  flex-shrink: 0;
  width: 50%;
  height: 100%;
  position: relative;
  background-color: white;
  overflow: visible;
}

.scrollable {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
}

.cover {
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.pull-tab {
  display: none;
  border-radius: 100px 100px 0 0;
  width: 60px;
  height: 30px;
  background-color: white;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -30px;
  cursor: pointer;
  box-shadow: 0 -5px 5px rgb(0 0 0 / 10%);
  padding: 5px 0 0 0;
  box-sizing: border-box;
  border: 0;
  outline: 0;
  margin: 0;
}

.pull-tab:focus {
  outline: 0;
  background-color: #f5f5f5;
}

.pull-tab:active {
  background-color: #eaeaea;
}

.pull-tab-line {
  width: 22px;
  height: 2px;
  background-color: #7d7d7d;
  margin: 6px auto;
}

@media (max-width: 700px) {
  .pull-tab {
    display: block;
  }
  .left-panel {
    width: 100%;
  }
  .right-panel {
    width: 100%;
    height: 90%;
    position: absolute;
    top: 100%;
    left: 0;
    transition: top 0.5s;
    box-shadow: none;
  }
  .right-panel-visible {
    top: 10%;
    box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.8);
  }
  .cover-visible {
    display: block;
  }
}

.left-panel {
  z-index: 1;
}
.cover {
  z-index: 2;
}
.right-panel {
  z-index: 3;
}
</style>

<Header {appName} {logoPath} />

<div
  class="cover"
  class:cover-visible={rightPanelVisible}
  on:click={toggleRightPanel}
  on:keypress={toggleRightPanel}
></div>

<div class="root">
  <div class="left-panel">
    <div class="scrollable">
      <Operations {schemaPath} {serverPath} on:submit={onSubmit} />
    </div>
  </div>
  <div class="right-panel" class:right-panel-visible={rightPanelVisible}>
    <button
      class="pull-tab"
      on:click={toggleRightPanel}
    >
      <div class="pull-tab-line"></div>
      <div class="pull-tab-line"></div>
    </button>
    <div class="scrollable">
      <Result text={JSON.stringify(executionResult, null, 2)} />
    </div>
  </div>
</div>
